# Plan Maestro — Observatorio Colombiano del Mercado Laboral Tecnológico

## 1. Propósito del proyecto

Construir una plataforma pública, gratuita y simple que permita observar cómo evoluciona en el tiempo la demanda laboral tecnológica en Colombia, utilizando como fuente principal las ofertas promocionadas de LinkedIn Job Library.

El objetivo central es responder rápidamente preguntas como:

- ¿Está creciendo o disminuyendo el mercado de React?
- ¿Python está creciendo más rápido que JavaScript?
- ¿Hay más demanda por Java + Spring que por Node + React?
- ¿Está creciendo AI Engineering en Colombia?
- ¿Qué ocurre con RAG, agentes, LangChain o LLM Engineering?
- ¿Frontend puro está perdiendo espacio frente a Full Stack?
- ¿Qué combinación tecnológica tiene mejor tendencia?
- ¿Qué tecnologías están consultando más los propios visitantes del observatorio?

El proyecto debe permitir tomar decisiones profesionales basadas en datos y no únicamente en percepciones derivadas de las vacantes vistas ocasionalmente.

---

## 2. Principios del proyecto

### Simplicidad

No construir funcionalidades que no ayuden a analizar el mercado.

### Datos primero

La prioridad es conseguir una fuente estable, histórica y correctamente normalizada antes de construir un dashboard sofisticado.

### Costo cero

El proyecto debe poder permanecer públicamente disponible sin costo fijo mensual.

### Utilidad inmediata

Una persona debe entender el estado del mercado tecnológico colombiano en pocos segundos.

### Comparabilidad

La plataforma debe permitir comparar hasta tres tecnologías, roles o combinaciones simultáneamente.

### Histórico

No queremos empezar a recoger información desde cero. Debemos reconstruir tanto histórico como permita LinkedIn Job Library.

### Plataforma pública

No se requiere registro ni login para utilizarla.

### Portafolio profesional

La plataforma también funcionará como demostración pública del trabajo de Andrés Alba como Senior Full-Stack & AI Engineer.

---

## 3. Fuente principal de datos

### LinkedIn Job Library

La fuente inicial será LinkedIn Job Library.

Job Library permite consultar ofertas promocionadas por:

- palabra clave;
- país;
- empresa;
- rango de fechas.

Conserva información histórica de publicaciones y permite identificar durante qué período una oferta estuvo abierta.

Importante:

El observatorio NO afirmará medir todas las ofertas laborales de Colombia.

Medirá una muestra consistente:

**LinkedIn Promoted Jobs — Colombia**

Esto debe aparecer claramente explicado dentro de la plataforma.

Nuestro objetivo es estudiar tendencias y proporciones, no afirmar que conocemos el número absoluto de empleos existentes.

---

## 4. Acceso a LinkedIn Job Library

La primera prueba técnica del proyecto será:

**Maton → LinkedIn Job Library → Colombia**

Antes de construir frontend, backend o base de datos debemos demostrar que esta cadena funciona.

Prueba mínima:

Buscar una palabra genérica como:

Software

Después:

Software + Colombia.

Después:

React + Colombia.

Finalmente:

React + Colombia + rango histórico de 2026.

También debemos comprobar:

- paginación;
- cantidad máxima por consulta;
- campos devueltos;
- fechas;
- descripción;
- título;
- empresa;
- ubicación;
- identificador de la vacante;
- URL;
- posibles duplicados.

Si Maton permite obtener esos datos de forma estable, continuamos con esta arquitectura.

Si Maton no permite el acceso, detenemos el desarrollo del dashboard y buscamos una fuente oficial o autorizada alternativa.

No construiremos scraping directo de LinkedIn.

---

## 5. Unidad fundamental del sistema

La unidad del observatorio será la **vacante individual**.

No almacenaremos únicamente cosas como:

React = 500  
Python = 650

porque eso limitaría las futuras preguntas.

Guardaremos cada oferta de empleo individualmente.

Una vacante podría incluir:

- LinkedIn Job ID
- título
- empresa
- ubicación
- país
- descripción
- URL
- fecha de publicación
- fecha de cierre, si existe
- primera vez detectada
- última vez detectada
- seniority
- modalidad
- tecnologías
- roles/categorías

Esto permite recalcular estadísticas cuando queramos.

---

## 6. Clasificación tecnológica

Cada oferta podrá estar asociada a múltiples tecnologías.

Ejemplo:

Senior Full Stack AI Engineer

Podría pertenecer a:

- JavaScript
- TypeScript
- React
- Node.js
- Python
- RAG
- LangChain
- AI Engineering
- Full Stack

Esto es fundamental.

No crearemos bases separadas para Java, React, Python, etc.

Tendremos:

**Una base maestra de vacantes.**

Y relaciones entre una vacante y múltiples tecnologías.

---

## 7. Taxonomía inicial

### Lenguajes

- JavaScript
- TypeScript
- Python
- Java
- C#
- Go
- Rust

Se podrán añadir otros posteriormente.

### Frontend

- React
- Next.js
- Angular
- Vue
- Vite

### Backend

- Node.js
- Express
- FastAPI
- Django
- Flask
- Spring
- .NET

### Inteligencia artificial

- AI Engineer
- Applied AI
- Generative AI
- LLM
- RAG
- Agents
- Agentic AI
- LangChain
- LangGraph
- embeddings
- vector databases
- evaluation/evals
- prompt engineering
- AI orchestration

### Roles

- Frontend
- Backend
- Full Stack
- Software Engineer
- Product Engineer
- AI Engineer
- LLM Engineer
- Agent Engineer

La taxonomía debe ser extensible.

---

## 8. Combinaciones

El observatorio debe permitir consultar tecnologías individuales o combinaciones.

Ejemplos:

React

Python

Java

Pero también:

React + Node

Java + Spring

Python + FastAPI

React + AI

Node + AI

Python + RAG

React + Node + AI

Una combinación representa ofertas que contienen simultáneamente todos sus elementos.

Esto será especialmente útil para evaluar perfiles profesionales completos.

---

## 9. Comparador principal

El usuario podrá seleccionar hasta tres series simultáneamente.

Ejemplos:

React vs Angular vs Vue

JavaScript vs Python vs Java

Frontend vs Full Stack vs AI Engineer

React + Node vs Python + FastAPI vs Java + Spring

React + Node + AI vs Python + AI vs Java + AI

No permitiremos más de tres series inicialmente porque la gráfica perdería claridad.

---

## 10. Métricas temporales

Existirán al menos dos métricas fundamentales.

### Vacantes nuevas

Número de ofertas cuya publicación comienza en determinada fecha.

Esto permite medir movimiento y contratación reciente.

### Vacantes activas

Número de ofertas que estaban abiertas en determinada fecha.

Esto permite estimar el tamaño observable del mercado.

Posteriormente podremos añadir:

- promedio móvil 7 días;
- promedio móvil 30 días;
- cambio porcentual 30 días;
- cambio porcentual 90 días;
- momentum.

---

## 11. Histórico

La primera carga intentará reconstruir todo el histórico disponible de Colombia.

Idealmente tendremos:

enero de 2026 → actualidad

y posteriormente continuaremos acumulando información.

Debido a que Job Library conserva ofertas cerradas durante un período limitado, debemos realizar el backfill inicial tan pronto como sea posible.

---

## 12. Dashboard principal

La pantalla debe ser extremadamente simple.

### Header

Nombre provisional:

**Colombia Tech Job Market**

Debajo:

**LinkedIn Promoted Jobs Market Intelligence**

### Selector de período

- 7 días
- 30 días
- 90 días
- 6 meses
- 1 año

### Selector de métrica

- Nuevas
- Activas

### Selector de series

Serie 1

Serie 2

Serie 3

Cada serie puede ser:

- una tecnología;
- un rol;
- una combinación.

### Gráfica principal

Una línea temporal con máximo tres curvas.

Eje X:

tiempo.

Eje Y:

cantidad de vacantes.

---

## 13. Indicadores resumidos

Debajo de la gráfica aparecerá una tarjeta por serie.

Ejemplo conceptual:

React + Node

328 vacantes activas

+8,4% últimos 30 días

Esto permite entender rápidamente la tendencia sin analizar toda la gráfica.

---

## 14. Indicadores futuros

Podremos añadir posteriormente:

### Job Demand Index

Qué tan frecuente es una tecnología dentro de las ofertas.

### Momentum

Cuánto está creciendo o disminuyendo.

### Visitor Interest Index

Qué tanto consultan esa tecnología los visitantes.

Esto permitirá combinar:

**demanda laboral**

con

**interés del mercado.**

---

## 15. Analítica propia del observatorio

El proyecto tendrá su propia capa de analytics.

No solamente queremos saber qué dice LinkedIn.

También queremos saber qué quieren conocer quienes utilizan nuestra plataforma.

Registraremos eventos anónimos como:

- comparación realizada;
- tecnología seleccionada;
- combinación seleccionada;
- período seleccionado;
- categoría seleccionada;
- clic en LinkedIn del creador;
- clic en GitHub;
- clic en contacto.

No necesitamos identificar personalmente al visitante para registrar estos eventos.

---

## 16. Doble inteligencia de mercado

El sistema terminará teniendo dos conjuntos de señales.

### Señal 1 — Mercado laboral

Qué tecnologías están apareciendo en las vacantes.

Ejemplo:

Java = alta demanda.

React = alta demanda.

RAG = pequeña pero creciente.

### Señal 2 — Interés de usuarios

Qué están consultando los visitantes.

Ejemplo:

Python + AI = comparación más consultada.

React + AI = segunda.

Java + Spring = tercera.

Esto podría producir información única sobre el mercado tecnológico colombiano.

---

## 17. Analytics general

Utilizaremos Cloudflare Web Analytics para estadísticas generales.

Queremos conocer:

- visitantes;
- visitas;
- evolución temporal;
- país;
- dispositivo;
- origen del tráfico.

Para comportamiento específico del producto utilizaremos nuestros propios eventos.

---

## 18. Contacto voluntario

El dashboard no obligará a nadie a identificarse.

Eso reduciría el uso.

Habrá una opción discreta:

**¿Eres recruiter, hiring manager, empresa o desarrollador? Déjanos saber quién eres.**

Formulario:

- nombre;
- empresa, opcional;
- cargo;
- email;
- teléfono, opcional;
- país;
- comentario, opcional.

El formulario debe contar con autorización básica para almacenar y utilizar esos datos con fines profesionales relacionados con el proyecto.

---

## 19. Panel administrativo privado

Habrá una vista exclusivamente para Andrés.

Mostrará:

- visitantes últimos 30 días;
- comparaciones realizadas;
- usuarios que dejaron contacto;
- recruiters;
- hiring managers;
- tecnologías más consultadas;
- combinaciones más consultadas;
- clics hacia LinkedIn;
- clics hacia GitHub;
- contactos recibidos.

Posteriormente podremos añadir evolución histórica.

---

## 20. Posicionamiento profesional del creador

La plataforma también será publicidad profesional.

En el header o zona superior aparecerá discretamente:

**Created by Andrés Alba**

**Senior Full-Stack & AI Engineer**

Y debajo:

React · TypeScript · Node.js · LLM Systems · RAG · Agents

Enlaces:

- LinkedIn
- GitHub
- Contact

La plataforma debe demostrar quién la construyó sin convertir el sitio en un CV.

---

## 21. About the Creator

Habrá una sección muy pequeña.

Texto conceptual:

Andrés Alba is a Senior Full-Stack & AI Engineer focused on modern web applications and applied AI systems, including LLM applications, RAG, agentic systems and AI-powered products.

Con enlaces profesionales.

Nada más.

El producto sigue siendo el protagonista.

---

## 22. Embudo profesional

Queremos poder medir:

Visita al observatorio

↓

Uso del comparador

↓

Clic en LinkedIn

↓

Clic en GitHub

↓

Contacto

Con esto podremos saber si el proyecto está generando oportunidades profesionales.

---

## 23. Arquitectura técnica

### Frontend

- React
- Vite
- TypeScript
- Recharts

### Backend

- TypeScript
- Cloudflare Workers

Alternativamente, durante desarrollo local podremos mantener una estructura similar a Node/Express si facilita el trabajo, pero el despliegue final debe adaptarse a infraestructura gratuita.

### Base de datos

Cloudflare D1.

Modelo SQL compatible conceptualmente con SQLite.

### Hosting

Cloudflare.

### Analytics

Cloudflare Web Analytics.

### Código fuente

GitHub.

### Actualizaciones

Cron Trigger de Cloudflare o mecanismo gratuito equivalente.

---

## 24. Costo

Objetivo:

**$0 mensuales.**

No queremos:

- servidores VPS;
- bases de datos pagas;
- servicios obligatorios con suscripciones;
- herramientas premium necesarias para mantener vivo el sitio.

El proyecto debe poder permanecer publicado indefinidamente aunque reciba poco tráfico.

---

## 25. Modelo de datos inicial

### jobs

Representa cada vacante.

Campos conceptuales:

- id
- external_job_id
- title
- company
- location
- country
- description
- url
- published_at
- closed_at
- first_seen
- last_seen
- seniority

### technologies

- id
- name
- category

### job_technologies

- job_id
- technology_id

### visitor_events

- id
- event_type
- technology/comparison
- timestamp

### visitor_contacts

- id
- name
- company
- role
- email
- phone
- country
- comment
- created_at

No necesitamos diseñar veinte tablas desde el primer día.

---

## 26. Clasificación inicial

Comenzaremos con reglas deterministas.

Por ejemplo:

si título/descripción contiene React → React.

si contiene Node.js o NodeJS → Node.js.

si contiene Spring Boot → Spring.

si contiene RAG o Retrieval-Augmented Generation → RAG.

Esto permitirá avanzar rápidamente.

Posteriormente podremos evaluar IA para resolver casos ambiguos, pero no es necesaria para el MVP.

---

## 27. Normalización

Será importante agrupar sinónimos.

Ejemplos:

Node

NodeJS

Node.js

deben convertirse en:

Node.js

Generative AI

GenAI

Gen AI

deben poder pertenecer a:

Generative AI

Lo mismo con roles.

Una buena normalización será más importante que una interfaz sofisticada.

---

## 28. Deduplicación

Una misma oferta puede aparecer en varias búsquedas.

Nunca debemos contabilizarla varias veces.

Usaremos principalmente:

LinkedIn Job ID.

Si no estuviera disponible, utilizaremos una combinación estable como:

empresa + título + URL + fecha.

Una vacante se guarda una sola vez y luego se relaciona con todas las tecnologías correspondientes.

---

## 29. Actualización de datos

Después del backfill histórico tendremos actualizaciones incrementales.

Proceso:

consultar novedades;

detectar vacantes nuevas;

actualizar vacantes existentes;

detectar cierres cuando sea posible;

clasificar tecnologías;

guardar cambios;

actualizar estadísticas.

No necesitamos volver a descargar toda la historia diariamente.

---

## 30. Frecuencia

Inicialmente:

una actualización diaria.

Podríamos incluso actualizar cada pocos días dependiendo del comportamiento de Job Library.

No buscamos información en tiempo real.

Buscamos tendencias laborales.

---

## 31. MVP

El MVP debe contener únicamente:

1. conexión con fuente de datos;
2. histórico Colombia;
3. base normalizada;
4. React;
5. Node;
6. Python;
7. Java;
8. AI Engineer;
9. Frontend;
10. Full Stack;
11. comparación de hasta tres series;
12. nuevas vs activas;
13. períodos temporales;
14. gráfica;
15. tarjetas de tendencia;
16. identidad del creador;
17. LinkedIn;
18. GitHub;
19. analytics.

Eso ya constituye un producto completamente publicable.

---

## 32. Fase 2

Después del MVP:

- más tecnologías;
- combinaciones;
- panel administrativo;
- contactos;
- Visitor Interest Index;
- rankings;
- tendencias rápidas;
- filtros por seniority;
- remoto/presencial;
- ciudad;
- salario si existen suficientes datos.

---

## 33. Fase 3

Solo si existe tráfico real:

- reportes mensuales;
- rankings;
- newsletters;
- API pública;
- exportación CSV;
- informes para empresas;
- patrocinadores;
- publicidad.

---

## 34. Monetización

NO será prioridad inicial.

Primero necesitamos:

datos

↓

producto útil

↓

usuarios

↓

uso recurrente

↓

tráfico

↓

monetización.

Posibles modelos futuros:

- publicidad;
- patrocinadores;
- informes premium;
- reportes empresariales;
- API;
- newsletter;
- estadísticas avanzadas.

No implementaremos ninguno hasta tener evidencia real de tráfico.

---

## 35. Riesgos principales

### Acceso a LinkedIn Job Library

Es el riesgo número uno.

Debe resolverse antes de desarrollar el dashboard.

### Sesgo de la muestra

Job Library contiene ofertas promocionadas.

Debe explicarse claramente.

### Clasificación incorrecta

Necesitamos buenas reglas de normalización y clasificación.

### Duplicados

Una oferta puede aparecer en múltiples consultas.

Debe deduplicarse.

### Cambios del proveedor

Maton o LinkedIn podrían modificar condiciones.

La arquitectura debe mantener separada la capa de ingestión para poder cambiar de proveedor sin rehacer toda la plataforma.

---

## 36. Separación arquitectónica fundamental

El sistema debe dividirse conceptualmente en:

**Data source**

↓

**Ingestion**

↓

**Normalization**

↓

**Database**

↓

**Analytics API**

↓

**Dashboard**

Esto significa que si algún día Maton desaparece, solamente reemplazamos Data Source/Ingestion.

El resto del proyecto continúa funcionando.

---

## 37. Qué NO vamos a construir inicialmente

No login.

No cuentas de usuarios.

No perfiles.

No red social.

No chatbot.

No recomendaciones laborales automáticas.

No aplicación móvil.

No IA innecesaria.

No pagos.

No suscripciones.

No publicidad.

No sistemas empresariales complejos.

No microservicios.

No arquitectura sobredimensionada.

---

## 38. Valor como portafolio

Aunque técnicamente será mucho más sencillo que The Architect of Her Desire, mostrará otro tipo de competencias:

- React;
- TypeScript;
- backend;
- APIs;
- SQL;
- data ingestion;
- normalización;
- analytics;
- series temporales;
- visualización;
- producto;
- despliegue;
- observabilidad;
- privacidad;
- arquitectura desacoplada.

Esto complementa muy bien Atrael y The Architect.

---

## 39. Posicionamiento del portafolio

Los tres proyectos demostrarían capacidades diferentes.

### Atrael

Aplicación local de IA.

Documentos.

Modelos locales.

Privacidad.

LLM application.

### The Architect of Her Desire

Sistema LLM avanzado.

RAG.

Memoria.

Estado.

Branching.

Evaluación.

Confiabilidad.

Calibración.

### Colombia Tech Job Market

Data product.

Full stack.

Analytics.

Series temporales.

APIs.

Visualización.

Producto público.

Esto forma un portafolio mucho más completo que múltiples proyectos similares.

---

## 40. Primera sesión de desarrollo

No empezaremos haciendo React.

La primera sesión será exclusivamente:

### Paso 1

Crear cuenta gratuita en Maton.

### Paso 2

Conectar LinkedIn.

### Paso 3

Obtener API key.

### Paso 4

Consultar Job Library.

### Paso 5

Buscar Software en Colombia.

### Paso 6

Buscar React en Colombia.

### Paso 7

Consultar un rango histórico de 2026.

### Paso 8

Probar paginación.

### Paso 9

Guardar la respuesta real.

### Paso 10

Inspeccionar exactamente qué campos obtenemos.

Solamente después de comprobar esto diseñaremos definitivamente el esquema SQL.

---

## 41. Segunda sesión

Con datos reales:

- definir modelo SQL;
- crear ingestión;
- deduplicar;
- guardar vacantes;
- implementar primeras tecnologías;
- cargar histórico.

---

## 42. Tercera sesión

Construir API de analytics:

- nuevas por día;
- activas por día;
- agrupación tecnológica;
- comparación.

---

## 43. Cuarta sesión

Construir dashboard React:

- selectors;
- gráfica;
- tarjetas;
- períodos.

---

## 44. Quinta sesión

Publicación:

- Cloudflare;
- D1;
- actualización automática;
- Web Analytics;
- LinkedIn/GitHub;
- identidad del creador.

Con eso tendremos la primera versión pública.

---

## 45. Definición de “terminado”

El MVP estará terminado cuando:

1. una persona pueda entrar públicamente sin login;
2. pueda seleccionar hasta tres tecnologías/roles;
3. pueda comparar su evolución histórica en Colombia;
4. pueda elegir nuevas o activas;
5. pueda cambiar el período;
6. los datos provengan de una fuente real;
7. las ofertas estén deduplicadas;
8. las tecnologías estén normalizadas;
9. las actualizaciones puedan ejecutarse automáticamente;
10. podamos medir cuántas personas utilizan el sitio;
11. Andrés aparezca claramente identificado como creador;
12. existan enlaces hacia LinkedIn y GitHub;
13. el costo fijo mensual sea cero.

---

## 46. Pregunta que siempre debe guiar el proyecto

Cada nueva funcionalidad debe responder:

**¿Esto ayuda a entender mejor el mercado laboral tecnológico colombiano o ayuda a convertir el proyecto en una oportunidad profesional para Andrés?**

Si la respuesta es no, probablemente no debemos construirla.

---

## 47. Visión final

El proyecto comienza como una herramienta personal para responder:

**“¿Estoy apostando profesionalmente por las tecnologías correctas?”**

Puede evolucionar hacia:

**un observatorio público del mercado laboral tecnológico colombiano.**

Y si adquiere usuarios suficientes, posteriormente puede convertirse en:

**un pequeño producto de inteligencia de mercado tecnológico.**

Pero esa evolución dependerá de los datos.

Primero construiremos algo pequeño, confiable, útil y público.

Después dejaremos que el comportamiento de los usuarios nos diga qué merece crecer.
