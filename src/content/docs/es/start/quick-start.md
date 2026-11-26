---
title: Inicio rápido
description: Elige un modelo, ejecuta tu primera tarea con rumbo, abre la interfaz de terminal y continúa o reanuda una sesión.
---

Esta página te lleva de un `rumbo` instalado a una tarea terminada. Si aún no lo has instalado,
consulta la [instalación](/es/start/installation/).

## 1. Elige un proveedor y un modelo

Un proveedor es la forma en que rumbo llega a un modelo. Con una clave de API de Anthropic:

```sh
export ANTHROPIC_API_KEY=...                         # or /login in the terminal UI, or `ant auth login`
rumbo system set default_provider=anthropic          # what new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # and the model they start with there
```

Para usar un plan de ChatGPT en lugar de una clave de API, un modelo local u OpenAI, consulta
[modelos y proveedores](/es/guides/providers/).

## 2. Dale una tarea

Ve al proyecto en el que quieres trabajar y dale una tarea a rumbo:

```sh
cd ~/code/my-project
rumbo "add a --json flag to the export command"
```

rumbo abre la interfaz de terminal, y el modelo trabaja con sus herramientas hasta que deja de
llamarlas. Cada llamada a una herramienta se muestra mientras se ejecuta, y la ejecución termina con
una línea que dice cómo acabó, cuánto tardó y cuántos turnos y tokens usó.

> **Precaución**
>
> El modelo lee, escribe y ejecuta comandos como tú, sin preguntar. Lee primero
> [antes de ejecutarlo](/es/start/safety/).

## 3. Sigue adelante

```sh
rumbo                                            # the terminal UI; /help lists its commands
rumbo -c "also document it"                      # continue the latest session started here
rumbo -r                                         # resume a run that stopped
rumbo "summarize notes.md" > summary.txt         # piped: plain text out, exit code
```

`rumbo` sin más abre la interfaz de terminal a pantalla completa: la conversación y, debajo, un
editor con el modelo, la rama de Git y lo lleno que está el contexto. Una barra empieza un comando,
como `/model` o `/resume`, y `/help` los lista todos; Ctrl-B muestra las sesiones de la carpeta.
Consulta la guía de la [interfaz de terminal](/es/guides/terminal-ui/).

## 4. Cuéntale cómo trabajas

El modelo lee tus instrucciones: el archivo `AGENTS.md` o `CLAUDE.md` del directorio en el que
arranca rumbo, y los tuyos en `~/.rumbo/`. Arranca rumbo en la raíz de un repositorio para
trabajar con su guía. Escribe ahí cómo debe hacerse el trabajo y qué
comprobar antes de darlo por terminado. Consulta [instrucciones y skills](/es/guides/instructions-and-skills/).

## Siguiente

- [Sesiones](/es/guides/sessions/): continúa, reanuda, ramifica y exporta tu trabajo.
- [Configuración](/es/guides/configuration/): todos los ajustes, que se cambian de la misma forma.
- [Línea de comandos](/es/reference/command-line/): todos los comandos y opciones.
