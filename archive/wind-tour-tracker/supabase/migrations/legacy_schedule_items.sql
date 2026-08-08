CREATE TABLE public.schedule_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day INTEGER NOT NULL,
  sort_index INTEGER NOT NULL DEFAULT 0,
  time TEXT,
  category TEXT,
  place TEXT,
  transport TEXT,
  price_min NUMERIC,
  price_max NUMERIC,
  price_basis TEXT,
  currency TEXT,
  link TEXT,
  memo TEXT,
  status TEXT DEFAULT '예정',
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.schedule_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule_items TO authenticated;
GRANT ALL ON public.schedule_items TO service_role;

ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read schedule items" ON public.schedule_items FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert" ON public.schedule_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON public.schedule_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete" ON public.schedule_items FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER schedule_items_updated_at BEFORE UPDATE ON public.schedule_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_items;
