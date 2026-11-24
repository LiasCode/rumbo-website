---
title: Sesiones
description: Cómo guarda rumbo tu trabajo en sesiones. Continúalas, reanúdalas, ramifícalas, renómbralas, expórtalas y bórralas, y reproduce la petición exacta que cualquier turno envió al modelo.
---

Una sesión es una conversación ligada al directorio en el que empezó: cada tarea que das en ella, lo que respondió el
modelo y cada llamada a una herramienta con su resultado. rumbo la guarda como una lista de entradas
que solo crece, y eso es lo que te permite continuarla, reanudarla tras un fallo, ramificarla y
reproducir cualquier petición que envió.

## Dónde vive una sesión

Una sesión pertenece al directorio en el que se arrancó rumbo, su raíz, y trabaja ahí desde donde
sea que la continúes. rumbo no busca un repositorio Git alrededor: arrancado en un subdirectorio, la
sesión es de ese subdirectorio y solo lee sus [instrucciones](/es/guides/instructions-and-skills/).
Arranca rumbo en la raíz de un repositorio para trabajar con su guía.

## Continuar y reanudar

```sh
rumbo -c "also document it"       # continue the latest session started here
rumbo -s <session> "and test it"  # continue a given one
rumbo -r                          # resume the unfinished run of the latest session
```

Una ejecución que falló, se canceló o se cortó porque su proceso murió queda sin terminar. Reanudarla
le dice al modelo que la ejecución se interrumpió, cierra con un error las llamadas a herramientas que
nunca terminaron y sigue sin una tarea nueva.

Cada ejecución termina con una nota en la sesión que dice cómo acabó: hecha, fallida o cancelada. Un
fallo nunca queda solo en la pantalla.

## Un rumbo, una sesión

Cada `rumbo` que arrancas trabaja en una sesión, con su propio proveedor y sus propias extensiones,
como un proceso aparte. Otra sesión es otro `rumbo`: arranca uno para una sesión nueva, `rumbo -c`
para la última del directorio o `rumbo -s <session>` para cualquiera. Varios funcionan a la par.

La [interfaz de terminal](/es/guides/terminal-ui/) muestra varias sesiones arrancando un rumbo para
cada una que abres: una ejecución sigue en su sesión mientras miras otra, y la barra lateral te avisa
cuando termina. Mientras una ejecución trabaja, lo que escribes llega al modelo antes de su siguiente
petición, sin detenerla.

## Ramificar

Una rama es una sesión nueva que empieza con una copia de otra, tal como está o como estaba antes de
uno de tus mensajes, y sigue desde ahí. La sesión de la que viene queda como estaba, y puede seguir
trabajando al mismo tiempo.

- En la interfaz de terminal, Shift-Tab sube a la conversación; Enter sobre uno de tus mensajes lo
  cambia, o lo vuelve a preguntar, en una rama que empieza antes de él.
- `/branch` ramifica la sesión tal como está y dice qué sesión es la rama.

El rumbo que hizo una rama se queda en su sesión, y otro sigue en la rama: la interfaz de terminal lo
arranca y la muestra, y en otros casos lo hace `rumbo -s <session>`. Una rama se titula "Branch"
seguido del título de la sesión de la que viene, para distinguirlas en una lista.

Una rama copia solo la conversación. rumbo no rastrea archivos, así que los archivos quedan como
están.

## Listar, renombrar y borrar

```sh
rumbo sessions                          # the sessions started here, with how each stands
rumbo sessions -all                     # those of every directory
rumbo sessions -json                    # the same, for a program to read
rumbo sessions rename <session> <title> # a title of your own
rumbo sessions rm <session>...          # delete sessions and their history
rumbo sessions prune 30d                # list those not used in 30 days; -yes deletes them
```

Una sesión que está usando un proceso de rumbo nunca se borra. En la interfaz de terminal, `/rename`
le da un título a la sesión que se muestra, y `/delete` la borra una vez que lo aceptas. La sesión en
la que se arrancó rumbo queda retenida hasta que sales, así que bórrala después, con
`rumbo sessions rm`.

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
