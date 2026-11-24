---
title: Aplicación de escritorio
description: rumbo-gui es una ventana de escritorio para rumbo. Todos los proyectos y sesiones en un sitio, cada sesión como una conversación, un diff de lo que cambió y los ajustes de rumbo, sin terminal.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) es una ventana de escritorio para rumbo: todos los
proyectos y sesiones en un sitio, cada sesión como una conversación, y los ajustes de rumbo, sin
terminal. Es una interfaz como cualquier otra, hecha con Rust y
[GPUI](https://github.com/zed-industries/zed), y habla la
[versión 2 del Agent Frontend Protocol](/es/reference/next/), que solo tiene la rama de desarrollo de
rumbo.

## Qué puedes hacer

- **Trabajar en sesiones.** Búscalas, abre una con Ctrl-K o de Ctrl-1 a Ctrl-9, y renómbrala,
  ramifícala, compáctala, expórtala como Markdown o bórrala desde su menú. Todos los proyectos están
  en la barra lateral, con sus sesiones de la más nueva a la más antigua; fija arriba los que más usas.
- **Ir atrás y adelante**, como en un navegador, entre las sesiones, los proyectos y los ajustes que
  visitaste, con Alt-Izquierda y Alt-Derecha o los botones de atrás y adelante del ratón.
- **Seguir una ejecución.** La respuesta del modelo como Markdown, cada llamada a una herramienta con
  lo que cambió en un archivo y cuánto tardó la ejecución; dile algo mientras trabaja, o cancélala.
- **Enseñarle una imagen al modelo.** Ctrl-V pega en el editor la imagen del portapapeles.
- **Cambiar de idea.** Edita un mensaje, o vuelve a preguntarlo, en una rama que empieza antes de él.
- **Revisar el trabajo.** El panel Changes muestra el diff de la carpeta del proyecto; el panel Files,
  sus archivos, cada uno marcado con lo que dice Git de él; el panel Details, lo lleno que está el
  contexto del modelo, los tokens gastados y las skills de las que se le informa.
- **Dejar ejecuciones trabajando.** Las ejecuciones siguen en otras sesiones y proyectos, y la
  ventana, o el escritorio si lo activas, te avisa cuando termina una.

> **rumbo-gui no funciona con rumbo 0.9.0.** Necesita un rumbo que hable la versión 2 del protocolo de interfaz y tenga `rumbo sessions -json`, lo que hoy significa uno compilado desde la rama de desarrollo: `go install github.com/LiasCode/rumbo/cmd/rumbo@main`. [Qué cambia después de 0.9.0](/es/reference/next/).

## Cómo funciona con rumbo

Cada sesión abierta tiene su propio host. Las ejecuciones continúan en segundo plano cuando cambias de sesión; cerrar la ventana cancela las de los hosts que inició.

## Instalación

Es un plugin, que rumbo compila donde lo añades, así que necesita `cargo`, de Rust, en esa máquina. Después elige `gui` para un arranque:

```sh
rumbo plugin add https://github.com/LiasCode/rumbo-gui
rumbo -f gui
```

## Uso

La ventana también funciona por sí sola, y arranca los rumbos que necesita:

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]   # --rumbo: el ejecutable de rumbo, cuando no está en el PATH
```

[rumbo-gui README](https://github.com/LiasCode/rumbo-gui#readme)
