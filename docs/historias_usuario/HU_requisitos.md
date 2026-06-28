# Historias de Usuario y Requisitos Funcionales — CMAC Maynas

## Modulo 1: Autenticacion y Roles

### HU-01 — Login de usuario
**Como** usuario registrado  
**Quiero** iniciar sesion con mi correo y contrasena  
**Para** acceder al sistema segun mi rol

**Criterios de aceptacion:**
- El sistema valida credenciales via Supabase Auth
- Se genera un JWT valido al iniciar sesion
- El sistema redirige al dashboard segun rol (cliente/asesor/admin/comite)
- Si las credenciales son incorrectas muestra mensaje de error

**RF-01:** El sistema debe autenticar usuarios con JWT firmado por Supabase Auth  
**RF-02:** El sistema debe asignar roles: cliente, asesor, admin, comite, riesgos, gerencia

---

### HU-02 — Control de acceso por rol
**Como** administrador del sistema  
**Quiero** que cada usuario solo acceda a las funciones de su rol  
**Para** garantizar la seguridad de las operaciones

**Criterios de aceptacion:**
- Un cliente no puede ver solicitudes de otros clientes
- Un asesor no puede castigar creditos (solo comite)
- Intentos no autorizados retornan HTTP 403
- Las acciones criticas (judicial, castigo) requieren roles especificos

**RF-03:** El middleware soloRol debe validar el rol en cada endpoint protegido  
**RF-04:** Las acciones de mora judicial requieren rol admin o comite

---

## Modulo 2: Credito Empresarial

### HU-03 — Solicitud de credito
**Como** cliente  
**Quiero** solicitar un credito desde el homebanking  
**Para** financiar mi negocio sin ir a una agencia

**Criterios de aceptacion:**
- El cliente puede seleccionar monto, plazo y tipo de credito
- El sistema calcula la cuota mensual automaticamente (formula francesa)
- La solicitud queda en estado "pendiente" hasta que un asesor la evalua
- El cliente ve el estado de su solicitud en tiempo real

**RF-05:** Calcular cuota con formula francesa: cuota = monto x TEM / (1-(1+TEM)^-n)  
**RF-06:** TEA empresarial 43.92% sin seguro / 40.92% con seguro de desgravamen

---

### HU-04 — Evaluacion crediticia (asesor)
**Como** asesor de negocios  
**Quiero** evaluar una solicitud registrando ingresos y gastos del cliente  
**Para** determinar si califica para el credito

**Criterios de aceptacion:**
- El asesor registra ingreso neto y gasto familiar
- El sistema calcula RDS = cuota / ingreso disponible x 100
- El sistema calcula Score = 100 - RDS
- Si RDS <= 40% y Score >= 60: aprobado por scoring automatico
- Si Score < 60: pasa a comite
- Si RDS > 40%: rechazado automatico

**RF-07:** RDS maximo permitido: 40% del ingreso disponible  
**RF-08:** Score minimo para aprobacion automatica: 60 puntos

---

### HU-05 — Aprobacion y desembolso
**Como** administrador  
**Quiero** aprobar y desembolsar creditos evaluados  
**Para** completar el flujo de otorgamiento

**Criterios de aceptacion:**
- El admin puede aprobar o rechazar solicitudes en comite
- Al desembolsar, el sistema registra automaticamente el movimiento tipo "credito"
- El saldo de la cuenta de ahorro del cliente se actualiza automaticamente
- El cliente ve el credito desembolsado en su dashboard

**RF-09:** Al desembolsar registrar movimiento automatico en tabla movimientos  
**RF-10:** Nivel de aprobacion: asesor (<=10k), comite (<=50k), jefe regional (>50k)

---

### HU-06 — Cronograma de pagos
**Como** cliente  
**Quiero** ver el cronograma de pagos de mis creditos desembolsados  
**Para** saber cuanto y cuando pagar cada mes

**Criterios de aceptacion:**
- El cronograma muestra N cuotas con capital, interes y saldo
- Las cuotas son iguales (sistema frances)
- Solo se muestra para creditos en estado "desembolsado"

**RF-11:** Generar cronograma completo con formula de amortizacion francesa

---

## Modulo 3: Mora y Recuperaciones

### HU-07 — Consulta de cartera morosa (R1)
**Como** asesor  
**Quiero** ver todos los creditos en mora clasificados por banda  
**Para** priorizar las gestiones de cobranza

**Criterios de aceptacion:**
- Se muestran las 5 bandas: preventiva, temprana, tardia, judicial, castigo
- Cada banda muestra conteo y monto total
- Se pueden filtrar por banda

**RF-12:** Bandas de mora: preventiva(1-30d), temprana(31-60d), tardia(61-120d), judicial(121-180d), castigo(>180d)

---

### HU-08 — Registro de gestiones de cobranza (R2)
**Como** asesor  
**Quiero** registrar las gestiones realizadas a cada cliente moroso  
**Para** tener un historial de contactos y compromisos

**Criterios de aceptacion:**
- El asesor puede registrar observaciones por credito moroso
- Se guarda la fecha de ultima gestion
- El historial es acumulativo (tabla mora_gestiones)

**RF-13:** Registrar gestiones con tipo: seguimiento, llamada, visita, compromiso_pago

---

### HU-09 — Derivacion judicial y castigo (R3)
**Como** administrador o miembro del comite  
**Quiero** derivar creditos a cobranza judicial o castigarlos  
**Para** gestionar la cartera irrecuperable

**Criterios de aceptacion:**
- Solo creditos con >120 dias de mora pueden ir a judicial
- Solo creditos con >180 dias pueden ser castigados
- Judicial requiere rol admin o comite
- Castigo requiere rol comite o gerencia

**RF-14:** Validar dias de mora antes de permitir transicion a judicial/castigo  
**RF-15:** Estado derivado_judicial debe persistirse en BD correctamente

---

## Modulo 4: Captaciones y Ahorros

### HU-10 — Cuenta de ahorros
**Como** cliente  
**Quiero** tener una cuenta de ahorros y hacer depositos  
**Para** acumular dinero con intereses

**Criterios de aceptacion:**
- El cliente puede crear una cuenta de ahorros
- Puede depositar montos desde el homebanking
- Ve su saldo actualizado en tiempo real
- Al recibir un desembolso, el saldo se actualiza automaticamente

**RF-16:** Tasa de interes referencial: 4.50% TEA  
**RF-17:** Un cliente puede tener solo una cuenta de ahorros activa
