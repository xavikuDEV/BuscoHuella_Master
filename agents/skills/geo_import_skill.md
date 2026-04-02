---

name: geo_import_skill
description: Localización e integración de límites administrativos (GeoJSON) desde OSM hacia el Búnker BuscoHuella.
version: 1.0.0
tools: [mcp-geo-server:import_jurisdiction]
-------------------------------------------

# 🛰️ Skill: Geo-Importación de Jurisdicciones

## 🎯 Objetivo

Permitir que el agente identifique vacíos geográficos en el búnker y los resuelva de forma autónoma extrayendo polígonos oficiales de OpenStreetMap (OSM) e insertándolos con integridad referencial.

---

## ⚡ Triggers (Cuándo activar)

* El usuario solicita trabajar con una ciudad/región que no existe en `jurisdictions`.
* Consultas tipo:

  * "Añade [Ciudad]"
  * "No tengo el mapa de [Lugar]"
  * "Importa los límites de [Provincia]"
* Errores de `"Location not found"` en el dashboard.

---

## 🧠 Lógica de Decisión (Algoritmo del Agente)

### 1. Verificación Previa

Antes de importar, **SIEMPRE** verificar si la jurisdicción ya existe para evitar duplicados:

```sql
SELECT id, name, type 
FROM jurisdictions 
WHERE name ILIKE '{{cityName}}';
```

Si existe:
→ reutilizar registro
→ NO importar de nuevo

---

### 2. Clasificación de Niveles (Mapping)

Mapeo entre OSM y el sistema interno:

| Tipo interno   | Nivel OSM | Descripción                 |
| -------------- | --------- | --------------------------- |
| `country`      | 2         | País                        |
| `state`        | 4         | Comunidad Autónoma / Estado |
| `province`     | 6         | Provincia                   |
| `municipality` | 8         | Ciudad / Municipio          |

Si no se especifica:
→ inferir por contexto o tamaño del lugar

---

### 3. Ejecución de la Herramienta

Invocar la tool:

```ts
import_jurisdiction({
  cityName: "Sabadell",
  type: "municipality"
})
```

Parámetros:

* `cityName`: nombre oficial
* `type`: `country | state | province | municipality`

---

## ⚙️ Reglas de Comportamiento

### 📌 Prioridad de Nombres

* Si hay ambigüedad (ej: "Santiago"):

  * preguntar al usuario
  * o usar contexto: `"Santiago de Compostela, Spain"`

---

### 🧩 Jerarquía

Después de importar:

1. Verificar `parent_id`
2. Si NO existe:
   → sugerir o ejecutar importación del nivel superior

Ejemplo:

* Sabadell → necesita Barcelona (provincia)
* Barcelona → necesita Cataluña (state)

---

### 🚨 Manejo de Errores

* **OSM sin geometría**
  → Informar: "No hay límites administrativos definidos"

* **Error de base de datos**
  → Notificar problema de esquema o constraints

* **Respuesta ambigua**
  → solicitar уточización al usuario

---

## 🔍 Protocolo de Verificación (QA)

Tras la ejecución:

1. Verificar que el registro existe:

```sql
SELECT id, name 
FROM jurisdictions 
WHERE name ILIKE '{{cityName}}';
```

2. Validaciones:

* UUID válido
* `geometry IS NOT NULL`
* relación jerárquica correcta

---

### ✅ Confirmación al usuario

Ejemplo:

```
✅ He mapeado los límites de Sabadell.
Ya puedes visualizar el sector en el mapa.
```

---

## 🧩 Integración Técnica

* **Motor:** `packages/mcp-geo-server`
* **Tool:** `import_jurisdiction`
* **Base de Datos:** Supabase (PostGIS)
* **Tabla:** `jurisdictions`

---

## 🐾 Filosofía del Búnker

* Automatizar la expansión geográfica
* Evitar duplicidad de datos
* Mantener integridad jerárquica
* Preparar el sistema para mapas en tiempo real

---

## 🚀 Ejemplo de Flujo

Input:

```
"Añade Sabadell"
```

Flujo:

1. Verifica existencia → ❌ no existe
2. Clasifica → municipality (nivel 8)
3. Ejecuta tool MCP
4. Inserta en DB
5. Verifica integridad
6. Responde al usuario

---

**Propiedad del Búnker BuscoHuella 2026**
Protocolo de Expansión Geográfica 🌍
