-- 01_roles_usuario.sql
CREATE TABLE IF NOT EXISTS public.roles_usuario (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rol        TEXT NOT NULL CHECK (rol IN ('cliente','asesor','admin','comite')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);
CREATE INDEX IF NOT EXISTS idx_roles_usuario_user_id ON public.roles_usuario(user_id);
ALTER TABLE public.roles_usuario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role acceso total" ON public.roles_usuario USING (true) WITH CHECK (true);
