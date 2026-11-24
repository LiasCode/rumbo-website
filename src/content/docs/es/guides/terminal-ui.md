---
title: Interfaz de terminal
description: Usa la interfaz de terminal de rumbo. Sesiones en una barra lateral, la conversación, un editor, una paleta de comandos, paneles con los detalles de la sesión y los cambios de Git, y todas sus teclas.
---

`rumbo` en una terminal abre la interfaz de terminal a pantalla completa: una cabecera con el
proyecto y la sesión que se muestra, las sesiones del proyecto en una barra lateral, la conversación
en una columna propia y, debajo, un editor con el modelo, lo lleno que está el contexto y lo que ha
gastado la sesión.

```sh
rumbo                      # open it
rumbo "a task"             # open it and start a task
rumbo -c                   # open the latest session of this project
rumbo -s <session>         # open a given one
```

Al salir, devuelve la terminal como la encontró y deja en ella el comando que continúa la sesión,
`rumbo -s <session>`. Para conservar una conversación, `/export` la escribe en un archivo Markdown.

## Seguir una ejecución

- Lo que dijiste aparece en un recuadro a la derecha, y lo que escribe el modelo, como Markdown:
  títulos, listas, citas, código, enlaces y tablas con sus columnas alineadas.
- Una llamada a una herramienta se muestra con un indicador y su tiempo mientras trabaja, y después
  como un bloque que dice cómo fue: una edición con las líneas que cambió, un comando con el principio
  de lo que imprimió o, si falló, su estado y el final de lo que imprimió.
- Una ejecución termina con una línea que dice cómo acabó, cuánto tardó y sus turnos y tokens.
- Enter durante una ejecución le dice lo que escribiste. Llega al modelo antes de su siguiente
  petición, sin detenerla.
- Cuando una ejecución termina y la terminal no está al frente, hace sonar la campana y envía una
  notificación de escritorio, en las terminales que informan de su foco y aceptan OSC 9 (en tmux, con
  `focus-events` activado).

## Sesiones

Cada sesión conserva lo que mostró, y una ejecución sigue en su sesión mientras miras otra. La barra
lateral marca las sesiones que están trabajando y aquellas cuya ejecución terminó mientras no se
mostraban.

| Tecla                                     | Hace                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------- |
| Tab (con el editor vacío), flechas, Enter | Mostrar una sesión de la barra lateral                               |
| Supr                                      | Borrar la sesión elegida en la barra lateral, una vez que lo aceptas |
| Ctrl-N                                    | Empezar una sesión nueva                                             |
| Ctrl-B                                    | Mostrar u ocultar la barra lateral                                   |

## Comandos

- **Ctrl-P** abre una paleta con las acciones propias de la interfaz, las demás sesiones del proyecto
  y todos los comandos, que se filtran al escribir. Un comando que necesita algo lo pide en un
  formulario, y uno que no se puede deshacer te pide que lo aceptes en un diálogo.
- **Una barra** en el editor abre un menú con los comandos y lo que hace cada uno, y luego con los
  valores que acepta su siguiente parámetro: `/open` lista las sesiones, `/use openai` los modelos de
  `openai`.
- **`/help`** los lista todos: los del host, agrupados según sobre qué actúan (el sistema, la sesión
  y los proveedores), los del proveedor y los propios de la interfaz.

Los comandos salen de lo que describen el host y el proveedor, así que las funciones de un
proveedor, como `/login`, aparecen sin que la interfaz las conozca. Los propios de la interfaz son
`/help`, `/copy` (la última respuesta del modelo, o `/copy code` para su último bloque de código) y
`/export` (la sesión como Markdown).

Los comandos de una extensión llevan su nombre registrado, como `/notes-forget`. Su salida se marca con `[extension]` o `[extension <name>]`. Consulta [Extensiones y MCP](/es/guides/extensions/).

## Modelo y opciones

Un clic en el modelo bajo el editor, o Model and options en la paleta, abre el selector. Cambia el
proveedor, el modelo y las opciones de la sesión, como `effort`, y muestra cada cambio como el
comando que es.

## Paneles

- **Ctrl-Alt-B** muestra los detalles de la sesión junto a la conversación: su id y su estado, su
  carpeta, su modelo, lo lleno que está su contexto, lo que gastó y las skills de las que se informa
  al modelo.
- **Ctrl-G** muestra lo que cambió en la carpeta del proyecto según Git, frente al último commit,
  incluidos los archivos nuevos. Solo lee.

## Volver atrás en la conversación

Shift-Tab sube a la conversación, donde Arriba y Abajo eligen una entrada y Enter actúa sobre ella,
igual que un clic:

- en una llamada a una herramienta, muestra todo lo que recibió y devolvió, o vuelve a su extracto;
- en un mensaje tuyo, lo cambia, o lo vuelve a preguntar, en una [rama](/es/guides/sessions/#ramificar)
  que empieza antes de él;
- en cualquier otra cosa, la copia.

Arrastrar el ratón sobre la conversación o un panel selecciona su texto, y al soltar se copia, al
portapapeles y a la selección primaria. Usa OSC 52, así que también funciona por ssh en las
terminales que lo aceptan (en tmux, con `set-clipboard on`). Con Shift, la terminal selecciona como
en cualquier otro sitio.

## El editor

| Tecla                            | Hace                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Enter                            | Enviar la tarea, o decirle a la ejecución en curso lo que escribiste                             |
| Alt-Enter, Shift-Enter, Ctrl-J   | Nueva línea                                                                                      |
| Arriba, Abajo                    | Moverse por las filas escritas y, más allá, por lo que enviaste antes                            |
| Ctrl-R                           | Buscar lo que enviaste antes, en cualquier sesión del proyecto                                   |
| Ctrl-V                           | Pegar la imagen del portapapeles, que va con lo siguiente que envíes                             |
| Retroceso con el editor vacío    | Quitar la última imagen pegada                                                                   |
| Escape                           | Abandonar una función del proveedor en curso; si no, cancelar la ejecución de la sesión mostrada |
| Ctrl-C                           | Lo mismo que Escape; si no, vaciar el editor; si no, salir                                       |
| Ctrl-D                           | Salir, con el editor vacío                                                                       |
| RePág, AvPág, la rueda del ratón | Desplazar la conversación                                                                        |

El editor usa las teclas de readline: Ctrl-A y Ctrl-E, Ctrl-F, Alt-B y Alt-F, Ctrl-W, Ctrl-U y
Ctrl-K. Pegar una imagen lee el portapapeles del escritorio con `wl-paste` en Wayland, `xclip` en X11
o AppKit en macOS, ya que una terminal solo pega texto.

## Colores

Los colores de la interfaz son su configuración, que se cambia con `rumbo frontend set tui`:

```sh
rumbo frontend set tui theme=plain          # auto (the default, which follows NO_COLOR), color, or plain
rumbo frontend set tui color_code=bright-blue
rumbo frontend show tui                     # everything set for it, with the defaults
```

`color_host`, `color_provider`, `color_code`, `color_success`, `color_failure`, `color_warning` y
`color_progress` aceptan cada uno un nombre como `cyan` o `bright-blue`, un número de los 256
colores, `#rrggbb` o `default`.
