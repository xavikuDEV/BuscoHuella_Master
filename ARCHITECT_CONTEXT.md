# 🏗️ ARCHITECT CONTEXT: BuscoHuella Ecosystem
> Última actualización: 26/04/2026 16:29:14

## 📍 Estado Actual: FASE 3 (Conectividad y Auth) 🛰️
- **Infraestructura:** Monorepo pnpm (Next.js 16 + Expo).
- **Core:** Shared-core con Supabase Client universal.
- **DB:** Esquema sellado (animals, incidences, profiles) con RLS.
- **Dashboard:** Command Center Pro funcional con telemetría real.

## 🎯 Estrategia Multi-Inquilino (Sabadell / Terrassa / ...)
- **Aislamiento:** Filtrado por municipality_id vía RLS.
- **RBAC:** Roles dinámicos (police, vet, pro, citizen, admin).
- **Web-App:** buscohuella.app para acceso público rápido (Found & Scan).

## 📉 Backlog Inmediato
- [ ] Implementar Middleware de redirección por Rol.
- [ ] Pantalla de Login / Registro con validación de perfil.
- [ ] Mapeo de Geo-Zonas para nuevos ayuntamientos.
