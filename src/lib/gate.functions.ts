import { createServerFn } from "@tanstack/react-start";
import { useSession, getRequestHost } from "@tanstack/react-start/server";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean; until?: number };

function getSessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "aed-gate",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function signToken(payload: string): string {
  return b64url(createHmac("sha256", process.env["SESSION_SECRET"]!).update(payload).digest());
}

/** Token-Format: <expMs>.<label-b64url>.<signatur> */
function buildToken(exp: number, label: string): string {
  const body = `${exp}.${b64url(Buffer.from(label, "utf8"))}`;
  return `${body}.${signToken(body)}`;
}

function verifyToken(token: string): { valid: boolean; exp?: number } {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };
  const [expRaw, labelRaw, sig] = parts;
  const expected = signToken(`${expRaw}.${labelRaw}`);
  if (sig!.length !== expected.length) return { valid: false };
  if (!timingSafeEqual(Buffer.from(sig!), Buffer.from(expected))) return { valid: false };
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= Date.now()) return { valid: false };
  return { valid: true, exp };
}

async function readSession() {
  const session = await useSession<GateSession>(getSessionConfig());
  const until = session.data.until ?? 0;
  const unlocked = session.data.unlocked === true && until > Date.now();
  return { session, unlocked, until };
}

/** Lovable-Editor-/Vorschau-Umgebungen umgehen die Passwort-Wall. */
function isEditorHost(): boolean {
  let host = "";
  try {
    host = (getRequestHost() ?? "").toLowerCase();
  } catch {
    return false;
  }
  return (
    host.endsWith(".lovableproject.com") ||
    host.startsWith("id-preview--") ||
    host.includes("-dev.lovable.app") ||
    host.startsWith("localhost")
  );
}

export const isUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  if (isEditorHost()) return { unlocked: true };
  const { unlocked } = await readSession();
  return { unlocked };
});

export const gateStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { unlocked, until } = await readSession();
  return { unlocked, until: unlocked ? until : 0 };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"];
    if (!expected) throw new Error("SITE_PASSWORD ist nicht gesetzt");
    if (!passwordMatches(data.password ?? "", expected)) {
      return { ok: false as const };
    }
    const session = await useSession<GateSession>(getSessionConfig());
    const until = Date.now() + 1000 * 60 * 60 * 24 * 30;
    await session.update({ unlocked: true, until });
    return { ok: true as const, until };
  });

/** Löst einen Einladungs-Token ein (Link-Zugriff ohne Passwort). */
export const redeemToken = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const res = verifyToken(data.token ?? "");
    if (!res.valid) return { ok: false as const };
    const session = await useSession<GateSession>(getSessionConfig());
    await session.update({ unlocked: true, until: res.exp! });
    return { ok: true as const, until: res.exp! };
  });

/** Erzeugt einen zeitlich begrenzten Preview-Link – nur für bereits entsperrte Sessions. */
export const createPreviewLink = createServerFn({ method: "POST" })
  .inputValidator((data: { days: number; label?: string }) => data)
  .handler(async ({ data }) => {
    const { unlocked } = await readSession();
    if (!unlocked) return { ok: false as const };
    const days = Math.min(Math.max(Math.round(data.days || 7), 1), 90);
    const exp = Date.now() + days * 24 * 60 * 60 * 1000;
    const token = buildToken(exp, (data.label ?? "").slice(0, 60));
    return { ok: true as const, token, exp };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(getSessionConfig());
  await session.clear();
  return { ok: true as const };
});
