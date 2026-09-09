CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  heading text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.sections TO service_role;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  source_url text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  section_id uuid REFERENCES public.sections(id) ON DELETE SET NULL,
  order_in_section integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.images TO service_role;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE INDEX images_article_idx ON public.images(article_id);
CREATE INDEX images_section_idx ON public.images(section_id);
CREATE INDEX sections_article_idx ON public.sections(article_id);

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER sections_updated_at BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER images_updated_at BEFORE UPDATE ON public.images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.articles (id, title) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Beispielartikel: neuland 2027');

INSERT INTO public.sections (id, article_id, heading, "order") VALUES
  ('22222222-2222-4222-8222-222222222201', '11111111-1111-4111-8111-111111111111', 'Einleitung', 1),
  ('22222222-2222-4222-8222-222222222202', '11111111-1111-4111-8111-111111111111', 'Preisverleihung', 2),
  ('22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111111', 'Ausgezeichnete Projekte', 3);

INSERT INTO public.images (article_id, source_url, image_url, section_id, order_in_section) VALUES
  ('11111111-1111-4111-8111-111111111111', 'https://aed-stuttgart.de/programm/preisverleihung', '/bilder/event/preisverleihung-aed-neuland-2023.webp', '22222222-2222-4222-8222-222222222202', 1),
  ('11111111-1111-4111-8111-111111111111', 'https://aed-stuttgart.de/programm/preisverleihung', '/bilder/event/sammlung-amann.webp', '22222222-2222-4222-8222-222222222202', 2),
  ('11111111-1111-4111-8111-111111111111', 'https://aed-stuttgart.de/programm/preisverleihung', '/bilder/event/zero-riehle-koeth.webp', NULL, 0),
  ('11111111-1111-4111-8111-111111111111', 'https://aed-stuttgart.de/programm/preisverleihung', '/bilder/event/curious-career-club.webp', NULL, 0),
  ('11111111-1111-4111-8111-111111111111', 'https://aed-neuland.de/gewinner/2023', '/bilder/projekt/2023/qio-0.webp', '22222222-2222-4222-8222-222222222203', 1),
  ('11111111-1111-4111-8111-111111111111', 'https://aed-neuland.de/gewinner/2023', '/bilder/projekt/2023/qio-1.webp', NULL, 0),
  ('11111111-1111-4111-8111-111111111111', 'https://aed-neuland.de/gewinner/2023', '/bilder/projekt/2023/a-fish-odyssey-0.webp', NULL, 0),
  ('11111111-1111-4111-8111-111111111111', 'https://aed-neuland.de/gewinner/2023', '/bilder/projekt/2023/neozoon-1.webp', NULL, 0);