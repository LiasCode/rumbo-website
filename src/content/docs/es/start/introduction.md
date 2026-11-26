---
title: ¿Qué es rumbo?
description: rumbo es un arnés de agentes mínimo y de código abierto. Da al modelo cuatro herramientas y un prompt de sistema corto, y mantiene el modelo y la interfaz como programas aparte que puedes reemplazar.
---

rumbo es un arnés de agentes mínimo. Dale una tarea y trabajará con cuatro herramientas, `read`,
`write`, `edit` y `bash` (`powershell` en Windows), más una quinta que usa la pantalla si la activas, hasta que el modelo
termine. Los modelos que hay detrás y las interfaces que hay delante son programas aparte que puedes
reemplazar.

No está atado a la programación. No sabe de ningún tipo de trabajo: hace lo que piden tu tarea y tus
[instrucciones](/es/guides/instructions-and-skills/), ya sea arreglar un test que falla, resumir una
carpeta de notas o manejar un programa de escritorio.

## Qué trae de serie

rumbo se puede usar tal como se instala. Un solo binario trae:

- **Una interfaz de terminal completa**: la conversación como Markdown, un editor que acepta unos
  pocos comandos, las sesiones en una barra lateral y paneles. Es lo que abre `rumbo`. Consulta la
  [interfaz de terminal](/es/guides/terminal-ui/).
- **Tres proveedores**: `anthropic` para Claude mediante la API de Anthropic, `openai` para las API
  de OpenAI y cualquier servidor compatible con Chat Completions, incluidos los locales, y `chatgpt`
  para un plan de ChatGPT. Consulta [modelos y proveedores](/es/guides/providers/).
- **Una interfaz de texto plano** para [scripts y tuberías](/es/guides/scripting/), y **una extensión
  para servidores MCP**, que añades [una vez por servidor](/es/guides/extensions/).

## Qué puedes añadir

Hay dos más que se publican aparte, como [plugins](/es/guides/plugins/) que añades si los quieres:

| Plugin                                                   | Añade                                                                                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [rumbo-claude](https://github.com/LiasCode/rumbo-claude) | Un proveedor, `claude`, que usa una suscripción Claude Pro o Max. No es una integración oficial de Anthropic: lee antes su README.       |
| [rumbo-gui](https://github.com/LiasCode/rumbo-gui)       | Una interfaz, `gui`: una [ventana de escritorio](/es/guides/desktop-app/) para rumbo. Necesita rumbo 0.10.0 o 0.11.0, todavía no 0.12.0. |

```sh
rumbo plugin add https://github.com/LiasCode/rumbo-claude
rumbo plugin add https://github.com/LiasCode/rumbo-gui
```

rumbo compila un plugin donde lo añades, así que el primero necesita Go en tu máquina y el segundo
Rust.

## Crea los tuyos y compártelos

Lo que trae rumbo es un punto de partida, no el producto. rumbo está hecho para que **escribas tú
las piezas que te faltan**, en cualquier lenguaje, con los mismos protocolos que usan las suyas:

- una [interfaz](/es/extend/front-end/), para la forma en que quieres trabajar: en tu editor, en un
  chat, en una página web;
- un [proveedor](/es/extend/provider/), para el modelo que usas;
- una [extensión](/es/extend/extension/), para las herramientas que necesita tu trabajo;
- un [plugin](/es/reference/plugins/), para reunirlas con tus skills.

Si quieres que otros tengan lo que hiciste, ponlo en un repositorio Git como plugin: cualquiera lo
añade con `rumbo plugin add <dirección>`.

## Las partes

- **El host** es rumbo en sí. Es dueño de las sesiones, las herramientas y el bucle: pide a un
  proveedor el siguiente mensaje, ejecuta las herramientas que llama el modelo y repite hasta que el
  modelo deja de llamarlas. No muestra nada y no conoce ninguna API de modelos.
- **Un proveedor** llega a un modelo. rumbo trae proveedores integrados para la API de Anthropic,
  las API de OpenAI, un plan de ChatGPT y cualquier servidor compatible con Chat Completions,
  incluidos los locales. Consulta [modelos y proveedores](/es/guides/providers/).
- **Una interfaz** (front end) es lo que usas tú: la [interfaz de terminal](/es/guides/terminal-ui/),
  una salida de texto plano para [scripts y tuberías](/es/guides/scripting/), la
  [aplicación de escritorio](/es/guides/desktop-app/) o una que escribas tú.

Los proveedores y las interfaces hablan un pequeño protocolo JSON-RPC con el host por tuberías, como hace
el Language Server Protocol entre editores y lenguajes. Los integrados cruzan los mismos protocolos que
los que [escribes tú](/es/extend/provider/), así que todo lo que ellos pueden hacer, los tuyos también.

- [Extensiones y MCP](/es/guides/extensions/) — Añade al modelo herramientas de programas propios o de servidores Model Context Protocol.
- [Plugins](/es/guides/plugins/) — Instala y distribuye juntos proveedores, interfaces, extensiones y skills.

## Qué lo hace distinto

- **Un historial que puedes reproducir.** Una sesión es un registro que solo crece, una entrada por
  línea en un archivo que puedes leer. Cada petición enviada al modelo se puede reconstruir a partir de
  él (`rumbo request` la imprime), una ejecución que falló o se cortó se reanuda donde se quedó
  (`rumbo -r`), y `/branch` continúa desde antes de cualquiera de tus mensajes en una sesión nueva,
  mientras la primera queda como estaba.
- **Pensado para la caché del proveedor.** Cada petición amplía la anterior hasta que un resumen
  vuelve a empezar la conversación, así que el proveedor puede leerla de su caché.
- **Un rumbo, una sesión.** Cada sesión es un proceso propio, con su proveedor y sus extensiones,
  así que las ejecuciones avanzan a la par, y puedes decirle algo a una ejecución sin detenerla.
- **Los proveedores se describen solos.** Sus modelos, opciones y funciones, hasta un inicio de sesión
  que te pide un código, aparecen en cualquier interfaz sin que la interfaz los conozca.
- **Pequeño y general.** Un prompt de sistema corto y fijo, nada sobre ningún lenguaje o framework, y
  nada de telemetría.

## De dónde viene

- **[pi](https://pi.dev)**, el arnés de agentes mínimo que empezó Mario Zechner, por lo que un arnés
  deja fuera. Como pi, rumbo da al modelo cuatro herramientas y un prompt de sistema corto, y no tiene
  modo de planificación, ni subagentes, ni avisos de permisos.
- **El [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)**, por cómo
  se conectan las partes. Las interfaces y los proveedores son programas que hablan JSON-RPC con el
  host, describen sus opciones y funciones al arrancar y se pueden escribir en cualquier lenguaje.

## Siguientes pasos

- [Instala rumbo](/es/start/installation/) y [ejecuta tu primera tarea](/es/start/quick-start/).
- Lee [antes de ejecutarlo](/es/start/safety/): rumbo actúa con tus permisos, sin sandbox.
- Descubre [por qué rumbo está hecho así](/es/concepts/design/).
