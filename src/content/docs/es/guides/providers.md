---
title: Modelos y proveedores
description: Usa rumbo con Claude mediante la API de Anthropic, las API de OpenAI, un plan de ChatGPT o un modelo local en Ollama, llama.cpp o vLLM, y registra un proveedor propio.
---

Un proveedor es la forma en que rumbo llega a un modelo. Es un programa aparte que habla el
[Agent Provider Protocol](/es/reference/provider-protocol/) con rumbo, y es dueño de la conexión con
el modelo y de sus credenciales. rumbo trae tres integrados, y puedes añadir cualquier otro.

```sh
rumbo provider list              # the providers there are, built in and yours
rumbo provider models <name>     # the models one offers
rumbo provider show <name>       # its settings, their values, and where each comes from
```

## Elegir el modelo

Una sesión nueva empieza con el proveedor por defecto y el modelo fijado para él. Una sesión conserva
el proveedor y el modelo que usa de un arranque al siguiente.

```sh
rumbo system set default_provider=anthropic          # the provider new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # the model they start with there
rumbo -p openai -m <model> "a task"                  # another one, for this session
```

En la interfaz de terminal, `/model <provider>/<model>` los cambia para la sesión, `/model` sin más
abre el selector que los lista, y `/providers` lista, muestra, configura, añade y quita proveedores.

## Anthropic

El proveedor `anthropic` llega a la API de Claude. Toma, por este orden, `ANTHROPIC_API_KEY`,
`ANTHROPIC_AUTH_TOKEN`, la clave que guardó su `/login` o el perfil de `ant auth login`.

```sh
export ANTHROPIC_API_KEY=...
rumbo -p anthropic
```

Lista los modelos que puede usar tu cuenta, ofrece una opción `effort` y conserva el razonamiento del
modelo para poder continuarlo.

> El proveedor integrado `anthropic` usa credenciales de API. No implementa el inicio de sesión con una suscripción de Claude.

## OpenAI

El proveedor `openai` llega a la Responses API de OpenAI con `OPENAI_API_KEY`, o con la clave que
guardó su `/login`. Sus modelos de razonamiento necesitan la Responses API para usar herramientas con
un nivel de esfuerzo. No se guarda nada en el servidor de OpenAI.

```sh
export OPENAI_API_KEY=...
rumbo -p openai
```

## Plan de ChatGPT

El proveedor `chatgpt` usa tu plan de ChatGPT en lugar de una clave de API, como OpenAI ofrece a las
aplicaciones de código abierto que corren donde estás tú.

```sh
rumbo -p chatgpt                           # then /login signs in with ChatGPT, and /model chatgpt/ lists the plan's models
rumbo provider set chatgpt model=<model>   # the one new sessions there start with
```

`/login` abre un inicio de sesión en el navegador, que vuelve a rumbo en esta máquina; desde otra
máquina, pega la dirección en la que termina el navegador. Su uso cuenta contra tu plan, que
gestionas en los ajustes de ChatGPT; su función `account` te dice dónde.

## Modelos locales y otros servidores

Cualquier servidor compatible con Chat Completions de OpenAI funciona mediante el programa `openai`,
incluidos los locales, como Ollama, el servidor de llama.cpp o vLLM. Regístralo con un nombre propio:

```sh
rumbo provider add -config '{"base_url":"http://localhost:11434/v1"}' local '{self}' provide openai
rumbo provider models local                                         # the models the server offers
rumbo provider set local model=qwen3-coder context_window=32768     # a server cannot say its context size
rumbo -p local "fix the failing test"                               # the session keeps its provider and model
```

`{self}` representa el propio ejecutable de rumbo. Un proveedor añadido así habla Chat Completions,
como la mayoría de los servidores, salvo que le pongas `api=responses`. La clave de API se lee de la
variable que nombra su configuración, `OPENAI_API_KEY` por defecto, o de lo que su `/login` guardó para
esa dirección.

## Iniciar sesión

Los proveedores integrados ofrecen tres funciones, que una interfaz ofrece como comandos. En la
interfaz de terminal, son del proveedor de la sesión:

| Comando                     | Hace                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`                    | `anthropic` y `openai` piden una clave de API, la comprueban con una petición que no cuesta nada y la guardan; `chatgpt` inicia sesión con ChatGPT |
| `/logout`                   | Olvidar la clave o el inicio de sesión                                                                                                             |
| `/providers <name> account` | Decir qué credencial se usa y de dónde viene, sin mostrarla                                                                                        |

Las claves se guardan en `~/.rumbo/credentials/`, legibles solo por ti. Un secreto que escribes
cuando un proveedor lo pregunta va solo al proveedor y no se registra en ningún sitio.

## Opciones

Cada proveedor dice qué opciones acepta. Los integrados ofrecen `effort`, cuánto piensa el modelo.
Fíjala para todas las sesiones de un proveedor o para una:

```sh
rumbo provider set anthropic effort=high   # every session that uses anthropic
rumbo -o effort=low "a quick task"          # this session only
rumbo provider set anthropic effort=        # back to the provider's default
```

En la interfaz de terminal, `/model effort=low` la fija para la sesión. Consulta
[configuración](/es/guides/configuration/) para ver cómo encajan los niveles.

## Un proveedor propio

Cualquier programa que responda a `initialize` y `complete` por su stdin y su stdout es un proveedor,
en cualquier lenguaje:

```sh
rumbo provider add mine /path/to/my-provider
rumbo -p mine -m some-model "..."
```

rumbo lo arranca al añadirlo, y esa es la prueba de que funciona. Consulta
[escribir un proveedor](/es/extend/provider/).
