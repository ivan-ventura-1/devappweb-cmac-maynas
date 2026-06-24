-- 07_reglas_negocio.sql — Vistas y funciones auxiliares

-- Vista cartera por estado
CREATE OR REPLACE VIEW public.v_resumen_cartera AS
SELECT estado, COUNT(*) AS total, SUM(monto) AS monto_total, AVG(rds) AS rds_promedio, AVG(score) AS score_promedio
FROM public.solicitudes_prestamo GROUP BY estado;

-- Vista mora por banda
CREATE OR REPLACE VIEW public.v_mora_por_banda AS
SELECT banda, COUNT(*) AS total, SUM(monto_deuda) AS monto_total, AVG(dias_mora) AS dias_promedio,
  COUNT(*) FILTER (WHERE estado_gestion='pendiente') AS sin_gestionar
FROM public.mora_creditos GROUP BY banda
ORDER BY CASE banda WHEN 'preventiva' THEN 1 WHEN 'temprana' THEN 2 WHEN 'tardia' THEN 3 WHEN 'judicial' THEN 4 WHEN 'castigo' THEN 5 END;

-- Funcion TEM
CREATE OR REPLACE FUNCTION public.fn_calcular_tem(p_tea NUMERIC) RETURNS NUMERIC AS $$
BEGIN RETURN POWER(1 + p_tea/100, 1.0/12) - 1; END; $$ LANGUAGE plpgsql IMMUTABLE;

-- Funcion cuota mensual (frances)
CREATE OR REPLACE FUNCTION public.fn_cuota_mensual(p_monto NUMERIC, p_plazo INTEGER, p_tea NUMERIC) RETURNS NUMERIC AS $$
DECLARE v_tem NUMERIC;
BEGIN v_tem := public.fn_calcular_tem(p_tea); RETURN ROUND(p_monto * v_tem / (1 - POWER(1+v_tem, -p_plazo)), 2); END; $$ LANGUAGE plpgsql IMMUTABLE;

-- Funcion RDS
CREATE OR REPLACE FUNCTION public.fn_calcular_rds(p_cuota NUMERIC, p_ingreso NUMERIC, p_gasto NUMERIC) RETURNS NUMERIC AS $$
BEGIN IF (p_ingreso - p_gasto) <= 0 THEN RETURN 100; END IF; RETURN ROUND((p_cuota / (p_ingreso - p_gasto)) * 100, 2); END; $$ LANGUAGE plpgsql IMMUTABLE;
