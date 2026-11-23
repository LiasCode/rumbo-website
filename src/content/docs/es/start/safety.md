---
title: Antes de ejecutarlo
description: rumbo da al modelo tus permisos, sin sandbox ni avisos de permisos. Qué significa, adónde van tus datos y cómo ejecutar con seguridad trabajo en el que no confías.
---

rumbo no tiene un sistema de permisos. Es una decisión, no una carencia: el agente actúa con los
permisos del usuario que lo inició, y limitar lo que puede hacer se deja a un sandbox de tu elección.

## Qué puede hacer el modelo

- **Actúa como tú.** Lee, escribe y ejecuta comandos como tú, sin preguntar y sin sandbox.
- **Lo que lee puede dirigirlo.** El `AGENTS.md` de un proyecto, sus archivos o la salida de un
  comando pueden llevar instrucciones. Trabaja con código en el que no confías dentro de un contenedor
  o una máquina virtual.
- **Con la herramienta `computer` activada, usa tu pantalla.** Hace capturas y usa el puntero y el
  teclado del escritorio en el que corre rumbo. La herramienta está desactivada hasta que
  [la activas](/es/guides/computer-use/).

## Qué guarda rumbo

- **Las sesiones guardan lo que vio el modelo**, incluidos los secretos que salgan en la salida de los
  comandos, en `~/.local/share/rumbo/sessions/`, legible solo por ti.
- **Una clave de API que le das al `/login` de un proveedor integrado** se guarda en
  `~/.config/rumbo/credentials/` (`~/Library/Application Support/rumbo/credentials/` en macOS),
  legible solo por ti, y por tanto también por el modelo.
- **Un secreto que pide un proveedor**, como un código de inicio de sesión, va de la interfaz al
  proveedor y no se registra en ningún sitio, ni siquiera en la sesión.

## Qué llega a la red

rumbo en sí no contacta con ningún servidor y no tiene telemetría. Solo tus proveedores y los
comandos del modelo llegan a la red.

## Ejecutarlo en un sandbox

Como rumbo es un único binario que guarda su estado en archivos, corre dentro del aislamiento que ya
uses: un contenedor, una máquina virtual o una cuenta de usuario aparte. Dale el proyecto, las
credenciales de su proveedor y nada más.
