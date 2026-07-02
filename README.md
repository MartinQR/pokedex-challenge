# Pokédex Challenge - React Native (Expo)

Este proyecto implementa una solución móvil para la visualización de la Pokédex utilizando la PokeAPI pública, desarrollada con un enfoque de código limpio, mantenible y escalable.

## 🛠️ Arquitectura y Decisiones Técnicas

Para cumplir con los requerimientos técnicos y asegurar un código limpio, robusto y escalable, implementé las siguientes soluciones:

### 1. Clean Architecture & Principios SOLID

La aplicación está dividida en tres capas desacopladas con responsabilidades únicas:

- **Domain (Dominio):** Contiene el corazón del negocio (Entidades, Interfaces de Repositorios y Casos de Uso) en TypeScript puro, totalmente independiente de librerías externas o frameworks de UI.

- **Data (Datos):** Implementa el consumo de red y almacenamiento local. Mapea las respuestas de la API (`DTOs`) hacia las entidades de dominio usando el patrón _Mapper_, evitando que cambios en la API rompan la interfaz.

- **Presentation (Presentación):** Implementa el patrón **MVVM** mediante _Custom Hooks_ que manejan de forma reactiva el estado de la UI (Loading, Success, Error y Empty State).

### 2. Cliente de Red (Axios)

Se seleccionó **Axios** como equivalente directo a _Retrofit_ en desarrollo nativo. Permite centralizar la URL base, manejar configuraciones globales de red como `timeout` para conexiones lentas y facilitar el manejo centralizado de errores.

### 3. Persistencia Local (Soporte Offline Parcial)

Utilizando `@react-native-async-storage/async-storage`, implementé una estrategia de caché en la capa de datos. Si la petición de red falla por falta de conectividad, el repositorio intercepta el error y recupera de forma automática la última copia guardada en el dispositivo, garantizando la continuidad de la app y una experiencia de usuario fluida.

---

## 🚀 Instrucciones de Ejecución

### Prerrequisitos

- Node.js (v18 o superior recomendado)
- Expo Go instalado en un dispositivo físico o emulador configurado (Android Studio / Xcode)

### Instalación y Encendido

1. Clonar el repositorio e ingresar a la carpeta del proyecto.
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Correr el proyecto:

   ```npx expo start

   ```
