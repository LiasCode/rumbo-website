---
title: Escribir un proveedor
description: Conecta rumbo con cualquier modelo escribiendo un proveedor, un programa en cualquier lenguaje que responde peticiones JSON-RPC por stdin y stdout con el Agent Provider Protocol.
---

Un proveedor convierte una conversación en el siguiente mensaje del asistente. Es un programa propio,
en cualquier lenguaje, que habla el [Agent Provider Protocol](/es/reference/provider-protocol/) por su
stdin y su stdout. Los proveedores integrados de rumbo se sirven igual, así que el tuyo no tiene nada
menos.

Escribe uno para llegar a una API de modelos que rumbo no conoce, a una pasarela de tu empresa, o para
tener un doble de pruebas que responda desde un guion.

## Su forma

Los mensajes son objetos JSON-RPC 2.0, uno por línea. rumbo arranca el proveedor como un proceso hijo
y le envía:

1. **`initialize`**: el proveedor responde con la versión `1` del protocolo, su nombre y su
   configuración en vigor, y puede describir sus modelos, sus opciones y sus funciones.
2. **`complete`**, una vez por turno: toda la conversación, las herramientas y las opciones. El
   proveedor responde con el siguiente mensaje del asistente, por qué se detuvo (terminó, llama a
   herramientas, lo cortó el límite de salida o el modelo se negó) y los tokens que usó. Mientras
   trabaja, puede ir enviando texto en notificaciones `delta`.
3. **`shutdown`**: el proveedor responde y termina.

stdout lleva solo mensajes del protocolo. Los diagnósticos van a stderr, que llega a la persona.

## Un ejemplo completo

[examples/provider.py](https://github.com/LiasCode/rumbo/blob/main/examples/provider.py) es un
proveedor entero en un archivo de Python, sin ningún modelo detrás: pide una llamada a una herramienta
y luego repite su salida. Este es su bucle:

```python
for line in sys.stdin:
    frame = json.loads(line)
    method = frame.get("method")

    if method == "initialize":
        config = frame["params"].get("config") or {}
        functions = [{"name": "greet", "description": "Ask your name, and greet you"}]
        send({"id": frame["id"], "result": {"protocol": 1, "name": "toy", "config": config, "functions": functions}})

    elif method == "complete":
        result = answer(frame["id"], frame["params"])
        result["usage"] = {"input": 0, "output": 0}
        send({"id": frame["id"], "result": result})

    elif method == "invoke":
        send({"id": frame["id"], **greet(frame["id"])})

    elif method == "shutdown":
        send({"id": frame["id"], "result": {}})
        break
```

Sustituye `answer` por una llamada a tu modelo y será un proveedor real. Regístralo y úsalo:

```sh
rumbo provider add toy python3 /path/to/examples/provider.py
rumbo -p toy -m any "list the files"
```

rumbo arranca un proveedor al añadirlo, y esa es la prueba de que funciona. En Go, el paquete
[`protocol`](https://github.com/LiasCode/rumbo/tree/main/protocol) tiene los tipos y `Serve`, un
servidor ya hecho.

## Lo que un proveedor debe hacer

- Responder a una petición cada vez. Cuando rumbo necesita más a la vez, arranca más procesos, así que
  un proveedor no debe depender de nada más que de la petición que está respondiendo.
- Marcar como transitorio un fallo que puede salir bien si se vuelve a enviar la petición, como un
  límite de uso, y como tal una petición que no cupo en el contexto del modelo. rumbo reintenta lo
  primero y compacta en lo segundo.
- Responder en pocos segundos a una petición que se le pidió cancelar.
- Guardar sus propias credenciales. rumbo no guarda ninguna.
- Ignorar los bloques opacos que no reconoce, que es lo que permite que una sesión cambie de
  proveedor.

## Lo que un proveedor puede hacer

- **Describirse**: cómo se elige su modelo, las opciones que acepta con sus valores por defecto y las
  funciones que ofrece. Cualquier interfaz las muestra como ajustes y comandos sin conocerlas.
- **Ofrecer funciones**, como listar sus modelos o iniciar sesión, que pueden hablar con la persona
  mientras trabajan: decir cosas y hacer preguntas, marcando una respuesta como secreta cuando lo es.
- **Guardar lo que necesita** para continuar una conversación, como el razonamiento firmado, en
  bloques opacos que rumbo guarda y devuelve sin cambios.
- **Informar del tamaño del contexto del modelo**, para que rumbo resuma la conversación antes de que
  se llene, y **de cuánto leyó de su caché**, para que rumbo te avise cuando una petición no la
  aprovechó.
- **Mostrar al modelo las imágenes** del resultado de una herramienta.

Los [casos de uso](/es/reference/use-cases/#provider) lo listan todo, y el
[protocolo](/es/reference/provider-protocol/) especifica cada mensaje.
