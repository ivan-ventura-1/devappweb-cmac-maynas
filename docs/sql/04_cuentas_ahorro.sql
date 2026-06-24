-- 04_cuentas_ahorro.sql — Tasa referencial 4.50% TEA
CREATE TABLE IF NOT EXISTS public.cuentas_ahorro (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    saldo          NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (saldo >= 0),
    meta_ahorro    NUMERIC(12,2) DEFAULT 0,
    tasa_interes   NUMERIC(5,2) NOT NULL DEFAULT 4.50,
    fecha_apertura DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(user_id)
);
CREATE INDEX IF NOT EXISTS idx_ahorro_user_id ON public.cuentas_ahorro(user_id);
ALTER TABLE public.cuentas_ahorro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role acceso total" ON public.cuentas_ahorro USING (true) WITH CHECK (true);
