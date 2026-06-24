-- 05_movimientos.sql — Tipos: deposito, retiro, credito, pago_cuota
CREATE TABLE IF NOT EXISTS public.movimientos (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo        TEXT NOT NULL CHECK (tipo IN ('deposito','retiro','credito','pago_cuota')),
    monto       NUMERIC(12,2) NOT NULL CHECK (monto > 0),
    descripcion TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_movimientos_user_id ON public.movimientos(user_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo    ON public.movimientos(tipo);
ALTER TABLE public.movimientos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role acceso total" ON public.movimientos USING (true) WITH CHECK (true);
