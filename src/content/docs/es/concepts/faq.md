---
title: Preguntas frecuentes
sidebar:
  label: Preguntas frecuentes
description: Respuestas sobre rumbo. Si es gratis, qué modelos admite, si funciona con modelos locales o en Windows, si puede usar una suscripción de Claude o ChatGPT y cómo se compara con otros agentes.
---

## ¿rumbo es gratis?

Sí. rumbo es de código abierto con licencia MIT, y no tiene cuentas, ni servidor propio, ni
telemetría. Solo pagas al proveedor de tu modelo, o nada con un modelo local.

## ¿Es un agente de programación?

Es un arnés de agentes general. Puedes usarlo para escribir y cambiar código, ya que una shell y cuatro
herramientas de archivos llegan a todo lo que necesita un proyecto. Pero nada en rumbo trata de
programación: hace lo que piden tu tarea y tus instrucciones, como resumir notas, ordenar archivos o
manejar un programa de escritorio con la [herramienta `computer`](/es/guides/computer-use/).

## ¿Con qué modelos funciona?

Claude mediante la API de Anthropic, los modelos de OpenAI mediante sus API, los modelos de un plan de
ChatGPT y cualquier servidor compatible con Chat Completions de OpenAI. Cualquier otro modelo funciona
mediante un [proveedor que escribas tú](/es/extend/provider/). Consulta
[modelos y proveedores](/es/guides/providers/).

## ¿Puedo usarlo con un modelo local?

Sí. Registra tu servidor, como Ollama, el servidor de llama.cpp o vLLM, como un proveedor con su
dirección, y elige uno de sus modelos. Consulta
[modelos locales y otros servidores](/es/guides/providers/#modelos-locales-y-otros-servidores).

## ¿Puedo usar mi suscripción de ChatGPT o de Claude?

El proveedor integrado `chatgpt` permite iniciar sesión con un plan de ChatGPT. El proveedor integrado `anthropic` usa una clave de API, no una suscripción de Claude. El plugin externo [rumbo-claude](https://github.com/LiasCode/rumbo-claude) documenta su propia compatibilidad, inicio de sesión y limitaciones.

## ¿Funciona en Windows?

No. rumbo funciona en Linux y macOS.

## ¿Pregunta antes de ejecutar un comando?

No. rumbo no tiene avisos de permisos: el agente actúa con tus permisos. Ejecútalo en un contenedor o
una máquina virtual para trabajo en el que no confías. Consulta [antes de ejecutarlo](/es/start/safety/).

## ¿Puedo deshacer lo que el agente hizo en mis archivos?

Con rumbo no: una sesión guarda la conversación, no el disco. Usa tu control de versiones. Ctrl-G en la
interfaz de terminal, y el panel Changes de la aplicación de escritorio, muestran lo que Git ve
cambiado.

## ¿Dónde están mis sesiones?

Cada una es un directorio en `~/.local/share/rumbo/sessions/`, con su historial en `entries.jsonl`,
una entrada por línea. Consulta [sesiones](/es/guides/sessions/#qué-guarda-una-sesión).

## ¿Cómo se compara con otros agentes?

rumbo sigue a [pi](https://pi.dev) en lo que un arnés deja fuera: cuatro herramientas, un prompt de
sistema corto y ni modo de planificación, ni subagentes, ni avisos de permisos. Lo que añade está en
cómo se conectan las piezas: los modelos y las interfaces son programas aparte con protocolos
abiertos, cualquier sesión reproduce cada petición que envió y cada sesión es un rumbo propio, así que
varias trabajan a la par. Consulta [diseño](/es/concepts/design/).

## ¿Puedo usarlo desde mi editor?

Cualquier programa que hable el [Agent Frontend Protocol](/es/reference/frontend-protocol/) puede
controlar rumbo, arrancando `rumbo serve`, como haría una extensión de editor. Consulta
[escribir una interfaz](/es/extend/front-end/).

## ¿Cómo informo de un error o pido una función?

Abre una issue en [GitHub](https://github.com/LiasCode/rumbo/issues).
