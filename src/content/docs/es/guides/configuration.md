---
title: Configuración
description: Configura rumbo con nombre=valor en tres niveles, el sistema, un proveedor y una sesión, todo guardado en un único config.yaml que puedes leer y editar.
---

Todos los ajustes de rumbo se cambian de la misma forma, como `nombre=valor`, y un valor vacío
devuelve el ajuste a su valor por defecto. Lo que configuras se guarda en un único archivo,
`config.yaml`, que contiene solo lo que elegiste.

```sh
rumbo config                     # everything that is set and what applies, with where each value comes from
rumbo system set computer=on     # a system setting
rumbo provider set openai effort=high
rumbo frontend set tui theme=plain
rumbo system set max_turns=      # an empty value: back to the default
```

Lo que un programa no acepta se rechaza antes de guardarlo: un nombre que no tiene o un valor que no
admite.

## Tres niveles

La configuración tiene tres niveles, separados:

- **El sistema** es lo propio de rumbo, igual en todas partes: qué proveedor e interfaz arrancar y los
  límites de una ejecución.
- **Un proveedor** tiene el modelo con el que empieza una sesión nueva que lo usa, y una
  configuración, que también guarda los valores de sus opciones.
- **Una sesión** conserva lo que eligió: su proveedor, su modelo y valores de las opciones del
  proveedor. Lo que eligió una sesión manda sobre lo del proveedor en ella.

Nada se configura por proyecto. Los ajustes son los mismos en todos los directorios, y lo que cambia de
un trabajo a otro es la sesión.

## Ajustes del sistema

| Ajuste             | Por defecto                          | Qué hace                                                                               |
| ------------------ | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `default_provider` | sin fijar; lo elige `-p`             | El proveedor con el que empieza una sesión nueva, con el modelo de ese proveedor       |
| `frontend`         | `tui` en una terminal, `plain` si no | La interfaz que se arranca                                                             |
| `max_turns`        | `150`                                | Respuestas del modelo tras las que se detiene una ejecución; `0` para no tener límite  |
| `max_tokens`       | el límite propio del proveedor       | Límite de tokens de salida por respuesta                                               |
| `compact_at`       | `80%`                                | Proporción del contexto del modelo a la que se resume la conversación; `0%` para nunca |
| `computer`         | `off`                                | `on` da al modelo la [herramienta `computer`](/es/guides/computer-use/)                |

```sh
rumbo system                     # the system settings, each with where its value comes from
rumbo system set compact_at=70%
```

Un ajuste del sistema se aplica a las ejecuciones que empiezan después de guardarlo, sin volver a
arrancar rumbo. `default_provider` y `frontend` se aplican desde el siguiente arranque.

## Ajustes de proveedores e interfaces

```sh
rumbo provider show anthropic              # its model, configuration, and options, with their defaults
rumbo provider set anthropic model=claude-opus-5-5 effort=high
rumbo frontend show tui
rumbo frontend set tui color_code=cyan
```

Qué campos y opciones acepta un programa lo decide él, y lo dice al arrancar; rumbo comprueba el valor
contra eso, y arranca el programa con el cambio, antes de guardarlo.

## Ajustes de la sesión

```sh
rumbo -p openai -m <model> -o effort=low "a task"   # choose for a new session
```

En la interfaz de terminal:

```text
/use openai <model>       the provider and model of this session
/session-set effort=low   an option, for this session only
/session-set effort=      back to the provider's value
```

Una ejecución conserva lo que tenía al empezar; un cambio se aplica a la siguiente.

## El archivo de configuración

`config.yaml` está en `~/.config/rumbo/` (`~/Library/Application Support/rumbo/` en macOS). Contiene
solo lo que elegiste, nunca un valor por defecto, y puedes editarlo: rumbo lo cambia valor a valor y
respeta tus comentarios.

```yaml
system:
  default_provider: anthropic
providers:
  anthropic:
    model: claude-opus-5-5
    config:
      effort: high # every session, unless it chooses another with -o
```

rumbo se niega a arrancar con un ajuste que falta, está mal formado o mal escrito en el archivo, y dice
dónde está, en lugar de adivinar.

## Variables de entorno

| Variable          | Qué cambia                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| `RUMBO_CONFIG`    | El archivo de configuración que se usa en lugar de `config.yaml`       |
| `RUMBO_DATA`      | El directorio de datos de rumbo, que guarda las sesiones               |
| `XDG_CONFIG_HOME` | Directorio base de `rumbo/config.yaml` en Linux                        |
| `XDG_DATA_HOME`   | Directorio base de los datos `rumbo/` en Linux y macOS                 |
| `NO_COLOR`        | La interfaz de terminal no muestra colores, con su `theme` por defecto |

Los proveedores leen las suyas, como `ANTHROPIC_API_KEY` y `OPENAI_API_KEY`. Consulta
[modelos y proveedores](/es/guides/providers/).
