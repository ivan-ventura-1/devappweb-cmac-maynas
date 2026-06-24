-- 02_solicitudes_prestamo.sql
-- TEA 43.92% sin seguro / 40.92% con seguro
-- TEM = (1+TEA)^(1/12) - 1
-- Cuota = monto x TEM / (1-(1+TEM)^-n)
CREATE TABLE IF NOT EXISTS public.solicitudes_prestamo (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    monto            NUMERIC(12,2) NOT NULL CHECK (monto > 0),
    plazo_meses      INTEGER NOT NULL CHECK (plazo_meses IN (6,12,18,24,36)),
    tasa_anual       NUMERIC(5,2) NOT NULL CHECK (tasa_anual IN (40.92,43.92)),
    cuota_mensual    NUMERIC(12,2),
    proposito        TEXT,
    estado           TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','en_evaluacion','rechazado_automatico','aprobado_scoring','en_comite','aprobado','rechazado','desembolsado')),
    ingreso_neto     NUMERIC(12,2),
    gasto_familiar   NUMERIC(12,2),
    rds              NUMERIC(5,2),
    score            NUMERIC(5,2),
    nivel_aprobacion TEXT CHECK (nivel_aprobacion IN ('asesor','comite','jefe_regional')),
    tipo_credito     TEXT DEFAULT 'empresarial',
    created_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_solicitudes_user_id ON public.solicitudes_prestamo(user_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado  ON public.solicitudes_prestamo(estado);
ALTER TABLE public.solicitudes_prestamo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role acceso total" ON public.solicitudes_prestamo USING (true) WITH CHECK (true);
