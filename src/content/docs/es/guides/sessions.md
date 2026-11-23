---
title: Sesiones
description: Cómo guarda rumbo tu trabajo en sesiones. Continúalas, reanúdalas, ramifícalas, renómbralas, expórtalas y bórralas, y reproduce la petición exacta que cualquier turno envió al modelo.
---

Una sesión es una conversación ligada a un proyecto: cada tarea que das en ella, lo que respondió el
modelo y cada llamada a una herramienta con su resultado. rumbo la guarda como una lista de entradas
que solo crece, y eso es lo que te permite continuarla, reanudarla tras un fallo, ramificarla y
reproducir cualquier petición que envió.

## Proyectos

Un proyecto es la raíz de un repositorio Git, o el propio directorio fuera de uno. Las sesiones
pertenecen al proyecto y se encuentran desde cualquier directorio dentro de él; una sesión sigue
trabajando en el directorio en el que empezó.

## Continuar y reanudar

```sh
rumbo -c "also document it"       # continue the latest session of this project
rumbo -s <session> "and test it"  # continue a given one
rumbo -r                          # resume the unfinished run of the latest session
```

Una ejecución que falló, se canceló o se cortó porque su proceso murió queda sin terminar. Reanudarla
le dice al modelo que la ejecución se interrumpió, cierra con un error las llamadas a herramientas que
nunca terminaron y sigue sin una tarea nueva.

Cada ejecución termina con una nota en la sesión que dice cómo acabó: hecha, fallida o cancelada. Un
fallo nunca queda solo en la pantalla.

## Varias sesiones a la vez

Un mismo rumbo trabaja en varias sesiones de un proyecto a la vez, una ejecución por sesión. En la
[interfaz de terminal](/es/guides/terminal-ui/), una ejecución sigue en su sesión mientras abres otra,
y la barra lateral te avisa cuando termina. Mientras una ejecución trabaja, lo que escribes llega al
modelo antes de su siguiente petición, sin detenerla.

`-single` hace que rumbo trabaje en una sola sesión a la vez.

## Ramificar

Una rama es una sesión nueva que empieza con una copia de otra, tal como está o como estaba antes de
uno de tus mensajes, y sigue desde ahí. La sesión de la que viene queda como estaba, y puede seguir
trabajando al mismo tiempo.

- En la interfaz de terminal, Shift-Tab sube a la conversación; Enter sobre uno de tus mensajes lo
  cambia, o lo vuelve a preguntar, en una rama que empieza antes de él.
- `/branch` ramifica la sesión tal como está.

Una rama copia solo la conversación. rumbo no rastrea archivos, así que los archivos quedan como
están.

## Listar, renombrar y borrar

```sh
rumbo sessions                          # this project's sessions, with how each stands
rumbo sessions -all                     # every project's
rumbo sessions rename <session> <title> # a title of your own
rumbo sessions rm <session>...          # delete sessions and their history
rumbo sessions prune 30d                # list those not used in 30 days; -yes deletes them
```

Una sesión que está usando un proceso de rumbo nunca se borra. En la interfaz de terminal, `/rename`,
`/delete` y `/prune` hacen lo mismo, y para borrar te piden que lo aceptes primero.

## Compactación

Cuando una conversación se acerca al límite de contexto del modelo, rumbo le pide al modelo que la
resuma, y la siguiente petición empieza desde ese resumen. Eso es la compactación. Ocurre al 80 % del
contexto que informa el proveedor, o a los 150.000 tokens cuando no lo dice; el
[ajuste](/es/guides/configuration/#ajustes-del-sistema) `compact_at` cambia la proporción. `/compact`
resume una sesión cuando lo pides.

Lo anterior se queda guardado en la sesión. Solo cambia la petición.

## Qué guarda una sesión

Cada sesión es un directorio en `~/.local/share/rumbo/sessions/<id>/`:

- `session.json` dice qué es y qué eligió: su proveedor, su modelo y las opciones fijadas para ella;
- `entries.jsonl` guarda su historial, una entrada por línea, y solo se le añaden líneas.

```sh
rumbo log <session>             # every entry, as JSON lines
rumbo request <session> [turn]  # the exact request a turn sent the provider
```

Cada petición se reconstruye solo a partir de las entradas, así que `rumbo request` imprime lo que se
envió, byte a byte. Eso hace de una sesión algo que puedes depurar: cuando una ejecución salió mal,
puedes ver exactamente qué recibió el modelo.

## Exportar

`/export` en la interfaz de terminal escribe la sesión como Markdown: lo que se pidió, lo que escribió
el modelo, cada llamada a una herramienta con el cambio que hizo o el principio de lo que devolvió, y
cómo terminó cada ejecución. Escribe `rumbo-<session>.md` en el directorio en el que trabaja la
sesión, o en la ruta que indiques, y nunca sobre un archivo que ya existe.
