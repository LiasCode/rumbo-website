---
title: Aplicación de escritorio
description: rumbo-gui es una ventana de escritorio para rumbo. Todos los proyectos y sesiones en un sitio, cada sesión como una conversación, un diff de lo que cambió y los ajustes de rumbo, sin terminal.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) es una ventana de escritorio para rumbo: todos los
proyectos y sesiones en un sitio, cada sesión como una conversación, y los ajustes de rumbo, sin
terminal. Es una interfaz como cualquier otra, hecha con Rust y
[GPUI](https://github.com/zed-industries/zed), y habla el mismo
[Agent Frontend Protocol](/es/reference/frontend-protocol/) que la interfaz de terminal.

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

## Cómo funciona con rumbo

- **Cada proyecto abierto tiene su propio `rumbo serve`**, así que sus ejecuciones siguen mientras
  miras otro proyecto u otra sesión.
- **Todo es de rumbo.** Las sesiones, los ajustes y los proveedores viven en rumbo; la ventana solo
  guarda sus propias preferencias, como su tema y los proyectos fijados.
- **Nada está fijado en el código.** Los comandos, los formularios y los selectores salen de lo que
  describen rumbo y el proveedor, así que una función nueva aparece sola.
- **Los archivos son tuyos.** Solo los lee, para mostrar lo que Git ve cambiado, y Open in Editor
  pasa el proyecto a tu editor.

## Instalación

rumbo-gui se compila desde el código fuente, con Rust, y necesita rumbo instalado aparte: una versión
posterior a la 0.5.

```sh
git clone https://github.com/LiasCode/rumbo-gui
cd rumbo-gui
cargo build --release      # the binary is target/release/rumbo-gui
install -Dm644 rumbo-gui.desktop ~/.local/share/applications/rumbo-gui.desktop
```

Pon en `Exec`, en el archivo `.desktop`, la ruta del binario si no está en tu `PATH`.

## Uso

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]
```

`DIR` es el primer proyecto que se abre, y `FLAGS` se pasan a `rumbo serve`, como `-c` o `-p`.
`--rumbo` indica el ejecutable de rumbo cuando no está en tu `PATH`.

rumbo también puede arrancar la ventana él mismo, como arranca su interfaz de terminal. Entonces la
ventana trabaja solo en el proyecto de ese rumbo y se cierra con él:

```sh
rumbo frontend add gui /path/to/rumbo-gui --attached
rumbo -f gui "a task"      # or: rumbo system set frontend=gui
```

Su [README](https://github.com/LiasCode/rumbo-gui#readme) lista todas las teclas.
