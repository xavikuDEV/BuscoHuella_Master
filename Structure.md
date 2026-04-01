# 🐾 Estructura del Búnker: BuscoHuella 2026
> **Última actualización:** 01/04/2026 15:05:46
> **Métricas:** **181** archivos · **90** TypeScript · **1** CSS · **1** SQL · **2** YAML

---

├── 📁 .aider.tags.cache.v4
│   └── 📄 cache.db
├── 📁 agents
│   ├── 📁 skills
│   │   ├── 📄 architect.md
│   │   ├── 📄 cloud-devops.md
│   │   ├── 📄 data-integrator.md
│   │   ├── 📄 db-specialist.md
│   │   ├── 📄 mobile-expert.md
│   │   ├── 📄 notion_sync.md
│   │   ├── 📄 orchestrator.md
│   │   ├── 📄 qa-tester.md
│   │   ├── 📄 security-officer.md
│   │   ├── 📄 specialist.md
│   │   ├── 📄 technical_writer.md
│   │   └── 📄 ui-ux-designer.md
│   ├── 📄 access_control.md
│   ├── 📄 AGENT_ROLES.md
│   ├── 📄 command_center.md
│   ├── 📄 profiles.md
│   └── 📄 skills.md
├── 📁 apps
│   ├── 📁 mobile-app
│   │   ├── 📁 assets
│   │   │   ├── 📄 android-icon-background.png
│   │   │   ├── 📄 android-icon-foreground.png
│   │   │   ├── 📄 android-icon-monochrome.png
│   │   │   ├── 📄 favicon.png
│   │   │   ├── 📄 icon.png
│   │   │   └── 📄 splash-icon.png
│   │   ├── 📄 .gitignore
│   │   ├── 📄 app.json
│   │   ├── 📄 App.tsx
│   │   ├── 📄 index.ts
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   └── 📁 web-pro
│       ├── 📁 e2e
│       │   ├── 📄 dashboard.test.ts
│       │   └── 📄 smoke.test.ts
│       ├── 📁 public
│       │   ├── 📄 file.svg
│       │   ├── 📄 globe.svg
│       │   ├── 📄 next.svg
│       │   ├── 📄 vercel.svg
│       │   └── 📄 window.svg
│       ├── 📁 src
│       │   ├── 📁 __tests__
│       │   │   ├── 📁 components
│       │   │   │   ├── 📄 IncidentReport.test.tsx
│       │   │   │   ├── 📄 LiveMap.test.tsx
│       │   │   │   └── 📄 NewIncidentModal.test.tsx
│       │   │   ├── 📁 unit
│       │   │   │   ├── 📄 incidentUtils.test.ts
│       │   │   │   └── 📄 sectorFiltering.test.ts
│       │   │   └── 📄 setup.ts
│       │   ├── 📁 app
│       │   │   ├── 📁 [locale]
│       │   │   ├── 📁 auth
│       │   │   │   └── 📄 actions.ts
│       │   │   ├── 📄 favicon.ico
│       │   │   ├── 📄 globals.css
│       │   │   ├── 📄 layout.tsx
│       │   │   └── 📄 page.tsx
│       │   ├── 📁 components
│       │   │   ├── 📁 dashboard
│       │   │   │   ├── 📁 home
│       │   │   │   │   ├── 📄 ActivityChart.tsx
│       │   │   │   │   ├── 📄 CategoryBreakdown.tsx
│       │   │   │   │   ├── 📄 DashboardStats.tsx
│       │   │   │   │   ├── 📄 IncidentReport.tsx
│       │   │   │   │   ├── 📄 LiveHeader.tsx
│       │   │   │   │   ├── 📄 LiveMap.tsx
│       │   │   │   │   ├── 📄 MapInner.tsx
│       │   │   │   │   ├── 📄 MapSelectorInner.tsx
│       │   │   │   │   ├── 📄 NewIncidentModal.tsx
│       │   │   │   │   ├── 📄 RealtimeRefresher.tsx
│       │   │   │   │   ├── 📄 ResourceMonitor.tsx
│       │   │   │   │   ├── 📄 SectorCanvas.tsx
│       │   │   │   │   ├── 📄 SectorSelector.tsx
│       │   │   │   │   ├── 📄 ServiceHealth.tsx
│       │   │   │   │   ├── 📄 SystemTelemetry.tsx
│       │   │   │   │   └── 📄 ThreatMonitor.tsx
│       │   │   │   ├── 📁 layouts
│       │   │   │   │   ├── 📄 AdminLayout.tsx
│       │   │   │   │   └── 📄 AdminSidebarNav.tsx
│       │   │   │   ├── 📁 logs
│       │   │   │   │   ├── 📄 LogExportButtons.tsx
│       │   │   │   │   └── 📄 LogRow.tsx
│       │   │   │   ├── 📁 pets
│       │   │   │   │   ├── 📄 PetDetailHeader.tsx
│       │   │   │   │   ├── 📄 PetHealthHistory.tsx
│       │   │   │   │   └── 📄 PetQRCard.tsx
│       │   │   │   ├── 📄 ManageLogsClient.tsx
│       │   │   │   ├── 📄 ManagePetsClient.tsx
│       │   │   │   ├── 📄 ManageUsersClient.tsx
│       │   │   │   ├── 📄 PetTableActions.tsx
│       │   │   │   └── 📄 SystemStatus.tsx
│       │   │   ├── 📁 forms
│       │   │   │   └── 📄 PetRegistrationForm.tsx
│       │   │   └── 📁 layouts
│       │   ├── 📁 lib
│       │   │   ├── 📁 supabase
│       │   │   │   ├── 📄 client.ts
│       │   │   │   ├── 📄 middleware.ts
│       │   │   │   └── 📄 server.ts
│       │   │   ├── 📄 incidentUtils.ts
│       │   │   ├── 📄 supabase.ts
│       │   │   └── 📄 utils.ts
│       │   ├── 📁 tests
│       │   │   └── 📄 connectivity.test.ts
│       │   └── 📄 middleware.ts
│       ├── 📄 .gitignore
│       ├── 📄 eslint.config.mjs
│       ├── 📄 next-env.d.ts
│       ├── 📄 next.config.ts
│       ├── 📄 package.json
│       ├── 📄 postcss.config.mjs
│       ├── 📄 README.md
│       └── 📄 tsconfig.json
├── 📁 docs
│   ├── 📁 adr
│   ├── 📁 db
│   ├── 📁 legal
│   ├── 📄 convention.md
│   ├── 📄 notion_schema.md
│   └── 📄 roadmap.md
├── 📁 logs
├── 📁 packages
│   ├── 📁 shared-config
│   ├── 📁 shared-core
│   │   ├── 📁 src
│   │   │   ├── 📁 models
│   │   │   │   ├── 📄 incident.ts
│   │   │   │   ├── 📄 pet.ts
│   │   │   │   ├── 📄 user.ts
│   │   │   │   └── 📄 UserRoles.ts
│   │   │   ├── 📁 repositories
│   │   │   │   ├── 📄 PetRepository.test.ts
│   │   │   │   ├── 📄 PetRepository.ts
│   │   │   │   ├── 📄 UserRepository.test.ts
│   │   │   │   └── 📄 UserRepository.ts
│   │   │   ├── 📁 services
│   │   │   │   ├── 📄 DuaService.test.ts
│   │   │   │   └── 📄 DuaService.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📄 constants.ts
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   └── 📁 shared-ui
├── 📁 scripts
│   ├── 📄 check_bunker_health.ps1
│   ├── 📄 create-task.mjs
│   ├── 📄 fire_test.ps1
│   ├── 📄 generate-context.ps1
│   ├── 📄 genesis_bunker.ps1
│   ├── 📄 health-check.mjs
│   ├── 📄 menu.ps1
│   ├── 📄 notion-update.mjs
│   ├── 📄 push_bunker.ps1
│   ├── 📄 scaffold_engines.ps1
│   ├── 📄 sync_drive.py
│   ├── 📄 sync.ps1
│   └── 📄 update-structure.ps1
├── 📁 supabase
│   └── 📁 migrations
│       └── 📄 0001_create_pets_table.sql
├── 📁 test-results
│   └── 📄 .last-run.json
├── 📁 tests
│   └── 📄 test-connections.mjs
├── 📄 .ai_context.md
├── 📄 .aider.chat.history.md
├── 📄 .aider.input.history
├── 📄 .gitignore
├── 📄 .snyk
├── 📄 agents.md
├── 📄 ARCHITECT_CONTEXT.md
├── 📄 ARCHITECTURE.md
├── 📄 CONTRIBUTORS.md
├── 📄 credentials.json
├── 📄 package.json
├── 📄 playwright.config.ts
├── 📄 pnpm-workspace.yaml
├── 📄 postcss.config.mjs
├── 📄 README.md
├── 📄 ROADMAP_VISION.md
├── 📄 SECURITY_MODEL.md
├── 📄 token.json
└── 📄 vitest.config.mts
