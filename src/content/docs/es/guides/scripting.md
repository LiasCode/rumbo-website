---
title: Scripts y tuberías
description: Ejecuta rumbo desde scripts, tareas de cron y CI. La interfaz plain imprime el texto del modelo en stdout y el progreso en stderr, y sale con un código que un script puede comprobar.
---

Cuando la entrada o la salida de rumbo no es una terminal, o lo pides con `-f plain`, usa la interfaz
`plain`: ninguna pantalla que dibujar, el texto del modelo en stdout y un código de salida.

```sh
rumbo "summarize notes.md" > summary.txt
cat task.md | rumbo                               # the whole input is the task
rumbo -c -f plain "now list what is still missing"
```

## Qué va a dónde

- **stdout** recibe el texto del modelo, y nada más.
- **stderr** recibe el progreso, la sesión y los tokens gastados.

Así, `> archivo` guarda la respuesta y el progreso se queda en la pantalla.

## La tarea

`plain` toma la tarea de la línea de comandos; si no hay ninguna, toda la entrada redirigida es la
tarea. Cuando la entrada es una terminal, lee tareas línea a línea, cada una una ejecución propia.

Una tarea dada en la línea de comandos manda sobre la entrada redirigida, que entonces no se lee. Para
que el modelo trabaje sobre algo, nómbralo en la tarea, y el modelo lo leerá con sus herramientas:

```sh
rumbo "review the changes in git diff HEAD~1 and list what is risky"
```

## Códigos de salida

| Código | La ejecución                       |
| ------ | ---------------------------------- |
| `0`    | terminó                            |
| `1`    | falló                              |
| `130`  | se canceló, por ejemplo con Ctrl-C |

## Sesiones en scripts

Una ejecución desde un script es una sesión como cualquier otra: `rumbo -c` la continúa, `rumbo -r` la
reanuda si se cortó, y `rumbo log` y `rumbo request` muestran lo que hizo y lo que envió. Fija
`max_turns` para acotar cuánto puede durar una ejecución:

```sh
rumbo system set max_turns=50
```

## Controlar rumbo desde un programa

Para controlar rumbo desde un programa propio, en lugar de desde una shell, arranca `rumbo serve` y
habla el [Agent Frontend Protocol](/es/reference/frontend-protocol/) por su stdin y su stdout.
Consulta [escribir una interfaz](/es/extend/front-end/).
