---
title: Interfaz de terminal
description: Usa la interfaz de terminal de rumbo. La conversación a pantalla completa, un editor, unos pocos comandos que se escriben en él, las sesiones en una barra lateral, paneles con los detalles de la sesión y los cambios de Git, y todas sus teclas.
---

`rumbo` en una terminal abre la interfaz de terminal a pantalla completa: la conversación de lado a
lado y, debajo, un editor con el modelo, la rama de Git en uso, la carpeta (bajo tu home como `~/`),
lo lleno que está el contexto y lo que ha gastado la sesión. Las sesiones empezadas en esa carpeta
están en una barra lateral, oculta hasta que Ctrl-B la muestra.

```sh
rumbo                      # open it
rumbo "a task"             # open it and start a task
rumbo -c                   # open the latest session started here
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
- Cómo va la ejecución, su indicador y su tiempo, se muestra encima del editor.
- Una ejecución termina con una línea que dice cómo acabó, cuánto tardó, sus tokens de entrada y de
  salida, lo que dio la caché con su parte de la entrada, y sus turnos:
  `12.3s · 1.1k in · 810 out · 26.5k cached (96%) · 1 turn`. Una sesión que continúas dice también
  cuánto tardó cada una de sus tareas anteriores.
- Enter durante una ejecución le dice lo que escribiste. Llega al modelo antes de su siguiente
  petición, sin detenerla.
- Cuando una ejecución termina y la terminal no está al frente, hace sonar la campana y envía una
  notificación de escritorio, en las terminales que informan de su foco y aceptan OSC 9 (en tmux, con
  `focus-events` activado).

## Comandos

Todo es un comando que se escribe en el editor. Una barra en una línea vacía empieza uno, y Ctrl-P
también. Una conversación vacía muestra los pocos con los que empezar.

- **El menú** lista los comandos, con un ejemplo del elegido, y luego los valores que acepta su
  siguiente palabra: `/resume` lista las sesiones, `/model ` los proveedores y las opciones, y
  `/model openai/` los modelos de `openai`. Arriba y Abajo eligen, Tab o Enter toman, Escape lo
  cierra.
- **Lo que le falta a un comando** se muestra tras el cursor, atenuado, como `/resume <session>`.
- **Un comando mal escrito** se responde con el que querías decir.
- **`/help`** lista los comandos según de qué tratan, y las teclas; `/help <command>` dice lo que hace
  uno, con ejemplos.
- Un comando que no se puede deshacer te pide que lo aceptes en un diálogo, que empieza en el botón
  que deja las cosas como están.

| Comando                         | Hace                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `/new`                          | Empezar la siguiente tarea en una sesión nueva                                               |
| `/sessions`                     | Listar las sesiones de esta carpeta, con su estado y cuándo se usó cada una por última vez   |
| `/resume <session>`             | Ir a otra sesión, por su id, su principio o el principio de su título                        |
| `/rename <title>`               | Darle a esta sesión un título propio                                                         |
| `/branch [message]`             | Seguir en una [rama](/es/guides/sessions/#ramificar), antes de un mensaje tuyo o desde ahora |
| `/attach <file>`                | Dar un archivo con lo siguiente que envíes, por su ruta; el modelo lo lee cuando lo necesite |
| `/compact`                      | Sustituir ya la conversación por un resumen                                                  |
| `/delete [session]`             | Borrar una sesión y su historial, una vez que lo aceptas; sin ella, esta                     |
| `/copy [code\|id]`              | Copiar la última respuesta del modelo, su último bloque de código o el id de esta sesión     |
| `/export [path]`                | Escribir esta sesión como Markdown en un archivo, que no sobrescribe                         |
| `/model [provider/model]`       | Cambiar el modelo y sus opciones (`option=value`); sin ellos, abrir el selector              |
| `/login [extension]`, `/logout` | Iniciar sesión en el proveedor, o en una extensión, y cerrarla                               |
| `/providers`, `/extensions`     | Listarlos, mostrarlos, configurarlos, añadirlos y quitarlos                                  |
| `/settings [name=value]`        | Mostrar lo que se aplica aquí y de dónde viene cada valor, o cambiar un ajuste               |
| `/status`, `/changes`           | Mostrar los detalles de la sesión, o lo que cambió en la carpeta, junto a la conversación    |
| `/rumbos [close]`               | Lo que usa el rumbo de cada sesión abierta; `close` termina los que no se usan               |
| `/help [command]`, `/quit`      | Mostrar los comandos y las teclas, o salir de rumbo                                          |

Las respuestas, los errores y los diagnósticos se marcan con `[host]`, `[provider <name>]` o
`[extension <name>]`, según de dónde vienen.

## Proveedores y extensiones

`/providers` y `/extensions` funcionan igual:

```text
/providers                                list them
/providers openai                         show one: its settings and what it offers
/providers openai base_url=http://localhost:11434/v1
/providers add local {self} provide openai
/providers remove local                   remove one, once you agree
/extensions add docs config={"url":"https://example.com/mcp"} {self} extend mcp
```

Lo que ofrece un programa se llama tras su nombre: `/providers anthropic account` para el proveedor
de la sesión, o `/extensions notes forget` para una extensión. Cada palabra se completa: los
programas, los cambios que acepta cada uno salvo los que ya diste, lo que ofrece cada uno y lo que
aceptan sus funciones y, para `add`, cómo se arrancan los programas que hay, y el `config=` y el
`replaces=` de una extensión. Una palabra que se puede omitir, delante de una que no, se escribe por
su nombre, como `name=value`.

`/extensions <name> tools=` elige las herramientas de un servidor MCP entre todas las que tiene,
elemento a elemento: primero la lista tal como está elegida, y luego cada herramienta que aún no
está, con lo que hace; una coma sigue con otra. Consulta [Extensiones y MCP](/es/guides/extensions/).

## Modelo y opciones

`/model`, o un clic en el modelo bajo el editor, abre el selector. Cambia el proveedor, el modelo y
las opciones de la sesión, como `effort`, y muestra cada cambio como el `/model` que es. Escrito
entero, los cambia a la vez:

```text
/model anthropic/claude-opus-5-5 effort=high
/model effort=                     the option back to the provider's value
```

Lo que va antes de la barra es un proveedor solo cuando hay uno con ese nombre, así que el nombre de
un modelo puede contener barras.

## Sesiones

La barra lateral lista las sesiones empezadas en la carpeta en la que se arrancó rumbo, separadas por
una fila, cada una con cuánto hace que se usó, como `5m`, `3h` o `2d`. Cada sesión es un rumbo propio,
que la interfaz arranca cuando muestras la sesión por primera vez y termina cuando sales, así que una
ejecución sigue en su sesión mientras miras otra. La barra lateral marca las sesiones que están
trabajando, aquellas cuya ejecución terminó mientras no se mostraban y, con un anillo, aquellas para
las que sigue abierto un rumbo. Cuántas ejecuciones trabajan en otras sesiones se muestra bajo el
editor, a la derecha.

| Tecla                    | Hace                                             |
| ------------------------ | ------------------------------------------------ |
| Ctrl-B                   | Mostrar u ocultar la barra lateral               |
| Tab, con el editor vacío | Ir a la barra lateral, cuando se muestra         |
| Arriba y Abajo, k y j    | Elegir una sesión                                |
| gg y G                   | Elegir la primera o la última                    |
| Enter                    | Mostrar la sesión elegida                        |
| d                        | Borrar la sesión elegida, una vez que lo aceptas |
| Ctrl-N                   | Empezar una sesión nueva, en un rumbo propio     |

`/sessions` lista las mismas sesiones en la conversación, y `/resume <session>` va a una.

Los rumbos de las sesiones que dejaste sin nada que hacer se cierran pasadas las dos últimas que se
mostraron, para que no sigan gastando memoria; volver a mostrar una arranca su rumbo. `/rumbos` dice
lo que usa el rumbo de cada sesión abierta: sus procesos, su memoria y su tiempo de procesador.
`/rumbos close` cierra los que ni se muestran ni trabajan.

La sesión en la que se arrancó rumbo queda retenida hasta que sales, así que no se puede borrar desde
dentro: bórrala entonces, con `rumbo sessions rm`.

## Paneles

- **`/status`** o **Ctrl-Alt-B** muestra los detalles de la sesión junto a la conversación: su id y
  su estado, su carpeta, su modelo, lo lleno que está su contexto, lo que gastó y las skills de las
  que se informa al modelo.
- **`/changes`** o **Ctrl-G** muestra lo que cambió en la carpeta de la sesión según Git, frente al
  último commit, incluidos los archivos nuevos. Solo lee.

## Volver atrás en la conversación

Shift-Tab sube a la conversación, donde Enter actúa sobre la entrada elegida, igual que un clic:

- en una llamada a una herramienta, muestra todo lo que recibió y devolvió, o vuelve a su extracto;
- en un mensaje tuyo, lo cambia, o lo vuelve a preguntar, en una [rama](/es/guides/sessions/#ramificar)
  que empieza antes de él;
- en cualquier otra cosa, la copia.

| Tecla                 | Hace                                                                               |
| --------------------- | ---------------------------------------------------------------------------------- |
| Arriba y Abajo, k y j | Elegir una entrada                                                                 |
| K y J                 | Ir a tus mensajes, hacia arriba y hacia abajo                                      |
| gg y G                | Ir al principio y al final                                                         |
| c                     | Copiar la entrada elegida                                                          |
| b                     | Ramificar desde el mensaje tuyo con el que empezó la tarea, una vez que lo aceptas |
| Tab, Escape           | Volver al editor                                                                   |

`b` elige primero ese mensaje, y el diálogo dice lo que conserva la rama: la conversación tal como
era antes de él, con el mensaje en el editor de la rama, para cambiarlo o volver a enviarlo.

## Copiar

Arrastrar el ratón sobre la conversación o un panel selecciona su texto, y al soltar se copia, al
portapapeles y a la selección primaria. Con Shift, la terminal selecciona como en cualquier otro
sitio.

El texto se copia con OSC 52, que también funciona por ssh, y a través del escritorio en el que
corre rumbo, ya que una terminal o un tmux que no acepta OSC 52 lo descarta sin decir nada: con
`wl-copy`, `xclip` o `xsel`, o `pbcopy` y, si no, en tmux, a través del búfer de tmux. Lo copiado dice
adónde fue.

## El editor

| Tecla                            | Hace                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Enter                            | Enviar la tarea, o decirle a la ejecución en curso lo que escribiste                             |
| Alt-Enter, Shift-Enter, Ctrl-J   | Nueva línea                                                                                      |
| Arriba, Abajo                    | Moverse por las filas escritas y, más allá, por lo que enviaste antes                            |
| Ctrl-R                           | Buscar lo que enviaste antes, en cualquier sesión empezada en esta carpeta                       |
| Ctrl-V                           | Dar los archivos copiados en un gestor de archivos, o la imagen del portapapeles                 |
| Retroceso con el editor vacío    | Quitar el último archivo dado                                                                    |
| Escape                           | Abandonar una función del proveedor en curso; si no, cancelar la ejecución de la sesión mostrada |
| Ctrl-C                           | Lo mismo que Escape; si no, vaciar el editor; si no, salir                                       |
| Ctrl-D                           | Salir, con el editor vacío                                                                       |
| RePág, AvPág, la rueda del ratón | Desplazar la conversación                                                                        |

El editor usa las teclas de readline: Ctrl-A y Ctrl-E, Ctrl-F, Alt-B y Alt-F, Ctrl-W, Ctrl-U y
Ctrl-K.

## Archivos

Lo que envías puede llevar archivos de cualquier tipo: `/attach`, Ctrl-V o un archivo soltado en la
terminal. Al modelo se le dice la ruta de cada archivo y lo lee con sus herramientas cuando lo
necesita, así que nada del archivo se guarda en la sesión ni se envía en cada petición. Los archivos
esperan sobre el editor, cada uno tras un icono de su tipo, y se ven bajo tu mensaje una vez enviado.

| Forma              | Da                                                                            |
| ------------------ | ----------------------------------------------------------------------------- |
| `/attach <file>`   | El archivo de esa ruta, desde la carpeta de la sesión                         |
| Ctrl-V             | Los archivos copiados en un gestor de archivos, en Wayland y X11, o la imagen |
| Un archivo soltado | Ese archivo, cuando lo pegado son solo rutas de archivos que existen          |

Ctrl-V lee el portapapeles del escritorio, con `wl-paste` en Wayland, `xclip` en X11 o AppKit en
macOS, ya que una terminal solo pega texto. Una imagen pegada se guarda en `~/.rumbo/pasted/` y se da
por esa ruta. En Windows rumbo todavía no lee el portapapeles, y lo dice: usa `/attach`.

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
