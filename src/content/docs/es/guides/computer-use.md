---
title: Control del escritorio
description: Activa la herramienta computer de rumbo para que el modelo haga capturas de pantalla y use el puntero y el teclado de tu escritorio, en Hyprland, Sway, X11 o macOS.
---

Una shell arranca programas, pero no puede mostrarle al modelo lo que dibujan ni pulsar sus botones.
La herramienta `computer` sí: el modelo hace capturas del escritorio en el que corre rumbo y usa su
puntero y su teclado. Está desactivada hasta que la activas.

```sh
rumbo system set computer=on
```

> **Advertencia**
>
> Con la herramienta activada, el modelo actúa sobre lo que tenga el foco, con tu puntero y tu teclado.
> Lee [antes de ejecutarlo](/es/start/safety/), y dale un escritorio propio cuando puedas.

## Qué necesita

| Escritorio                                 | Necesita                                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Compositores wlroots, como Hyprland y Sway | `grim`                                                                                                                |
| X11                                        | `xdotool`, y `maim` o ImageMagick                                                                                     |
| macOS                                      | Grabación de pantalla, Accesibilidad y Automatización de System Events, permitidos para el programa que ejecuta rumbo |

En macOS la herramienta está escrita, pero aún no se ha probado. En Windows todavía no hay pantalla
sobre la que actuar: con `computer=on` la herramienta lo dice.

## Cómo se comporta

- **Muestra el monitor en uso**, en capturas de como mucho 1280×800, y traduce las coordenadas del
  modelo a la pantalla.
- **Solo actúa sobre la pantalla que el modelo vio por última vez.** Cuando mueves el puntero tú, o
  pasas a otro monitor, no hace nada más hasta que el modelo haga una captura nueva. Mover el ratón es
  la forma de recuperar el escritorio.
- **Su teclado es uno estadounidense**, sea cual sea tu distribución, y aun así escribe los caracteres
  que le faltan a ese teclado.

## Lo que cuesta

Una captura se queda en la conversación, como cualquier resultado de una herramienta, y se vuelve a
enviar con cada petición posterior: unos 1.400 tokens cada vez, hasta que la conversación se compacta.

## Sin ceder tu escritorio

Para mantener al modelo lejos de lo que estás haciendo, dale una pantalla propia: un Sway arrancado con
`WLR_BACKENDS=headless` no muestra nada en tu escritorio, y un `Xwayland :N` en modo rootful da a X11
un servidor propio. Ejecuta rumbo con esa pantalla en su entorno.
