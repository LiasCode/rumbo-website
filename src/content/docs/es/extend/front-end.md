---
title: Escribir una interfaz
description: Crea tu propia interfaz para rumbo, una extensión de editor, un bot o una aplicación web, hablando el Agent Frontend Protocol, JSON-RPC por stdio, con el host de rumbo.
---

Una interfaz (front end) es lo que usa una persona para dar tareas y seguir el trabajo. Es un programa
propio, en cualquier lenguaje, que habla el [Agent Frontend Protocol](/es/reference/frontend-protocol/)
con el host de rumbo. La interfaz de terminal, la salida de texto plano y la
[aplicación de escritorio](/es/guides/desktop-app/) son todas interfaces, y ninguna tiene atajos.

Escribe una para llevar rumbo a un editor, un bot de chat, una página web o un flujo de trabajo propio.

## Dos formas de conectarse

Los mensajes son objetos JSON-RPC 2.0, uno por línea, iguales en los dos casos:

| Quién arranca a quién                                     | La interfaz lee de         | La interfaz escribe en     |
| --------------------------------------------------------- | -------------------------- | -------------------------- |
| rumbo arranca una interfaz registrada (`rumbo -f <name>`) | el descriptor de archivo 3 | el descriptor de archivo 4 |
| La interfaz arranca `rumbo serve`, como haría un editor   | el stdout del host         | el stdin del host          |

Una interfaz iniciada por rumbo conserva la terminal en stdin y stdout, así que puede dibujar y leer
teclas libremente. Cerrar la conexión termina el host: cancela las ejecuciones en curso, las registra
y detiene sus proveedores.

[Compara ambos sentidos de arranque en la traza interactiva.](/es/#run-trace)

## Su forma

1. **`initialize`**: el host habla primero, con el directorio, la sesión, el proveedor y el modelo a
   los que está conectada la interfaz, y la tarea dada en la línea de comandos, si la hay.
2. **`run`**: la interfaz envía una tarea. El host responde cuando la ejecución termina: hecha, fallida
   o cancelada.
3. Las notificaciones **`event`** informan de la ejecución mientras trabaja: el texto del modelo, las
   llamadas a herramientas y sus resultados, los tokens gastados y los diagnósticos.
4. **`steer`** le dice algo a una ejecución mientras trabaja, y **`cancel`** la detiene.

Una interfaz también puede preguntar al host qué ofrecen él y el proveedor (`describe`), llamar a sus
funciones (`invoke`), mostrar lo que tenía una sesión antes de abrirla (`history`) y recuperar lo que
la persona preguntó antes (`recall`).

## Un ejemplo completo

[examples/frontend.py](https://github.com/LiasCode/rumbo/blob/v0.9.0/examples/frontend.py) es una
interfaz entera en un archivo de Python: pide tareas con `input()` e imprime los eventos según llegan.

```python
def run(objective, request_id):
    """Send one objective and show events until the host answers the request."""
    send({"id": request_id, "method": "run", "params": {"objective": objective}})

    for line in from_host:
        frame = json.loads(line)

        if frame.get("method") == "event":
            show(frame["params"])
        elif frame.get("id") == request_id and "method" not in frame:
            if "error" in frame:
                print(frame["error"]["message"])
                return

            result = frame["result"]
            print(f"\n[{result['status']}] {result.get('error', '')}")
            return
```

Regístrala y úsala:

```sh
rumbo frontend add simple python3 /path/to/examples/frontend.py
rumbo -f simple
```

En Go, el paquete [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.9.0/protocol) tiene los tipos
y `DialFrontend`, una conexión ya hecha.

## Comandos sin conocerlos

Todo lo que una persona puede hacer aparte de dar una tarea, como cambiar de sesión, de modelo o de
ajustes, el host lo ofrece como funciones descritas, y lo mismo cada proveedor. Una interfaz construye
sus comandos, formularios y selectores a partir de esas descripciones, así que funciona con un
proveedor que nunca ha visto y gana una función nueva sin ningún cambio. Una función que no se puede
deshacer lo indica, para que la interfaz pregunte antes a la persona; una función de un proveedor
puede hacerle una pregunta a la persona, cuya respuesta puede ser secreta y entonces no debe mostrarse
ni guardarse.

Los [casos de uso](/es/reference/use-cases/#front-end) listan lo que una interfaz debe y puede hacer,
y el [protocolo](/es/reference/frontend-protocol/) especifica cada mensaje.
