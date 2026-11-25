---
title: Crear una extensión
description: Escribe una extensión de rumbo en cualquier lenguaje. Un programa que declara herramientas por stdin y stdout, responde a sus llamadas y puede añadir contexto, comandos, preguntas y oyentes.
---

Una extensión es un programa propio, en cualquier lenguaje, que habla el [Agent Extension Protocol](/es/reference/extension-protocol/) con el host de rumbo: JSON-RPC 2.0, un objeto por línea, por su stdin y su stdout. Escribe una para dar al modelo una herramienta que rumbo no tiene, para ponerte entre el modelo y una que sí tiene, o para saber qué hacen las ejecuciones.

## Su forma

1. **`initialize`**: el host habla primero. La extensión responde con la versión `1` del protocolo, su nombre y lo que declara: `tools`, `sections`, `functions` y `events`, todos opcionales.
2. **`call`**, una vez por cada uso de una de sus herramientas: el `name` de la herramienta, los `args` que dio el modelo, el `dir` donde trabaja la sesión y la `session`. La extensión responde con `text`, y con `is_error` cuando la llamada falló.
3. **`shutdown`**: la extensión responde y termina.

stdout solo lleva mensajes del protocolo. Los diagnósticos van a stderr, que llega a la persona.

## Un ejemplo completo

[examples/extension.py](https://github.com/LiasCode/rumbo/blob/v0.11.0/examples/extension.py) es una extensión entera en un archivo de Python. Guarda notas: una herramienta para recordar una, una sección que se las dice todas al modelo y un comando que las olvida. Así responde a una llamada:

```python
def call(params):
    """Run one tool. `args` is what the model gave; `dir` is where the session works."""
    if params["name"] == "remember":
        text = params["args"].get("text", "").strip()

        if not text:
            # A failed call says how to recover: the model reads it and tries again.
            return {"text": "text is empty; give the note to keep", "is_error": True}

        notes.append(text)

        return {"text": "kept"}

    return {"text": "there is no tool " + params["name"], "is_error": True}
```

Regístrala y mira lo que recibirá el modelo:

```sh
rumbo extension add notes python3 /path/to/examples/extension.py
rumbo extension show notes
```

```text
notes: python3 /path/to/examples/extension.py
configuration: {}
sections, told to the model when a run starts: notes
commands, in a front end: /notes-forget
tools, declared to the model in every request (161 bytes):
  remember  Keep a note for later in this rumbo.
```

En Go, el paquete [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.11.0/protocol) tiene los tipos y `ServeExtension`, un servidor ya hecho.

## Qué debe hacer una extensión

- Responder a `initialize` y a cada `call` a una herramienta que declaró.
- Nombrar sus herramientas con letras, dígitos, `_` y `-`, 64 como mucho, y dar a cada una un JSON Schema de sus argumentos.
- Mantener corta la descripción de cada herramienta. Se envía al modelo con cada petición.
- Indicar una llamada fallida con `is_error` y un texto que diga al modelo cómo recuperarse.
- Esperar llamadas de varias sesiones, y varias a la vez: rumbo mantiene un solo proceso de una extensión para todas.

## Qué puede hacer una extensión

- **Decirle algo al modelo cuando empieza una ejecución**, declarando `sections`. El host pide el texto de cada una; tiene 10 segundos para responder y se transmiten 8000 bytes como mucho.
- **Ofrecer comandos a la persona**, declarando `functions`. La interfaz de terminal llama a `forget`, de una extensión registrada como `notes`, como `/extensions notes forget`.
- **Listar los valores de un campo de su configuración**, con una función con el nombre del campo marcada `lists`. La interfaz de terminal completa el campo con ellos, como hace con `tools` en la extensión `mcp`.
- **Hablar con la persona** mientras trabaja una herramienta o un comando: `delta` dice algo y `ask` hace una pregunta, cuya respuesta puede marcarse como secreta.
- **Llamar a las herramientas de rumbo** mientras responde a una llamada, que es como una que sustituye a `bash` deja pasar lo que acepta. [examples/guard.py](https://github.com/LiasCode/rumbo/blob/v0.11.0/examples/guard.py) lo hace.
- **Enterarse de lo que hacen las ejecuciones**, declarando los `events` que quiere, como `ended`.
- **Avisar de que lo que declara cambió**, con `changed`, como cuando un inicio de sesión le da herramientas.

Una extensión no cambia ningún mensaje, ni la herramienta de otra extensión, ni cuándo termina una ejecución.

## Distribuirla

Un programa se añade con `rumbo extension add`. Para distribuirlo con skills, un proveedor o una interfaz, y que rumbo lo compile donde se instala, conviértelo en un [plugin](/es/reference/plugins/).

Los [casos de uso](/es/reference/use-cases/#extension) listan lo que una extensión debe y puede hacer, y el [protocolo](/es/reference/extension-protocol/) especifica cada mensaje.
