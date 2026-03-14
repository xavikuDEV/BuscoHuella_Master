-- 1. Crear tabla de mascotas
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dua_id TEXT UNIQUE NOT NULL,
    dua_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT,
    gender TEXT,
    birth_date DATE,
    status TEXT DEFAULT 'active',
    
    -- Salud y Características
    weight DECIMAL(5,2),
    microchip_id TEXT UNIQUE,
    is_sterilized BOOLEAN DEFAULT false,
    is_vaccinated BOOLEAN DEFAULT false,
    medical_notes TEXT,
    avatar_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS (Seguridad a nivel de fila)
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Seguridad (The Owner Guard)
CREATE POLICY "Dueños pueden ver sus propias mascotas"
ON public.pets FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Dueños pueden crear mascotas"
ON public.pets FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Dueños pueden actualizar sus propias mascotas"
ON public.pets FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Dueños pueden borrar sus propias mascotas"
ON public.pets FOR DELETE
USING (auth.uid() = owner_id);

-- 4. Índices para búsqueda optimizada
CREATE INDEX idx_pets_owner_id ON public.pets(owner_id);
CREATE INDEX idx_pets_dua_id ON public.pets(dua_id);