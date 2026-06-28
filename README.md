# CMAC Maynas — Sistema Bancario Integrado

Proyecto integrado para el curso **Desarrollo de Aplicaciones Web (DevAppWeb)** — Universidad Continental — Ciclo 5.

## Descripcion

Sistema bancario completo que simula las operaciones de la **Caja Municipal de Ahorro y Credito de Maynas**, compuesto por:

- **HomeBanking**: Portal web para clientes (solicitudes, ahorros, movimientos, cronograma)
- **Core Financiero**: Panel interno para asesores, administradores y comite

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Frontend | React + Vite (puerto 5173) |
| Backend | Node.js + Express (puerto 3000) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticacion | Supabase Auth + JWT |

## Arquitectura

## Instalacion y ejecucion

### Requisitos
- Node.js >= 18
- Cuenta Supabase activa

### Backend
```bash
cd devappweb-cmac-maynas
npm install
node app.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Variables de entorno (.env)
## Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Cliente | cliente@cmac.com | cmac1234 |
| Asesor | asesor@cmac.com | cmac1234 |

## Modulos implementados

- Autenticacion JWT con RBAC (6 roles: cliente, asesor, admin, comite, riesgos, gerencia)
- Solicitudes de credito con scoring automatico (RDS + Score)
- Amortizacion francesa con TEA 43.92% / 40.92%
- Ruta de aprobacion por monto (asesor / comite / jefe regional)
- Modulo de mora con 5 bandas (preventiva/temprana/tardia/judicial/castigo)
- Historial de gestiones de cobranza
- Cuentas de ahorro con depositos y movimientos
- Cronograma de pagos en homebanking
- Reportes BI con datos en tiempo real
- Scripts SQL versionados (00-07)
- Diagramas UML (casos de uso, secuencia, componentes, modelo de datos)

## Documentacion

- `docs/sql/` — Scripts SQL versionados 00-07
- `docs/uml/` — Diagramas PlantUML + PNG
- `docs/historias_usuario/` — Historias de usuario y requisitos funcionales

## Repositorio

GitHub: [ivan-ventura-1/devappweb-cmac-maynas](https://github.com/ivan-ventura-1/devappweb-cmac-maynas)

## Autor

Ivan Ventura — Estudiante #30 — Universidad Continental
