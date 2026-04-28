-- BUSCOHUELLA MASTER SCHEMA V1.1
-- Fuente de Verdad del Búnker (Idempotente)

-- ==========================================
-- 0. EXTENSIONES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLAS CORE (CREATE TABLE IF NOT EXISTS)
-- ==========================================

-- Perfiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'police', 'vet', 'shelter', 'admin')),
    avatar_url TEXT,
    phone TEXT,
    location_city TEXT,
    verification_status TEXT DEFAULT 'unverified',
    balance_hue NUMERIC DEFAULT 0,
    assigned_sector_id UUID REFERENCES public.sectors(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()

);

-- Sectores (Aseguramos que exista)
CREATE TABLE IF NOT EXISTS public.sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    municipality_id UUID,
    boundary GEOMETRY,
    is_partner BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Animales (DUA)
CREATE TABLE IF NOT EXISTS public.animals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dua_id TEXT UNIQUE NOT NULL,
    microchip TEXT UNIQUE,
    name TEXT NOT NULL,
    species TEXT,
    breed TEXT,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    health_notes JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Incidencias
CREATE TABLE IF NOT EXISTS public.incidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    description TEXT,
    location_lat DOUBLE PRECISION NOT NULL,
    location_lng DOUBLE PRECISION NOT NULL,
    reporter_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'open',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Transacciones HUE
CREATE TABLE IF NOT EXISTS public.hue_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    amount NUMERIC NOT NULL,
    reason TEXT NOT NULL,
    validator_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ==========================================
-- 2. SEGURIDAD RLS (BLINDAJE)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hue_transactions ENABLE ROW LEVEL SECURITY;


-- Limpieza de políticas existentes para evitar el error 42710
DO $$ 
BEGIN
    -- Profiles
    DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON public.profiles;
    DROP POLICY IF EXISTS "Usuarios actualizan su propio perfil" ON public.profiles;
    -- Animals
    DROP POLICY IF EXISTS "Acceso a animales según rol" ON public.animals;
    -- Incidences
    DROP POLICY IF EXISTS "Incidencias visibles para todos" ON public.incidences;
    DROP POLICY IF EXISTS "Gestión de incidencias por autor o autoridad" ON public.incidences;
    -- Sectors
    DROP POLICY IF EXISTS "Sectores visibles para todos" ON public.sectors;
END $$;

-- Creación de políticas nuevas
CREATE POLICY "Usuarios ven su propio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios actualizan su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Acceso a animales según rol" ON public.animals FOR SELECT 
USING (auth.uid() = owner_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('police', 'vet', 'admin')));

CREATE POLICY "Incidencias visibles para todos" ON public.incidences FOR SELECT USING (true);
CREATE POLICY "Gestión de incidencias por autor o autoridad" ON public.incidences FOR ALL 
USING (auth.uid() = reporter_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('police', 'admin')));

CREATE POLICY "Sectores visibles para todos" ON public.sectors FOR SELECT USING (true);

-- ==========================================
-- 3. AUTOMATIZACIÓN (TRIGGERS & FUNCTIONS)
-- ==========================================

-- Función: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'citizen');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: on_auth_user_created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: update_animals_updated_at
DROP TRIGGER IF EXISTS update_animals_updated_at ON public.animals;
CREATE TRIGGER update_animals_updated_at 
  BEFORE UPDATE ON public.animals 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==========================================
-- 4. TRATAMIENTO DE TABLAS DE SISTEMA (POSTGIS)
-- ==========================================
-- Intentamos revocar acceso público para silenciar la alerta (aunque no seamos dueños)
REVOKE SELECT ON public.spatial_ref_sys FROM anon, authenticated;