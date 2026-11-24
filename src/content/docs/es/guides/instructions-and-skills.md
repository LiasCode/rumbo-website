---
title: Instrucciones y skills
description: Explica al agente de rumbo cómo trabajas con archivos AGENTS.md y CLAUDE.md, y dale skills en el formato Agent Skills que solo lee cuando una tarea las necesita.
---

rumbo envía al modelo poco que no haya pedido: el entorno en el que trabaja, tus instrucciones y para
qué sirve cada una de tus skills. Todo lo demás sobre una tarea lo descubre el modelo con sus
herramientas. Las instrucciones y las skills son donde le dices cómo debe hacerse el trabajo.

## Instrucciones

El modelo lee los archivos `AGENTS.md` o `CLAUDE.md`:

- del proyecto, desde su raíz hasta el directorio en el que estás;
- los tuyos, en `~/.config/rumbo/` (`~/Library/Application Support/rumbo/` en macOS), que se aplican
  en todas partes.

Escribe ahí lo que una tarea no puede mostrar por sí sola: cómo quieres que se haga el trabajo, qué
comandos lo comprueban y qué no debe pasar nunca.

```markdown title="AGENTS.md"
# Agent guide

- Run `make check` before saying a change is done, and report what it printed.
- Never commit; I review and commit myself.
- Write to me in Spanish; code and comments in English.
```

Tus instrucciones mandan sobre las de rumbo: primero lo que dices en la conversación, después tu
`AGENTS.md`. Un archivo largo se corta, indicando dónde está el resto, para que el modelo pueda leerlo.

## Skills

Una skill son instrucciones para un tipo de tarea, en el formato [Agent Skills](https://agentskills.io):
un directorio con un `SKILL.md` cuyo frontmatter tiene un `name` y una `description` de para qué sirve
y cuándo usarla.

```markdown title="~/.config/rumbo/skills/meeting-notes/SKILL.md"
---
name: meeting-notes
description: Write meeting notes in my format. Use for any summary of a meeting.
---

One heading per topic, decisions first, then who does what by when.
```

Las skills van en:

- `~/.config/rumbo/skills/<name>/` (`~/Library/Application Support/rumbo/skills/` en macOS), las tuyas;
- `.agents/skills/<name>/` en un proyecto, desde su raíz hasta donde estás. Una skill del proyecto
  reemplaza a una tuya con el mismo nombre.
- `skills/<name>/` en un [plugin](/es/guides/plugins/) que añadiste. Una tuya con el mismo nombre la
  reemplaza.

Con cada petición solo se envían el nombre, la descripción y la ruta. El modelo lee la skill cuando una
tarea la necesita, así que una skill cuesta una línea hasta que se usa.

```sh
rumbo skills    # the skills the model is told of here, and those left out, with why
```

`/skills` en la interfaz de terminal dice lo mismo. Una skill se deja fuera cuando otra con el mismo
nombre la reemplazó, o cuando su frontmatter falta, no está cerrado, no es YAML válido o no tiene
descripción.

## El entorno

Al modelo también se le dice el directorio en el que trabaja, la plataforma y la fecha. Eso es todo:
rumbo no detecta proyectos y no envía nada sobre ningún lenguaje o framework.
