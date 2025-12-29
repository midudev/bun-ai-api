# Bun AI API

Este proyecto es una API construida con [Bun](https://bun.sh) que integra servicios de IA como Groq y Cerebras.

## Requisitos Previos

El único requisito principal para ejecutar este proyecto es tener **Bun** instalado en tu sistema.

### ¿No tienes Bun instalado?

Si aún no tienes Bun, puedes instalarlo siguiendo las instrucciones oficiales o ejecutando el siguiente comando en tu terminal (para macOS, Linux y WSL):

```bash
curl -fsSL https://bun.sh/install | bash
```

Para usuarios de Windows, se recomienda usar WSL o seguir las instrucciones específicas en su página web.

👉 [Visita la página oficial de Bun para más detalles](https://bun.sh)

## Configuración e Instalación

Sigue estos pasos detallados para poner en marcha el proyecto:

### 1. Instalar dependencias

Una vez clonado el proyecto, abre tu terminal en la carpeta raíz del proyecto y ejecuta:

```bash
bun install
```

Este comando descargará e instalará todas las librerías necesarias listadas en el archivo `package.json`.

### 2. Configurar Variables de Entorno

El proyecto necesita ciertas claves de API para funcionar. Debes crear un archivo para almacenarlas de forma segura.

1.  Crea un archivo llamado `.env` en la raíz del proyecto.
2.  Abre el archivo `.env` y añade las siguientes variables (reemplaza los valores de ejemplo con tus propias claves reales):

```env
# Puerto del servidor (opcional, por defecto 3000)
PORT=3000

# API Key para el servicio de Groq
GROQ_API_KEY=gsk_...

# API Key para el servicio de Cerebras
CEREBRAS_API_KEY=csk_...
```

**Nota:** Asegúrate de obtener tus API Keys en los portales de desarrollador de Groq y Cerebras respectivamente.

### 3. Ejecutar el Proyecto

Tienes dos formas de ejecutar el servidor, dependiendo de si estás desarrollando o quieres ejecutarlo en producción.

#### Modo Desarrollo (`dev`)

Este modo es ideal mientras estás editando código, ya que reinicia el servidor automáticamente cuando guardas cambios (`--watch` mode).

```bash
bun run dev
```

#### Modo Producción (`start`)

Utiliza este comando para una ejecución estable sin reinicios automáticos.

```bash
bun run start
```

Verás un mensaje en la consola indicando que el servidor está corriendo, por ejemplo:
`Server is running on http://localhost:3000`

## Gestión de Servicios de IA

Este proyecto utiliza un sistema de **carga dinámica** para los servicios de IA. Esto significa que no necesitas modificar el código principal para activar, desactivar o añadir nuevos servicios.

### 1. Activar y Desactivar Servicios

La activación de los servicios es **automática** y está basada únicamente en la presencia de sus variables de entorno en el archivo `.env`.

*   **Para activar un servicio:** Simplemente añade su API Key correspondiente al archivo `.env`.
*   **Para desactivar un servicio:** Elimina o comenta (añadiendo `#` al principio) la línea de su API Key en el archivo `.env`.

### 2. Servicios Disponibles

A continuación se muestra la lista de servicios soportados actualmente y la variable de entorno necesaria para activarlos:

| Servicio | Variable de Entorno |
| :--- | :--- |
| **Groq** | `GROQ_API_KEY` |
| **Cerebras** | `CEREBRAS_API_KEY` |

### 3. Cómo añadir un nuevo servicio

Gracias al patrón Factory implementado, añadir un nuevo proveedor de IA es muy sencillo:

1.  Crea un nuevo archivo TypeScript (ej: `deepseek.ts`) en la carpeta `services/`.
2.  Implementa y exporta un objeto que cumpla con la interfaz de fábrica. No necesitas registrarlo manualmente en ningún otro sitio.

Ejemplo de estructura de un nuevo servicio:

```typescript
import type { AIService, ChatMessage } from '../types';

// El objeto exportado PUEDE tener cualquier nombre, pero debe tener 'isEnabled' y 'create'
export const deepseekFactory = {
  // Define cuándo se debe activar este servicio
  isEnabled: () => !!process.env.DEEPSEEK_API_KEY,

  // Crea y devuelve la instancia del servicio
  create: (): AIService => {
    return {
      name: 'DeepSeek',
      async chat(messages: ChatMessage[]) {
        // ... lógica de llamada a la API ...
        // Debe devolver un AsyncIterable<string>
      }
    }
  }
}
```

El sistema detectará automáticamente el nuevo archivo, comprobará `isEnabled` y, si devuelve `true`, añadirá el servicio a la rotación.

## Tutorial

Mira el video explicativo de cómo se ha creado este proyecto:


[![Video Tutorial](https://img.youtube.com/vi/ax7_QNZZ-pk/0.jpg)](https://www.youtube.com/watch?v=ax7_QNZZ-pk)
