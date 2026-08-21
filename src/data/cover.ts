// Programmheft-Cover des aed e.V. (CDN-Assets), chronologisch sortiert
import c2006_02 from "@/assets/cover/2006_02_aed.png.asset.json";
import c2007_01 from "@/assets/cover/2007_01_aed.png.asset.json";
import c2007_02 from "@/assets/cover/2007_02_aed.png.asset.json";
import c2008_01 from "@/assets/cover/2008_01_aed.png.asset.json";
import c2008_02 from "@/assets/cover/2008_02_aed.png.asset.json";
import c2009_01 from "@/assets/cover/2009_01_aed.webp.asset.json";
import c2009_02 from "@/assets/cover/2009_02_aed.webp.asset.json";
import c2010_01 from "@/assets/cover/2010_01_aed.webp.asset.json";
import c2010_02 from "@/assets/cover/2010_02_aed.webp.asset.json";
import c2011_01 from "@/assets/cover/2011_01_aed.webp.asset.json";
import c2017_01 from "@/assets/cover/2017_01_aed.png.asset.json";
import c2017_02 from "@/assets/cover/2017_02_aed.png.asset.json";
import c2018_01 from "@/assets/cover/2018_01_aed.png.asset.json";
import c2018_02 from "@/assets/cover/2018_02_aed.png.asset.json";
import c2019_01 from "@/assets/cover/2019_01_aed.webp.asset.json";
import c2019_02 from "@/assets/cover/2019_02_aed.webp.asset.json";
import c2020_01 from "@/assets/cover/2020_01_aed.webp.asset.json";
import c2020_02 from "@/assets/cover/2020_02_aed.png.asset.json";

import c2022_01 from "@/assets/cover/2022_01_aed.png.asset.json";
import c2022_02 from "@/assets/cover/2022_02_aed.png.asset.json";
import c2023_01 from "@/assets/cover/2023_01_aed.webp.asset.json";
import c2023_02 from "@/assets/cover/2023_02_aed.webp.asset.json";
import c2024_01 from "@/assets/cover/2024_01_aed.webp.asset.json";
import c2024_02 from "@/assets/cover/2024_02_aed.png.asset.json";
import c2025_01 from "@/assets/cover/2025_01_aed.png.asset.json";
import c2025_02 from "@/assets/cover/2025_02_aed.png.asset.json";
import c2026_01 from "@/assets/cover/2026_01_aed.webp.asset.json";
import c2026_02 from "@/assets/cover/2026_02_aed.webp.asset.json";

export type Cover = { url: string; titel: string };

export const cover: Cover[] = [
  { url: c2006_02.url, titel: "Juli – Dezember 2006" },
  { url: c2007_01.url, titel: "Januar – Juli 2007" },
  { url: c2007_02.url, titel: "September – Dezember 2007" },
  { url: c2008_01.url, titel: "Januar – Juni 2008" },
  { url: c2008_02.url, titel: "Juli – Dezember 2008" },
  { url: c2009_01.url, titel: "Januar – Juni 2009" },
  { url: c2009_02.url, titel: "Juli – Dezember 2009" },
  { url: c2010_01.url, titel: "Januar – Juni 2010" },
  { url: c2010_02.url, titel: "Juli – Dezember 2010" },
  { url: c2011_01.url, titel: "Januar – Juni 2011" },
  { url: c2017_01.url, titel: "Januar – Juni 2017" },
  { url: c2017_02.url, titel: "Juli – Dezember 2017" },
  { url: c2018_01.url, titel: "Januar – Juni 2018" },
  { url: c2018_02.url, titel: "Juli – Dezember 2018" },
  { url: c2019_01.url, titel: "Januar – Juni 2019" },
  { url: c2019_02.url, titel: "Juli – Dezember 2019" },
  { url: c2020_01.url, titel: "Januar – Juni 2020" },
  { url: c2020_02.url, titel: "Juli – Dezember 2020" },
  { url: c2022_01.url, titel: "Januar – Juni 2022" },
  { url: c2022_02.url, titel: "Juli – Dezember 2022" },
  { url: c2023_01.url, titel: "Januar – Juni 2023" },
  { url: c2023_02.url, titel: "Juli – Dezember 2023" },
  { url: c2024_01.url, titel: "Januar – Juni 2024" },
  { url: c2024_02.url, titel: "Juli – Dezember 2024" },
  { url: c2025_01.url, titel: "Januar – Juni 2025" },
  { url: c2025_02.url, titel: "Juli – Dezember 2025" },
  { url: c2026_01.url, titel: "Januar – Juni 2026" },
  { url: c2026_02.url, titel: "Juli – Dezember 2026" },
];

export const coverBilder: string[] = cover.map((c) => c.url);
