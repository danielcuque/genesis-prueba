A continuación, se adjunta el video para DEMO de la aplicación:

[![DEMO]()]()


A continuación, se adjuntan las respuestas a las preguntas teóricas:

## 1. Bases de datos

**1.1 ¿Qué hace un left join?**
Un left join combina dos tablas, pero se asegura de incluir todas las filas de la tabla izquierda, incluso si no tienen una coincidencia en la tabla derecha. Si no hay coincidencia, los campos de la tabla derecha aparecerán como nulos.

**1.2 ¿Qué hace un inner join?**
Un inner join devuelve únicamente las filas que tienen una coincidencia exacta en ambas tablas que se están uniendo. Si una fila no tiene contraparte en la otra tabla, se excluye del resultado.

**1.3 ¿Cuál es la diferencia entre el cast y convert?**
Ambas funciones, CAST y CONVERT, se usan para cambiar un tipo de dato a otro. La principal diferencia es que CONVERT es específica de SQL Server y ofrece más flexibilidad para formatear fechas, mientras que CAST es un estándar ANSI-SQL más universal y compatible entre diferentes bases de datos.

**1.4 ¿Para qué sirve un índice?**
Un índice en una base de datos funciona de manera similar al índice de un libro, permitiendo al motor de la base de datos encontrar datos específicos mucho más rápido sin tener que escanear la tabla completa. Esto mejora drásticamente el rendimiento de las consultas.

**1.5 ¿Para qué sirve un Store Procedure?**
Un Stored Procedure (procedimiento almacenado) es un conjunto de instrucciones SQL guardado en la base de datos que se puede ejecutar con una sola llamada. Sirve para reutilizar lógica de negocio compleja, mejorar la seguridad y optimizar el rendimiento, ya que el plan de ejecución suele estar precompilado.

**1.6 ¿Cuál es la diferencia entre un índice Clusteriado y no clusteriado?**
La diferencia clave es cómo almacenan los datos. Un índice clusterizado ordena y almacena físicamente las filas de la tabla según la clave del índice, por lo que solo puede haber uno. Un índice no clusterizado es una estructura separada que apunta a las filas de datos, permitiendo tener múltiples.

**1.7 ¿Para qué sirve una tabla temporal y como se declara?**
Una tabla temporal sirve para almacenar resultados intermedios durante una sesión específica, siendo útil para descomponer consultas complejas. Se declara en SQL Server usando un prefijo de almohadilla simple, por ejemplo: `CREATE TABLE #MiTablaTemporal (...)`.

**1.8 ¿Para qué sirve una tabla doble temporal y como se declara?**
Una tabla temporal global, o "doble temporal", sirve para almacenar datos temporales que necesitan ser visibles para todas las sesiones y usuarios conectados a la base de datos. Se declara usando un prefijo de doble almohadilla: `CREATE TABLE ##MiTablaGlobal (...)`.

**1.9 ¿Para qué sirve la función set dateformat dmy?**
El comando `SET DATEFORMAT dmy` sirve para indicarle a SQL Server cómo debe interpretar las cadenas de texto que representan fechas. Específicamente, le dice que el formato de entrada será 'día/mes/año', lo cual es crucial para evitar errores al insertar o filtrar fechas.

**1.10 Escriba la sintaxis de un cursor:**
La sintaxis básica de un cursor implica declararlo con `DECLARE CURSOR FOR SELECT`, abrirlo con `OPEN`, recorrerlo fila por fila con `FETCH NEXT`, y finalmente cerrarlo y liberarlo de memoria con `CLOSE` y `DEALLOCATE`.

**1.11 ¿Diferencia entre un truncate table y un drop table?**
`TRUNCATE TABLE` elimina todas las filas de la tabla muy rápidamente, pero la estructura de la tabla (columnas, índices) permanece. `DROP TABLE`, por otro lado, elimina permanentemente la tabla completa de la base de datos, incluyendo su estructura y todos sus datos.

**1.12 ¿Indique una herramienta para ver el performance de un gestor de base de datos y que encontramos?**
Una herramienta común en SQL Server es el SQL Server Profiler o las Vistas de Gestión Dinámica (DMVs). En ellas encontramos información sobre las consultas que más recursos consumen (CPU, lecturas), planes de ejecución, esperas (wait stats) y bloqueos para identificar cuellos de botella.


## 2. Backend

**2.1 Explica cómo implementarías una estrategia de cacheo a nivel de aplicación...**
Para cachear en la aplicación sin servicios externos, usaría un diccionario o una tabla hash en memoria, como un `ConcurrentDictionary` en .NET, para almacenar pares de clave-valor. La clave sería un identificador de la consulta y el valor sería el resultado, implementando una política de expiración para invalidar datos y no agotar la memoria.

**2.2 Explica el concepto de versionado de APIs y cómo lo implementarías.**
El versionado de APIs es la práctica de gestionar cambios sin romper la compatibilidad con clientes antiguos. Lo implementaría incluyendo la versión en la URL (ej. `/api/v2/recurso`) o usando un encabezado HTTP personalizado (ej. `Accept: application/vnd.api.v2+json`).

**2.3 ¿Qué son los endpoints idempotentes y por qué son importantes?**
Un endpoint idempotente es aquel que puede ser llamado múltiples veces produciendo el mismo resultado que si se hubiera llamado una sola vez, como los métodos PUT o DELETE. Son importantes porque permiten a los clientes reintentar peticiones fallidas sin miedo a duplicar acciones.

**2.4 ¿Qué es la inyección SQL y cómo prevenirla?**
La inyección SQL es un ataque donde un atacante inserta código SQL malicioso en una consulta para manipular la base de datos. La mejor forma de prevenirla es nunca concatenar texto del usuario en las consultas, y en su lugar, usar siempre consultas parametrizadas u ORMs.

**2.5 Explica cómo implementar autenticación y autorización...**
Implementaría la autenticación (quién eres) usando tokens JWT. Las contraseñas se almacenarían de forma segura usando un hash fuerte con "salt", como bcrypt. La autorización (qué puedes hacer) la manejaría validando los roles o "claims" dentro del token en cada petición para proteger rutas específicas.

**2.6 ¿Cómo identificarías y resolverías un cuello de botella en una aplicación backend?**
Identificaría un cuello de botella usando herramientas de monitoreo (profiling) para analizar el uso de CPU, memoria y I/O. Una vez localizada la parte lenta, como una consulta de base de datos, la resolvería optimizando dicha consulta, añadiendo índices, implementando caché o escalando el servicio.

**2.7 Explica las diferencias entre concurrencia y paralelismo...**
La concurrencia es gestionar múltiples tareas que progresan de forma superpuesta en el tiempo, aunque no se ejecuten al mismo instante (como en un solo núcleo). El paralelismo es la ejecución simultánea de múltiples tareas, lo cual requiere múltiples núcleos de CPU.

**2.8 ¿Cómo manejarías la sincronización de hilos en un entorno multihilo...?**
Para evitar condiciones de carrera, usaría mecanismos de sincronización como `locks` (bloqueos), mutexes o semáforos. Esto asegura que solo un hilo pueda acceder a una sección crítica de código o a un recurso compartido a la vez, o bien usaría estructuras de datos concurrentes.

**2.9 ¿Cuáles son los problemas asociados con el uso de números de punto flotante en aplicaciones financieras?**
El problema de los números de punto flotante (float, double) en finanzas es la falta de precisión. No pueden representar exactamente ciertos valores decimales, como 0.1, lo que genera pequeños errores de redondeo que se acumulan. Es preferible usar tipos de dato `Decimal` o enteros que representen centavos.

**2.10 ¿Cómo afecta el uso excesivo de bloques try-catch y la implementación de recursión profunda...?**
El uso excesivo de try-catch puede degradar el rendimiento porque la gestión de excepciones consume recursos de CPU. Por otro lado, la recursión profunda consume mucha memoria RAM, ya que cada llamada añade un nuevo "stack frame" a la pila; si es demasiado profunda, puede causar un "stack overflow".

---

## 3. Desarrollo web y mobile

**3.1 ¿Cuáles son las principales diferencias entre el Renderizado del Lado del Servidor (SSR) y el Renderizado del Lado del Cliente (CSR)?**
El SSR genera el HTML completo en el servidor, lo que es bueno para el SEO y la carga inicial. El CSR envía un HTML mínimo y JavaScript, y es el navegador quien genera el contenido, lo que resulta en una aplicación más interactiva tipo SPA (Single Page Application) pero puede ser más lento al inicio.

**3.2 Explica qué es el Critical Rendering Path...**
El Critical Rendering Path es la secuencia de pasos que sigue el navegador para convertir el HTML, CSS y JavaScript en píxeles. Para optimizarlo, reduciría los recursos que bloquean el renderizado, minimizaría el CSS y JavaScript, y priorizaría la carga del contenido visible sin hacer scroll.

**3.3 Describe cómo implementarías un middleware personalizado en cualquier gestor de estados (Redux o Zustand)...**
Implementaría un middleware que intercepte acciones específicas antes de que lleguen al reducer. Este middleware podría realizar la llamada a la API y, dependiendo de la respuesta, despachar nuevas acciones de éxito o error, manteniendo la lógica asíncrona fuera de los componentes.

**3.4 Explica las diferencias entre REST y GraphQL...**
REST expone múltiples endpoints para diferentes recursos, lo que puede llevar a pedir datos de más o de menos. GraphQL usa un solo endpoint y permite al cliente solicitar exactamente los datos que necesita en una sola petición, evitando el "over-fetching" y "under-fetching".

**3.5 Explica los conceptos de Progressive Enhancement y Graceful Degradation...**
Progressive Enhancement consiste en construir una capa base funcional con HTML/CSS y luego añadir capas de funcionalidad avanzada (JavaScript) que mejoran la experiencia. Graceful Degradation es lo opuesto: se construye la aplicación completa y luego se añaden "fallbacks" para que no se rompa en navegadores antiguos.

**3.6 Explica la importancia de la accesibilidad en el desarrollo...**
La accesibilidad es crucial para que todos, incluyendo usuarios con discapacidades o dispositivos antiguos, puedan usar la aplicación. Las mejores prácticas incluyen usar HTML semántico, asegurar el contraste de color, proveer texto alternativo para imágenes y garantizar que todo sea accesible solo con el teclado.

**3.7 Describe las Core Web Vitals (LCP, FID y CLS)...**
Las Core Web Vitals miden la experiencia de usuario. Para optimizar el LCP (carga del contenido principal), comprimiría imágenes; para el FID (interactividad), reduciría el JavaScript que bloquea; y para el CLS (estabilidad visual), me aseguraría de que las imágenes tengan dimensiones definidas para evitar saltos en el layout.

**3.8 En el contexto de desarrollar un chat frontend... ¿qué tecnología utilizarías... WebSockets o Server-Sent Events (SSE)?**
Para un chat con un LLM, elegiría WebSockets porque permiten una comunicación bidireccional completa y en tiempo real. Esto es esencial para que el cliente pueda enviar mensajes al servidor y el servidor pueda devolver la respuesta en la misma conexión. SSE es solo unidireccional (servidor a cliente).

---

## 4. Inteligencia Artificial

**4.1 ¿Cuáles son los principales algoritmos de aprendizaje superficial (shallow learning)...?**
Los principales algoritmos incluyen la Regresión Lineal/Logística, Máquinas de Soporte Vectorial (SVM), Árboles de Decisión y K-Means. Usaría Regresión Lineal para predecir valores continuos, Regresión Logística o SVM para clasificación, y K-Means para agrupar datos no etiquetados.

**4.2 ¿Qué es la regresión lineal y cuándo la emplearías?**
La regresión lineal es un modelo que busca encontrar la mejor relación lineal (una línea recta) entre una variable dependiente y una o más variables independientes. La emplearía cuando necesito predecir un valor numérico continuo, como el precio de una casa o las ventas futuras.

**4.3 ¿Cómo funciona un árbol de decisión y cuál es la diferencia entre criterio Gini y entropía?**
Un árbol de decisión divide recursivamente los datos en subconjuntos más puros basados en preguntas sobre las características. Gini y la entropía son dos formas de medir esa "pureza" o "impureza"; ambos buscan minimizarla en cada división, siendo Gini ligeramente más rápido de calcular.

**4.4 ¿En qué se diferencian un SVM con kernel lineal y uno con kernel RBF?**
Un SVM con kernel lineal intenta separar las clases de datos usando una línea recta (o un hiperplano). Un SVM con kernel RBF es más flexible, ya que puede encontrar límites de decisión no lineales, transformando el espacio para separar datos que no son linealmente separables.

**4.5 ¿Qué efecto tiene limitar la profundidad de un árbol de decisión?**
Limitar la profundidad de un árbol de decisión es una técnica de regularización para prevenir el sobreajuste (overfitting). Un árbol muy profundo puede memorizar el ruido de los datos de entrenamiento, pero fallará al generalizar con datos nuevos; limitarlo lo hace más simple y robusto.

**4.6 ¿En qué se diferencian bagging y boosting...?**
Bagging (como Random Forest) entrena muchos modelos en paralelo sobre subconjuntos aleatorios de los datos y promedia sus resultados para reducir la varianza. Boosting (como XGBoost) entrena modelos secuencialmente, donde cada nuevo modelo se enfoca en corregir los errores del anterior, reduciendo el sesgo.

**4.7 ¿Cómo elegirías el número de clusters en K-Means usando el método del codo y la silueta?**
El método del codo grafica el error (inercia) frente al número de clusters (K), buscando el "codo" donde añadir más clusters ya no reduce mucho el error. El método de la silueta mide qué tan similar es un punto a su propio cluster comparado con otros, buscando el K que maximice este puntaje.

**4.8 Define la matriz de confusión y explica cómo se relacionan precisión, recall y la probabilidad posterior de Bayes.**
La matriz de confusión resume el rendimiento de un modelo mostrando verdaderos/falsos positivos y negativos. La precisión mide cuántos positivos predichos fueron correctos, y el recall cuántos positivos reales fueron encontrados. El Teorema de Bayes es el fundamento teórico que relaciona estas probabilidades condicionales.

**4.9 ¿En qué consiste un modelo generativo estocástico como Naive Bayes...?**
Naive Bayes es un modelo generativo porque modela la distribución de probabilidad de las características para cada clase, intentando "generar" los datos. Difiere de un enfoque discriminativo (como la regresión logística), que solo modela el límite de decisión entre las clases.

**4.10 ¿Cuál es el propósito de la regularización L1 vs L2...?**
Ambas regularizaciones (L1-Lasso y L2-Ridge) previenen el sobreajuste penalizando coeficientes grandes. La diferencia clave es que L1 puede forzar algunos coeficientes a ser exactamente cero, realizando así una selección de características, mientras que L2 solo los reduce.

**4.11 ¿Qué arquitecturas de redes (CNN, RNN, Transformer) se usan típicamente...?**
Las CNN (Redes Convolucionales) dominan en visión artificial porque detectan patrones espaciales. Las RNN (Redes Recurrentes) se usaban para secuencias (sonido, NLP), pero ahora los Transformers dominan el NLP gracias a su mecanismo de auto-atención que maneja mejor las dependencias a larga distancia.

**4.12 ¿Cuál es el propósito de una función de activación y por qué ReLU es tan popular?**
Una función de activación introduce no linealidad en una red neuronal, permitiéndole aprender relaciones complejas. ReLU es popular porque es computacionalmente muy simple (devuelve 0 o la entrada) y ayuda a mitigar el problema del "gradiente desvaneciente" durante el entrenamiento.

**4.13 ¿Cómo actúa el dropout para prevenir el sobreajuste en redes profundas?**
El dropout previene el sobreajuste "apagando" (ignorando) aleatoriamente un porcentaje de neuronas durante cada pasada de entrenamiento. Esto fuerza a la red a no depender excesivamente de unas pocas neuronas y a aprender representaciones más robustas.

**4.14 ¿En qué se diferencian las convoluciones 1D, 2D y 3D y sus aplicaciones típicas?**
Las Convoluciones 1D se usan en secuencias (series de tiempo, texto). Las 2D son estándar en visión para imágenes (alto y ancho). Las 3D se usan cuando la tercera dimensión también es espacial, como en videos (alto, ancho, tiempo) o imágenes médicas (vóxeles).

**4.15 Explica la atención escalada en Transformers y por qué su coste es $O(n^{2})$.**
La atención escalada permite a cada token en una secuencia (n) mirar y ponderar la importancia de todos los demás tokens en esa secuencia. Su costo es cuadrático, $O(n^{2})$, porque cada uno de los 'n' tokens debe calcular un puntaje de similitud (atención) con cada uno de los otros 'n' tokens.

**4.16 ¿Podrías explicar detalladamente cómo se estructuran... forward propagation y backpropagation...?**
La propagación hacia adelante (forward) es el proceso de pasar los datos de entrada a través de la red para generar una predicción y calcular el error. La propagación hacia atrás (backpropagation) usa el descenso de gradiente para calcular cómo cada peso en la red contribuyó a ese error y los ajusta ligeramente en la dirección correcta para reducirlo.

**4.17 ¿Qué es el descenso de gradiente y por qué es fundamental...?**
El descenso de gradiente es el algoritmo de optimización fundamental para entrenar redes. Calcula la derivada (gradiente) del error con respecto a los pesos de la red y "da un paso" en la dirección opuesta para minimizar el error iterativamente.

**4.18 ¿Qué papel juegan las operaciones de convolución en los modelos de visión... y AWS Rekognition?**
Las convoluciones actúan como detectores de características (bordes, texturas) que son invariantes a la posición. Los Vision Transformers (ViT) son un enfoque moderno que usa atención en "parches" de la imagen. Servicios como AWS Rekognition son buenos para tareas genéricas rápidas, pero los modelos personalizados ofrecen más control.

**4.19 ¿Qué técnicas ofrece OpenCV para mejorar imágenes degradadas...?**
OpenCV ofrece técnicas clásicas como el suavizado (blurring) Gaussiano o de mediana para reducir el ruido, y la ecualización del histograma para mejorar el contraste en baja iluminación. Estos métodos son rápidos, pero los enfoques basados en redes neuronales suelen dar mejores resultados.

**4.20 ¿Qué es la calibración de cámara en OpenCV...?**
La calibración de cámara en OpenCV es crucial para corregir las distorsiones de la lente (como la de barril) y obtener los parámetros intrínsecos de la cámara. Se realiza usando un patrón conocido, como un tablero de ajedrez, y es esencial para la reconstrucción 3D y la visión estereoscópica.

**4.21 ¿Cómo se puede utilizar visión por computador para estimar el estilo artístico de una imagen...?**
La "style transfer" usa redes como VGG, donde la "Gram Matrix" captura las correlaciones de características (texturas, patrones) que definen un estilo. Esto permite separar el estilo del contenido y aplicarlo a otra imagen, aunque los enfoos modernos buscan hacerlo más rápido y realista.

**4.22 ¿Qué retos presenta la implementación de visión por computador en dispositivos móviles...?**
Los retos principales en dispositivos embarcados (móviles, Raspberry Pi) son los recursos limitados de CPU, GPU y RAM. Para optimizar OpenCV, se debe reducir la resolución de la imagen, usar modelos cuantizados (más ligeros) y emplear aceleración por hardware si está disponible.

**4.23 ¿Cómo influye el diseño de prompts (zero-shot, few-shot, chain-of-thought, tool-aware)...?**
El diseño de prompts influye enormemente en el LLM. "Zero-shot" es dar la tarea directamente, "few-shot" es darle ejemplos. "Chain-of-thought" (CoT) le pide "pensar paso a paso", mejorando el razonamiento. "Tool-aware" le indica que puede usar herramientas externas (APIs), lo cual es clave para la planificación.

**4.24 ¿Qué define a un "agente" en el contexto de la IA...?**
Un modelo de ML es una herramienta pasiva que hace predicciones. Un agente de IA es un sistema activo que usa uno o más modelos para percibir su entorno, tomar decisiones, planificar y ejecutar acciones (como usar herramientas) para lograr un objetivo.

**4.25 ¿Qué impacto tiene el uso de etiquetas XML en los prompts...?**
El uso de etiquetas XML (como `<contexto>` o `<instruccion>`) en los prompts ayuda a estructurar la entrada para el LLM. Esto permite al modelo diferenciar mejor entre distintos tipos de información, como instrucciones, datos y ejemplos, mejorando la fiabilidad de la respuesta.

**4.26 Diseña un prompt largo "sandwich" (goal-persona-context-goal)...**
Un prompt "sandwich" pone el objetivo al inicio y al final. (Goal) "Genera un plan de proyecto." (Persona) "Actúa como un Project Manager senior." (Context) "El proyecto es una app de e-commerce..." (Goal) "Asegúrate de incluir hitos, riesgos y un cronograma detallado."

**4.27 ¿Cómo implementaría la autenticación y el control de acceso en un servidor MCP...?**
En un servidor MCP (Model Context Protocol), se usarían mecanismos estándar como tokens de API, OAuth 2.0 o claves HMAC. El control de acceso se manejaría validando estos tokens en cada solicitud para asegurar que el solicitante tenga permisos para acceder o modificar el contexto.

**4.28 ¿Qué técnicas de razonamiento puedes incorporar en un agente para que... justifique sus decisiones...?**
Para que un agente justifique sus decisiones, se usa Chain-of-Thought (CoT), donde el agente "piensa en voz alta" su proceso paso a paso. Técnicas más avanzadas como Tree-of-Thought (ToT) le permiten explorar y justificar múltiples líneas de razonamiento antes de elegir la mejor.

**4.29 ¿Cuáles son los componentes básicos de un agente...?**
Los componentes básicos de un agente son su perfil (rol o persona), la memoria (para recordar interacciones), las herramientas (APIs que puede usar), el razonamiento (el LLM que toma decisiones), la planificación (descomponer tareas) y la evaluación (autoevaluar su rendimiento).

**4.30 ¿Cómo funciona la arquitectura de un agente autónomo frente a un agente asistente...?**
Un agente asistente reacciona a las peticiones del usuario (ej. resumir un email). Un agente autónomo tiene un objetivo a largo plazo y la capacidad de operar de forma proactiva, tomando decisiones y ejecutando tareas por sí mismo sin intervención humana constante para lograr ese objetivo.

**4.31 ¿Cómo diseñarías un sistema multiagente...?**
Diseñaría un sistema multiagente usando una arquitectura de "orquestador". Un agente principal recibiría la tarea, la descompondría y la asignaría a agentes especializados (ej. agente de búsqueda, agente de análisis) que se comunican mediante un bus de mensajes o llamadas a funciones.

**4.32 ¿Qué patrones de coordinación (broadcast, pipeline, blackboard) existen entre agentes...?**
Broadcast es cuando un agente envía un mensaje a todos (para alertas). Pipeline es cuando la salida de un agente es la entrada del siguiente (para procesos secuenciales). Blackboard es un espacio de memoria compartida donde los agentes leen y escriben información (para colaboración compleja).

**4.33 ¿Cómo integras feedback humano en bucles de control...?**
El feedback humano (correcciones o calificaciones) se integra en un bucle donde las decisiones del agente son revisadas por una persona. Este feedback se usa luego para re-entrenar o ajustar el modelo de política del agente, mejorando sus decisiones futuras (a veces llamado RLHF).

**4.34 ¿Cómo evalúas el rendimiento y la efectividad de un sistema multi-agente...?**
Se evalúa definiendo KPIs claros, como el tiempo de resolución de la tarea, el costo computacional y la tasa de éxito. La trazabilidad es clave, por lo que se deben registrar todas las decisiones y comunicaciones entre agentes para poder auditar y depurar el proceso.

**4.35 (Pregunta incompleta)**
La pregunta 4.34 del documento original, referente al diseño de un sistema de IA para emergencias, está incompleta y se corta antes de presentar las opciones a decidir.

**4.36 ¿Qué papel juegan los "agentic behavior trees" o los "policy planners"...?**
Los "behavior trees" (árboles de comportamiento) son útiles para definir comportamientos complejos pero predecibles de forma jerárquica y modular. Los "policy planners" (planificadores de políticas), a menudo basados en LLM, son más flexibles y pueden generar planes para alcanzar objetivos adaptándose a situaciones novedosas.

**4.37 ¿Qué criterios considerarías al elegir un framework para construir un sistema de agentes...?**
Al elegir un framework (como LangGraph, Pipecat, etc.), consideraría la facilidad de uso, la capacidad de manejar flujos de estado complejos (grafos), la integración con herramientas y LLMs, y el soporte para multiagen, dependiendo de si necesito flujos cíclicos o agentes más simples.

**4.38 ¿Qué ventajas ofrece el uso de structured outputs (por ejemplo, respuesta en JSON)...?**
Las salidas estructuradas (JSON) son cruciales para la interacción entre agentes o herramientas porque proporcionan una respuesta predecible y fácil de "parsear". Esto elimina la fragilidad de intentar extraer información de un texto en lenguaje natural y hace las llamadas a APIs fiables.

**4.39 ¿Cómo implementarías un agente basado en modelos de lenguaje (LLM) que mejore... mediante aprendizaje por refuerzo...?**
Para implementar un agente con aprendizaje por refuerzo (RL), se define una política (el LLM) y una función de recompensa. El agente genera "trayectorias" (secuencias de acción) y el sistema de recompensas le da un puntaje, el cual se usa para actualizar el modelo y mejorar sus elecciones futuras.

**4.40 ¿Cómo garantizarías la reproducibilidad y auditabilidad de las decisiones de un agente...?**
Para garantizar la reproducibilidad, registraría (logging) absolutamente cada interacción del agente con APIs y herramientas, incluyendo las entradas, las salidas exactas, las marcas de tiempo y el contexto o estado interno del agente en ese momento.

**4.41 ¿Qué es un tokenizer en un LLM...?**
Un tokenizer es la herramienta que divide el texto en las unidades mínimas que el LLM procesa, llamadas tokens. Es importante entenderlo porque afecta cómo el modelo interpreta la entrada, los límites de longitud del contexto y el costo computacional de la solicitud.

**4.42 ¿Qué estrategias puedes usar para reducir el número de tokens en un agente...?**
Para reducir tokens sin perder semántica, se pueden usar técnicas como resumir o condensar el texto, eliminar palabras de relleno (stopwords) o redundantes, usar sinónimos más cortos, o simplificar frases complejas manteniendo la idea central.

**4.43 ¿Cuáles son los beneficios de incorporar un sistema de memoria persistente en agentes...?**
La memoria persistente permite a los agentes mantener el contexto a través de múltiples sesiones, personalizar respuestas basándose en interacciones pasadas y adaptarse a nueva información. Los desafíos incluyen manejar datos que cambian (dinámicos) y gestionar la memoria de múltiples sesiones.

**4.44 Qué ventajas aporta el Model Context Protocol (MCP) frente a integraciones con function calling...?**
El Model Context Protocol (MCP) ofrece una forma más estandarizada y robusta para que los LLMs interactúen con herramientas externas. Permite una interacción más rica, gestionando el contexto y el estado de las herramientas, mientras que el "function calling" suele ser una solicitud de API más simple y directa.

**4.45 ¿Cómo diseñarías un agente que lea documentos, extraiga imágenes relevantes...?**
Diseñaría un agente que primero use una herramienta de OCR o extracción de texto. Paralelamente, usaría otra herramienta para extraer todas las imágenes. Luego, el agente (LLM) analizaría el texto circundante a cada referencia de imagen para generar el contexto textual, devolviendo los nombres de archivo y sus descripciones.

**4.46 ¿Qué técnicas de caching y persistencia usarías para evitar reprocesar archivos ya vectorizados...?**
Implementaría un sistema de caching donde se genera un hash (firma única) del contenido del archivo. Antes de procesar un archivo, revisaría en una base de datos si ese hash ya existe; si existe, recupero los vectores cacheados, y si no, los proceso y los guardo asociados a ese hash.

**4.47 ¿Cómo estructurarías y almacenarías documentos para ser usados en un sistema RAG?**
Para un sistema RAG (Retrieval-Augmented Generation), los documentos deben ser divididos (chunking) en fragmentos más pequeños y semánticamente coherentes. Cada fragmento se vectoriza y se almacena en una base de datos vectorial junto con sus metadatos (como la fuente) para una recuperación eficiente.

**4.48 ¿Cómo combinarías búsqueda semántica con clasificación o reranking para mejorar resultados de RAG?**
Primero, realizaría una búsqueda semántica (vectorial) para recuperar un conjunto amplio de resultados relevantes (ej. los 100 mejores). Luego, un modelo de "reranking" (más pequeño y especializado) re-evaluaría solo esos 100 resultados basándose en la consulta original, ordenándolos de forma más precisa.

**4.49 ¿Qué es un Deep Research Agent?**
Un Deep Research Agent es un tipo de agente especializado en realizar búsquedas exhaustivas y profundas sobre un tema. A diferencia de una búsqueda simple, este agente puede navegar por múltiples fuentes, resumir información, seguir enlaces y agregar hallazgos de manera iterativa.

**4.50 ¿Qué es un Computer Use Agent?**
Un Computer Use Agent (agente de uso de computadora) es un agente diseñado para interactuar directamente con la interfaz gráfica de un sistema operativo. A diferencia de agentes que usan APIs, este puede "ver" la pantalla, mover el mouse y "escribir" en aplicaciones, automatizando tareas como un humano.

**4.51 ¿Qué ventajas le ves a utilizar una librería como Instructor...?**
Usar una librería como Instructor, en lugar de llamadas directas a un LLM que devuelve JSON, ofrece la ventaja de la validación y el "parseo" automático a estructuras de datos nativas (como clases Pydantic). Esto reduce el código de validación y asegura que la salida del LLM se ajuste al esquema esperado.

**4.52 Explica qué es computación evolutiva**
La computación evolutiva es un campo de la IA inspirado en la evolución biológica. Utiliza conceptos como la selección natural, la mutación y el cruce para encontrar soluciones óptimas a problemas complejos, "evolucionando" una población de posibles soluciones a lo largo de varias generaciones.