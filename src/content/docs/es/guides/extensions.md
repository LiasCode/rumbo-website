---
title: Extensiones y MCP
description: Da al modelo herramientas propias en rumbo, desde un programa tuyo o desde un servidor Model Context Protocol. Registrar, inspeccionar, iniciar sesión, limitar y sustituir herramientas.
---

Una extensión es un programa que da al modelo más herramientas, además de las cuatro de rumbo. La registras una vez, y todas las ejecuciones que empiecen después tienen sus herramientas, en cualquier proyecto. rumbo la arranca cuando una ejecución la necesita por primera vez y mantiene un solo proceso suyo mientras funciona.

## Añadir un servidor MCP

rumbo trae la extensión para servidores [Model Context Protocol](https://modelcontextprotocol.io). Añádela una vez por servidor, con el nombre que elijas:

```sh
# Un servidor que se arranca con un comando
rumbo extension add files {self} extend mcp npx -y @modelcontextprotocol/server-filesystem "$HOME/notes"

# Un servidor al que se llega por una URL
rumbo extension add -config '{"url":"https://example.com/mcp"}' docs {self} extend mcp
```

`{self}` representa el ejecutable de rumbo. rumbo arranca la extensión al añadirla, que es la prueba de que funciona, y dice qué herramientas recibe el modelo.

| Campo       | Qué hace                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------- |
| `url`       | La dirección de un servidor al que se llega por HTTP, en lugar de un comando.             |
| `tools`     | Los nombres de las herramientas que recibe el modelo, separados por comas. Sin él, todas. |
| `prefix`    | Va delante del nombre de cada herramienta, para que las de dos servidores no choquen.     |
| `token_env` | El **nombre** de la variable de entorno que contiene un token tuyo, nunca el token.       |
| `client_id` | Para un servidor cuya autorización no registra clientes por sí sola.                      |

### Iniciar sesión

Un servidor en una URL que pide iniciar sesión empieza sin herramientas y con una función `login`. Registrada como `docs`, en la interfaz de terminal:

| Comando        | Hace                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `/login docs`  | Abre el inicio de sesión en el navegador. Por ssh, pega la dirección en la que termina el navegador. |
| `/logout docs` | Olvida el inicio de sesión.                                                                          |

El inicio de sesión se guarda con las demás credenciales de rumbo, legible solo por ti, y se renueva cuando caduca. Las herramientas del servidor son del modelo desde la siguiente ejecución.

## Ver qué aporta una y cuánto cuesta

```sh
rumbo extension list             # las extensiones que añadiste
rumbo extension show files       # su configuración, sus herramientas y los bytes que añaden a cada petición
rumbo extension set files tools=read_text_file,list_directory prefix=notes_
rumbo extension set files tools= # un valor vacío devuelve el campo a su valor por defecto
rumbo extension rm files
```

Desde cualquier interfaz, las funciones del host hacen lo mismo; en la interfaz de terminal, `/extensions` las lista, las muestra, las configura, las añade y las quita. Un cambio se aplica a las ejecuciones que empiezan después, y la interfaz de terminal ofrece lo que ofrece una extensión en cuanto se añade:

```text
/extensions add docs config={"url":"https://example.com/mcp"} {self} extend mcp
/extensions files tools=read_text_file,list_directory
```

Tras `/extensions files tools=`, el menú ofrece todas las herramientas que tiene el servidor, con lo que hace cada una, elemento a elemento: la extensión `mcp` las lista con una función propia, `tools`.

El nombre, la descripción y el esquema de cada herramienta se envían al modelo con **cada petición**, la use la tarea o no. `show` dice cuántos bytes son. Da al modelo las herramientas que una tarea necesita, con `tools`, en lugar de todo lo que tiene un servidor.

## Sustituir una herramienta de rumbo

Una extensión puede ocupar el lugar de `read`, `write`, `edit` o `bash`, para ejecutar comandos en un contenedor o preguntar antes de algunos. Nunca lo hace solo por su nombre. Lo dices tú:

```sh
rumbo extension add -replaces bash guard python3 /path/to/examples/guard.py
rumbo extension set guard replaces=       # devuelve bash a rumbo
```

[`examples/guard.py`](https://github.com/LiasCode/rumbo/blob/v0.12.0/examples/guard.py) pregunta antes de cualquier `rm -rf`, en un diálogo, y pasa todo lo demás al `bash` de rumbo.

En Windows la herramienta de shell de rumbo es `powershell`, que ejecuta Windows PowerShell: una
extensión ocupa su lugar allí con `-replaces powershell`.

## Qué más hace una extensión

- **Le dice algo al modelo cuando empieza una ejecución**, en una sección propia, como las notas que guarda. Se envía una vez, y de nuevo solo cuando cambia.
- **Te ofrece comandos**, que se llaman tras su nombre, como `/extensions notes forget` en la interfaz de terminal.
- **Te pregunta algo** mientras una de sus herramientas trabaja.
- **Escucha** lo que hacen las ejecuciones, para avisarte o contar lo que cuestan.

> Una extensión se ejecuta como tú, con tus permisos, y también el servidor MCP que arranque. Añade aquellas en cuyo código confíes.

## Siguiente

- [Crea una extensión](/es/extend/extension/) propia, en cualquier lenguaje.
- Los [plugins](/es/guides/plugins/) reúnen extensiones con proveedores, interfaces y skills.
- El [protocolo de extensiones](/es/reference/extension-protocol/) tiene todos los mensajes.
