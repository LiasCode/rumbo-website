---
title: Línea de comandos
description: Todos los comandos y opciones de rumbo. Ejecuta tareas, continúa y reanuda sesiones, y gestiona sesiones, ajustes, proveedores e interfaces desde la shell.
---

`rumbo help` imprime esta lista, y cada grupo de comandos imprime la suya con `help`, como
`rumbo provider help`. Las descripciones de los bloques siguientes son las que imprime
rumbo, en inglés.

## Ejecutar tareas

```text
rumbo [flags] [objective]
    work in the current directory, in a front end
rumbo serve [flags]
    be the host for a front end on stdin/stdout
```

| Opción              | Hace                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `-c`                | Continuar la última sesión empezada en este directorio                                                                                |
| `-r`                | Reanudar la ejecución sin terminar de esa sesión, sin una tarea nueva                                                                 |
| `-s <session>`      | Continuar la sesión indicada                                                                                                          |
| `-p <provider>`     | Proveedor de la sesión (por defecto: el ajuste `default_provider`)                                                                    |
| `-m <model>`        | Modelo de la sesión (por defecto: el modelo fijado para su proveedor)                                                                 |
| `-o <name>=<value>` | Una opción del proveedor para la sesión, como `-o effort=high`; se puede repetir, y un valor vacío la devuelve al valor del proveedor |
| `-f <name>`         | Interfaz para este arranque (por defecto: el ajuste `frontend`; si no, `tui` en una terminal o `plain`)                               |

La sesión conserva lo que eligen `-p`, `-m` y `-o`, por encima de los ajustes del sistema. Cada
`rumbo` trabaja en una sesión; otra sesión es otro `rumbo`.

## Sesiones

```text
rumbo sessions [-all] [-json]
    list the sessions of this directory, or of every one; with -json, for a
    program to read
rumbo sessions rename <session> <title>
    give a session a title of your own
rumbo sessions rm <session>...
    delete sessions and their history
rumbo sessions prune [-all] [-yes] <age>
    delete the sessions not used in that long, such as 12h, 30d, or 2w;
    without -yes, only list them
rumbo log <session>
    print a session's entries as JSON lines
rumbo request <session> [turn]
    print the request a turn sent the provider, as it was sent; without a
    turn, the last one
```

Las sesiones que está usando un proceso de rumbo no se borran. Consulta [sesiones](/es/guides/sessions/).

## Ajustes

```text
rumbo config
    what is chosen and what applies, each value with where it comes from
rumbo system
    every system setting, its value, and where it comes from
rumbo system set <name>=<value>...
    an empty value gives one back to its default
rumbo skills
    list the skills the model is told of here, and those left out
```

Consulta [configuración](/es/guides/configuration/).

## Proveedores

```text
rumbo provider list
    the providers there are: rumbo's, plugins', and yours
rumbo provider show <name>
    start it, and say each setting, where its value comes from, and what it
    offers
rumbo provider models <name>
    the models it offers, asking it
rumbo provider set <name> <setting>=<value>...
    its model, a field of its configuration, or one of its options; an empty
    value gives one back to its default
rumbo provider add [-config <json>] <name> <command>...
rumbo provider rm <name>
    remove yours, or what you set for rumbo's or a plugin's
```

Un proveedor es cualquier programa que habla el Agent Provider Protocol por su stdin y su stdout.
`{self}` como comando representa el ejecutable de rumbo. Consulta
[modelos y proveedores](/es/guides/providers/).

## Interfaces

```text
rumbo frontend list
    the front ends there are: rumbo's, plugins', and yours
rumbo frontend show <name>
    how it is started, and what is set for it
rumbo frontend set <name> <field>=<value>...
    a field of its configuration, checked when it starts; an empty value
    gives one back to its default
rumbo frontend add [-config <json>] <name> <command>...
rumbo frontend rm <name>
    remove yours, or what you set for rumbo's or a plugin's
```

Una interfaz es cualquier programa que habla el Agent Frontend Protocol por los descriptores de
archivo 3 (lectura) y 4 (escritura), o en Windows por los dos handles que nombra
`RUMBO_FRONTEND_HANDLES`, y conserva la terminal en stdin y stdout. Consulta
[escribir una interfaz](/es/extend/front-end/).

## Programas integrados y versión

```text
rumbo provide <name>
    run a provider of rumbo's own plugin on stdin/stdout
rumbo attach <name>
    run plain, or a front end of rumbo's own plugin, on descriptors 3/4
    (handles on Windows)
rumbo extend mcp [command...]
    run rumbo's own plugin's extension for an MCP server on stdin/stdout
rumbo version
    print the version
```

`provide` y `attach` son la forma en que rumbo arranca sus propios proveedores e interfaces, mediante
los mismos protocolos que cualquier otro.

## Extensiones y MCP

```text
rumbo extension list
    the extensions you added
rumbo extension show <name>
    start it, and say what is set for it and the tools it gives the model
rumbo extension set <name> <field>=<value>...
    a field of its configuration, or replaces, the tools of rumbo's own it
    takes the place of, checked by starting it; an empty value gives one
    back
rumbo extension add [-config <json>] [-replaces <tools>] <name> <command>...
rumbo extension rm <name>
    remove one
```

Una extensión es cualquier programa que habla el Agent Extension Protocol por su stdin y su stdout. El
plugin propio de rumbo trae una para servidores MCP, que se añade una vez por servidor como
`{self} extend mcp <the server's command>`. Consulta [extensiones y MCP](/es/guides/extensions/).

## Plugins

```text
rumbo plugin list
    rumbo's own plugin, and those you added
rumbo plugin show <name>
    where it is, and what it brings
rumbo plugin add [-replaces <tools>] <source>
    a directory, or the address of a Git repository
rumbo plugin update <name>
    bring one added from an address up to date
rumbo plugin rm <name>
    take one out, with what you set for what it brought
```

Un plugin es un directorio, o un repositorio Git, con un `plugin.yaml` que nombra los programas que
trae, y sus skills en `skills/`. El propio de rumbo, `rumbo`, viene integrado y siempre está. Consulta
[plugins](/es/guides/plugins/).
