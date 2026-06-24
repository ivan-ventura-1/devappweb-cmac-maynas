-- 03_mora_creditos.sql
-- Bandas: preventiva(1-30), temprana(31-60), tardia(61-120), judicial(121-180), castigo(>180)
CREATE TABLE IF NOT EXISTS public.mora_creditos (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solicitud_id         UUID REFERENCES public.solicitudes_prestamo(id) ON DELETE SET NULL,
    user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dias_mora            INTEGER NOT NULL CHECK (dias_mora > 0),
    banda                TEXT NOT NULL CHECK (banda IN ('preventiva','temprana','tardia','judicial','castigo')),
    monto_deuda          NUMERIC(12,2) NOT NULL CHECK (monto_deuda > 0),
    estado_gestion       TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_gestion IN ('pendiente','gestionado','castigado')),
    fecha_ultima_gestion TIMESTAMPTZ,
    observaciones        TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mora_user_id ON public.mora_creditos(user_id);
CREATE INDEX IF NOT EXISTS idx_mora_banda   ON public.mora_creditos(banda);
ALTER TABLE public.mora_creditos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role acceso total" ON public.mora_creditos USING (true) WITH CHECK (true);
