---
title: Diseño
description: Por qué rumbo está hecho como está. Un historial que solo crece y se puede reproducir, un prefijo estable para la caché del proveedor, piezas reemplazables y lo que el arnés deja fuera a propósito.
---

rumbo es pequeño a propósito. Cada herramienta y cada línea del prompt de sistema se paga en tokens en
cada petición, en cada tarea, la ayude o no. Así que una herramienta, un ajuste o un campo del
protocolo nuevo tiene que compensar lo que cuesta, y casi todo lo que añaden otros arneses, rumbo lo
deja a la shell, a la tarea y a tus instrucciones.

## En qué se apoya el diseño

**El historial solo crece.** Una sesión es una lista de entradas que nunca se editan ni se borran.
Cambiar de rumbo crea una [rama](/es/guides/sessions/#ramificar), una sesión nueva que empieza con una
copia de las entradas, así que la sesión de la que vienes queda como estaba.

**La petición es una función pura de las entradas.** Una sola pieza de código convierte una sesión en
la petición que se envía al modelo, y no se añade nada por el camino. Por eso una sesión guardada
reproduce exactamente cada petición, `rumbo request` imprime cualquiera de ellas y una ejecución que
murió se reanuda desde lo que quedó registrado.

**El prefijo es estable.** El prompt de sistema es constante, las declaraciones de herramientas son
deterministas y el contexto se envía una vez y después solo cuando cambia. Cada petición amplía la
anterior, así que el proveedor lee su comienzo de su caché. rumbo comprueba que así sea y te avisa
cuando una petición no aprovechó la caché, porque el resto se vuelve a pagar.

**Un contexto lleno se compacta, no se recorta.** Cerca del límite del modelo, el modelo resume la
conversación y la siguiente petición empieza desde ese resumen. Un resumen escrito con ese fin conserva
el trabajo mejor que cortar turnos antiguos, que las API de modelos suelen rechazar.

**Las piezas se encuentran en protocolos.** Los proveedores y las interfaces son programas aparte que
hablan JSON-RPC con el host, como hacen los editores y los lenguajes mediante el Language Server
Protocol. Los integrados cruzan los mismos protocolos que los tuyos, y los protocolos solo crecen: lo
que se añade es opcional.

**Todo lo que guarda rumbo es un archivo que puedes leer.** Lo que elegiste, en un único
`config.yaml` sin valores por defecto, y cada sesión en un directorio propio.

## Lo que el arnés no es

Esto son decisiones, no carencias:

- **No sabe de ningún tipo de trabajo.** Nada en rumbo trata de programación ni de ningún otro campo:
  ni detección de proyectos, ni comportamiento específico de un lenguaje. Lo que necesita una tarea
  sale de ti y de tus [instrucciones](/es/guides/instructions-and-skills/).
- **No juzga el trabajo del modelo.** Una ejecución termina cuando el modelo deja de llamar
  herramientas. rumbo no hace comprobaciones ni manda al modelo de vuelta por nada; comprobar el
  trabajo es parte de la tarea, y tus instrucciones dicen cómo. Medidas sobre el conjunto de
  evaluación de rumbo, las comprobaciones nunca cambiaron un resultado y costaban mucha maquinaria.
- **No envía contexto que nadie pidió**, aparte del entorno, tus instrucciones y para qué sirve cada
  una de tus skills. El modelo mira el proyecto, y lee una skill, con sus herramientas cuando lo
  necesita.
- **No tiene sistema de permisos.** El agente actúa con los permisos del usuario que lo inició. Quien
  necesite límites ejecuta rumbo dentro de un sandbox de su elección. Consulta
  [antes de ejecutarlo](/es/start/safety/).
- **Inicia sesión en un plan solo donde un proveedor lo implementa.** `chatgpt` inicia sesión con un
  plan de ChatGPT. `anthropic` usa credenciales de API y no tiene inicio de sesión por suscripción.
  Cualquier otra forma de entrar es un proveedor propio, que se añade como cualquier otro.
- **No rastrea archivos.** Una sesión guarda la conversación, no el disco: no hay puntos de
  restauración, y una rama empieza desde un punto anterior de la conversación con los archivos tal como
  están.

## Medido, no supuesto

Un cambio en el bucle, el prompt de sistema, las herramientas o el contexto cambia cómo se comporta el
modelo, y los tests no pueden mostrarlo. Esos cambios se miden con un conjunto de evaluación, antes y
después, comparando la tasa de éxito, los turnos y los tokens. Los tests nunca llaman a un modelo real.

## Para seguir leyendo

- [Arquitectura](/es/reference/architecture/): las piezas y cómo encajan.
- [Casos de uso](/es/reference/use-cases/): lo que cada pieza debe, puede y no debe hacer.
- [Glosario](/es/reference/glossary/): los términos y lo que significa cada uno.
