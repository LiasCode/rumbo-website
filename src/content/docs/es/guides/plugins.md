---
title: Plugins
description: Instala, inspecciona, actualiza y elimina plugins de rumbo, que reúnen proveedores, interfaces, extensiones y skills desde un directorio o un repositorio Git.
---

Un plugin aporta varias cosas a la vez: proveedores, interfaces, extensiones y skills. Es un directorio, o un repositorio Git, con un `plugin.yaml` que las nombra. Una vez añadido, lo que aporta está ahí como lo que rumbo trae de serie, y se configura igual.

## Añadir uno

```sh
rumbo plugin add https://example.com/team/ink-plugin.git   # un repositorio Git, que rumbo copia
rumbo plugin add ~/code/ink-plugin                         # un directorio, que se usa donde está
```

Añadir un plugin lo compila, si su manifiesto dice cómo, y después arranca cada proveedor y cada extensión que aporta, que es la prueba de que funciona. Un plugin que no la pasa no se añade. Después rumbo dice qué aportó:

```text
added the plugin notes, which brings:
  the extension notes
  the skill meeting-notes
```

> La compilación de un plugin y sus programas se ejecutan como tú, con tus permisos. Añade aquellos en cuyo código confíes.

## Ver lo que tienes

```sh
rumbo plugin list          # el plugin propio de rumbo y los que añadiste
rumbo plugin show notes    # dónde está y qué aporta
rumbo plugin show rumbo    # lo que viene con rumbo: sus proveedores y su interfaz de terminal
```

## Configurar lo que aportó

Los programas de un plugin se configuran como cualquier otro, por su tipo y su nombre:

```sh
rumbo extension set notes <field>=<value>
rumbo provider set house-model model=<model>
rumbo frontend set panel <field>=<value>
```

Lo que tú ajustas se impone a la configuración que da el plugin. `rumbo skills` lista sus skills junto a las tuyas.

## Actualizar y eliminar

```sh
rumbo plugin update notes   # un plugin añadido desde Git: descarga, compila y lo prueba de nuevo
rumbo plugin rm notes       # lo quita, con lo que ajustaste para lo que aportó
```

Una actualización que ya no compila o no arranca vuelve a lo que el plugin era. Un plugin añadido desde un directorio se lee tal cual cada vez, así que no hay nada que actualizar. Eliminar un plugin borra la copia que rumbo guarda de un repositorio, y nunca tu propio directorio.

## Cuando un plugin sustituye una herramienta

Una extensión de un plugin puede pedir ocupar el lugar de una herramienta de rumbo, como `bash`. Entonces añadir el plugin se detiene y lo dice, y tú aceptas nombrando las herramientas:

```sh
rumbo plugin add -replaces bash <source>
```

Una actualización que pide sustituir más de lo que aceptaste se rechaza.

## Siguiente

- El [manifiesto de un plugin](/es/reference/plugins/) dice todo lo que puede tener un `plugin.yaml`.
- [`examples/plugin`](https://github.com/LiasCode/rumbo/tree/v0.11.0/examples/plugin) es uno del que partir.
- La [aplicación de escritorio](/es/guides/desktop-app/) se distribuye como plugin.
