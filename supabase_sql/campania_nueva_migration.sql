-- ============================================================
-- MIGRACIÓN: Nueva estructura de campañas y configuraciones
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Agregar columnas nuevas a la tabla campania
ALTER TABLE public.campania
    ADD COLUMN IF NOT EXISTS fecha_de_inicio       TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS tiempo_de_cancelacion INTEGER,
    ADD COLUMN IF NOT EXISTS banner_login          INTEGER,
    ADD COLUMN IF NOT EXISTS banner_general        INTEGER;

-- Eliminar columnas antiguas de campania
ALTER TABLE public.campania
    DROP COLUMN IF EXISTS banner_login_url,
    DROP COLUMN IF EXISTS banner_timer_url;

-- 2. Limpiar columnas antiguas de configuraciones
ALTER TABLE public.configuraciones
    DROP COLUMN IF EXISTS fecha_fin_campania,
    DROP COLUMN IF EXISTS campania_activa,
    DROP COLUMN IF EXISTS banner_login_url,
    DROP COLUMN IF EXISTS banner_timer_url,
    DROP COLUMN IF EXISTS color_tema,
    DROP COLUMN IF EXISTS nombre_campania,
    DROP COLUMN IF EXISTS nombre,
    DROP COLUMN IF EXISTS activo;

-- 3. Agregar nuevas columnas a configuraciones
ALTER TABLE public.configuraciones
    ADD COLUMN IF NOT EXISTS id_camp INTEGER REFERENCES public.campania(id_campania),
    ADD COLUMN IF NOT EXISTS banner  VARCHAR;

-- 4. Agregar FK de campania hacia configuraciones
--    (se hace después de que configuraciones ya tiene id_configuraciones como PK)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_campania_banner_login'
    ) THEN
        ALTER TABLE public.campania
            ADD CONSTRAINT fk_campania_banner_login
            FOREIGN KEY (banner_login) REFERENCES public.configuraciones(id_configuraciones);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_campania_banner_general'
    ) THEN
        ALTER TABLE public.campania
            ADD CONSTRAINT fk_campania_banner_general
            FOREIGN KEY (banner_general) REFERENCES public.configuraciones(id_configuraciones);
    END IF;
END $$;
