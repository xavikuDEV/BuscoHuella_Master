-- migration: add assigned_sector_id to profiles and create hue_transactions

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS assigned_sector_id UUID REFERENCES public.sectors(id);

CREATE TABLE IF NOT EXISTS public.hue_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    amount NUMERIC NOT NULL,
    reason TEXT NOT NULL,
    validator_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Activar RLS
ALTER TABLE public.hue_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para hue_transactions
-- Los usuarios pueden ver sus propias transacciones
CREATE POLICY "Usuarios pueden ver sus propias transacciones" 
ON public.hue_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Los validadores con roles superiores pueden ver todas
CREATE POLICY "Validadores pueden ver todas las transacciones" 
ON public.hue_transactions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('police', 'vet', 'admin', 'gov_municipality')
  )
);

-- Los validadores pueden insertar transacciones
CREATE POLICY "Validadores pueden insertar transacciones" 
ON public.hue_transactions FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('police', 'vet', 'admin', 'gov_municipality')
  )
);
