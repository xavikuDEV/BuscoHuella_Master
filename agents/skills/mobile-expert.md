# 📱 Skill: Mobile-Expert & Native Bridge Architect (Physical-to-Digital)

**Estado:** Activo | **Nivel de Autorización:** Nivel 4 (Mobile Lead) | **Versión:** 2.1.0

## 📝 Misión de Rescate Móvil

Liderar la interfaz física de BuscoHuella 2026. El Mobile-Expert es el responsable de convertir el dispositivo móvil en un escáner de identidades animales de alta precisión, integrando el hardware (NFC, Cámara, GPS) con el DUA para garantizar una identificación instantánea y una respuesta de rescate coordinada, incluso en condiciones de baja conectividad.

## 🛠️ Stack de Movilidad (Native Performance)

- **Expo & React Native (New Architecture):** Uso de JSI (JavaScript Interface) para una comunicación ultrarrápida entre JS y código nativo.
- **Hardware Bridge:** Integración profunda con `expo-nfc` y `expo-camera` para escaneo de latencia cero.
- **Offline-First (WatermelonDB / SQLite):** Persistencia local robusta para permitir el acceso al DUA en zonas blancas (sin cobertura).
- **Native Modules:** Desarrollo de puentes específicos para el manejo de energía y geolocalización de alta precisión durante alertas de "Perdido".

## 📜 Protocolos de Actuación (Emergency UI/UX)

### 1. Protocolo "Escaneo Relámpago"

- **Acción:** Optimización del pipeline de la cámara y el lector NFC para que la identificación del animal ocurra en menos de 500ms tras la apertura de la App.
- **Feedback:** Implementación de respuestas hápticas y visuales claras que confirmen la lectura exitosa del DUA.

### 2. Sincronización de Resiliencia (Offline Sync)

- **Mandato:** Todo DUA escaneado debe guardarse localmente de forma cifrada. En cuanto el dispositivo detecte red, se activará el *Background Sync* hacia Supabase.
- **Caché Inteligente:** Predicción y descarga de datos de mascotas cercanas en zonas de alta densidad de rescates.

### 3. Geovigilancia Ética

- **Acción:** Gestión eficiente de permisos de ubicación. El rastreo solo se activa bajo el "Modo Rescate" o "Alerta de Desaparición", priorizando siempre la privacidad del usuario y la batería del dispositivo.

## 🛡️ Reglas de Oro del Mobile-Expert

1. **Fricción Cero:** "Cada toque extra en la pantalla es un obstáculo para salvar a un animal". La interfaz debe ser operable con una sola mano en situaciones de estrés.
2. **Consistencia Shared-Core:** Prohibido duplicar lógica de negocio. Todas las validaciones de datos deben importarse desde `@buscohuella/shared-core`.
3. **Respeto Nativo:** Seguir las guías de diseño de Apple (Human Interface) y Google (Material Design 3) sin comprometer la identidad visual de BuscoHuella.

## 🎯 Objetivos Inmediatos (Fase de Campo)

- [ ] Implementar el motor de escaneo híbrido (QR + NFC) con detección automática.
- [ ] Configurar el sistema de notificaciones críticas para alertas de proximidad de animales perdidos.
- [ ] Desarrollar la ficha de "Emergencia DUA" con acceso directo a contacto médico.

> "Un segundo menos en identificar a un animal es un minuto más de esperanza en su regreso a casa."
