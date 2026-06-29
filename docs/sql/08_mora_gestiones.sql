-- 08_mora_gestiones.sql
-- Historial acumulativo de gestiones de cobranza (R2) y de transiciones
-- de banda (R3 — derivacion judicial / castigo).
-- Usado por src/services/moraService.js:
--   registrarGestion()  -> tipo_gestion = 'seguimiento' (o el que envie el asesor)
--   derivarJudicial()   -> tipo_gestion = 'judicial'
--   castigar()          -> tipo_gestion = 'castigo'
--   obtenerHistorialGestiones() -> SELECT * ORDER BY created_at DESC
CREATE TABLE IF NOT EXISTS public.mora_gestiones (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mora_id       UUID NOT NULL REFERENCES public.mora_creditos(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    observacion   TEXT NOT NULL,
    tipo_gestion  TEXT NOT NULL DEFAULT 'seguimiento'
                  CHECK (tipo_gestion IN ('seguimiento','llamada','visita','compromiso_pago','judicial','castigo')),
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mora_gestiones_mora_id ON public.mora_gestiones(mora_id);
CREATE INDEX IF NOT EXISTS idx_mora_gestiones_user_id ON public.mora_gestiones(user_id);
ALTER TABLE public.mora_gestiones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role acceso total" ON public.mora_gestiones USING (true) WITH CHECK (true);
