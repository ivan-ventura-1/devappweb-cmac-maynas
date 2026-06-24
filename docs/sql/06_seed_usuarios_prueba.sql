-- 06_seed_usuarios_prueba.sql
-- cliente@cmac.com / cmac1234
INSERT INTO public.roles_usuario (user_id, rol) VALUES ('a8e4b064-ca59-464e-9f69-baa40e1a529f','cliente') ON CONFLICT (user_id) DO NOTHING;
-- asesor@cmac.com / cmac1234
INSERT INTO public.roles_usuario (user_id, rol) VALUES ('005451c5-d863-4259-857c-8cfedcf85915','asesor') ON CONFLICT (user_id) DO NOTHING;
-- Cuenta ahorro cliente
INSERT INTO public.cuentas_ahorro (user_id, saldo, meta_ahorro, tasa_interes, fecha_apertura) VALUES ('a8e4b064-ca59-464e-9f69-baa40e1a529f', 1900.00, 5000.00, 4.50, '2026-06-18') ON CONFLICT (user_id) DO NOTHING;
-- Casos mora referencia
INSERT INTO public.mora_creditos (user_id, dias_mora, banda, monto_deuda, estado_gestion, observaciones) VALUES
  ('a8e4b064-ca59-464e-9f69-baa40e1a529f', 15, 'preventiva', 504.73,  'pendiente', 'Primera cuota sin pagar'),
  ('a8e4b064-ca59-464e-9f69-baa40e1a529f', 45, 'temprana',   1009.46, 'pendiente', 'Dos cuotas sin pagar'),
  ('a8e4b064-ca59-464e-9f69-baa40e1a529f', 95, 'tardia',     2523.65, 'pendiente', 'Cuatro cuotas sin pagar');
