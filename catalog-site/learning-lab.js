// Niveles, capítulos y laboratorios del Laboratorio de aprendizaje -- al entrar se elige un
// nivel (Básico/Intermedio/Avanzado); dentro de cada nivel la ruta es progresiva y
// estrictamente secuencial (un laboratorio se desbloquea solo cuando el anterior de su
// capítulo está completo, y un capítulo solo cuando el anterior está 100% completo). Igual
// que catalog-meta.js/catalog-api.js: data hand-authored, sin generación automática.
//
// Niveles: Intermedio/Avanzado NO son "lo mismo pero más difícil" -- cada uno suma temas
// nuevos que Básico no cubre (testing, accesibilidad, e2e, analítica...). Los 3 niveles
// tienen contenido real: Básico (fundamentos, construcción, testing unitario, repaso de
// scope/closures), Intermedio (accesibilidad, testing e2e, flujo de contribución, JS
// intermedio) y Avanzado (JS avanzado, guía de construcción de una app completa).
//
// Forma de cada laboratorio: { id, title, objective, context, steps: [...], hint, selfCheck, estimatedMinutes }
// Forma de cada capítulo: { id, title, summary, labs: [...], estimatedMinutes, outcomes: [...] }
// Forma de cada nivel: { id, title, description, prerequisite, icon, chapters: [...] }

/* Requisitos de software -- se muestran una sola vez, centrados, en la pantalla de
   selección de nivel (aplican por igual a los 3 niveles, no se repiten por tarjeta).
   Vista técnica: comandos reales para confirmar la versión instalada, no una lista
   de prosa -- se omiten a propósito ítems implícitos para cualquier entorno de
   desarrollo (editor, navegador, terminal). */
export const LAB_REQUIREMENTS = {
  equipo:
    'Windows 10/11, macOS 12+ o cualquier distro Linux reciente -- sin requisito de hardware especial.',
  checks: [
    { command: 'node -v', comment: '>=18 requerido (el repo fija 22 en .nvmrc)' },
    {
      command: 'corepack enable && corepack prepare pnpm@9.15.9 --activate',
      comment: 'activa la versión de pnpm que usa el repo',
    },
    { command: 'git --version', comment: null },
  ],
};

const BASICO_CHAPTERS = [
  {
    id: 'fundamentos',
    title: 'Capítulo 0 — Fundamentos y estándares',
    summary:
      'Qué es un Web Component y de qué piezas se arma, una introducción a Lit, qué es un token de diseño (en general y en Emerald Pro) y dónde seguir investigando por tu cuenta -- las bases conceptuales antes de construir nada.',
    estimatedMinutes: 105,
    outcomes: [
      'Explicar con tus propias palabras qué es un Web Component y qué beneficios tiene sobre depender de un framework específico.',
      'Nombrar las 3 piezas de un Web Component (Custom Elements, Shadow DOM, HTML Templates) y qué resuelve cada una.',
      'Explicar qué es Lit, qué resuelve sobre la plataforma nativa, y las fases principales de su ciclo de vida.',
      'Explicar qué es un token de diseño en general (características, beneficios, consideraciones) y justificar qué token de Emerald Pro corresponde a cada propiedad visual.',
      'Conocer dónde seguir investigando por tu cuenta sobre Web Components, con fuentes reales de la comunidad.',
    ],
    labs: [
      {
        id: 'webcomponents-concepto',
        title: 'Qué es un Web Component',
        objective:
          'Un Web Component es una pieza de interfaz que encapsula su propio marcado, estilos y comportamiento, y que cualquier página puede usar como una etiqueta HTML más, sin depender del framework con el que se escribió.',
        estimatedMinutes: 25,
        content: [
          { type: 'heading', text: 'Qué es un Web Component' },
          {
            type: 'p',
            text: 'Un Web Component es una pieza de interfaz reutilizable que el propio navegador sabe usar. En vez de copiar el mismo bloque de HTML, CSS y JavaScript en cada página, lo empaquetas una sola vez y lo usas como si fuera una etiqueta más, por ejemplo la etiqueta mi-tarjeta. Nada de eso depende de una librería concreta: son capacidades que ya vienen integradas en el navegador.',
          },
          { type: 'heading', text: 'Las tres piezas del estándar' },
          {
            type: 'p',
            text: 'Un Web Component no es una sola tecnología, sino tres que trabajan juntas. Cada una resuelve un problema distinto, y conviene entender qué garantiza cada una antes de mirar cualquier código.',
          },
          {
            type: 'p',
            text: 'Custom Elements te permite definir etiquetas nuevas con nombre propio (el nombre siempre lleva un guion, como mi-boton) y darles comportamiento en JavaScript. El navegador además avisa a esa clase cuando el elemento se agrega a la página, se quita, se mueve o cambia uno de sus atributos. Lo que garantiza es que tu etiqueta se comporte como un elemento nativo más.',
          },
          {
            type: 'p',
            text: 'Shadow DOM le da a cada componente un árbol de DOM privado. Lo que vive dentro de ese árbol no puede ser alcanzado por los selectores CSS ni por el JavaScript de la página, y al revés: los estilos de afuera no pisan los de adentro por accidente. Lo que garantiza es encapsulamiento; por eso dentro del componente puedes usar nombres de clase sencillos sin temor a chocar con otra parte de la página. Algunas propiedades, como la tipografía, sí se heredan desde afuera, y eso también es intencional.',
          },
          {
            type: 'image-placeholder',
            caption:
              'Diagrama de tres capas apiladas. Arriba, Custom Element: la etiqueta y su lógica en JavaScript. En el medio, Shadow DOM: un recuadro cerrado con borde punteado que separa estilos y estructura internos del resto de la página. Abajo, HTML Template: el molde de marcado que se clona dentro del Shadow DOM. Flechas que muestren que el template se clona hacia el Shadow DOM de un Custom Element.',
          },
          {
            type: 'p',
            text: 'Las plantillas HTML son el molde. La etiqueta template guarda un bloque de marcado que el navegador no muestra ni ejecuta hasta que tu código lo clona. La etiqueta slot es un hueco dentro de ese molde donde se inserta el contenido que quien usa el componente escribe entre las etiquetas del componente. Lo que garantizan es que la estructura se defina una sola vez y que el contenido externo pueda componerse dentro de ella.',
          },
          { type: 'heading', text: 'El enfoque: componer en vez de copiar' },
          {
            type: 'p',
            text: 'La idea de fondo es construir la interfaz como un conjunto de piezas independientes que se combinan, y no como un bloque enorme donde todo depende de todo. Cada pieza se encapsula, recibe lo que necesita por atributos o propiedades, y comunica lo que pasa hacia afuera mediante eventos.',
          },
          {
            type: 'p',
            text: 'Eso trae beneficios concretos. Primero, reutilización: un mismo componente puede aparecer en decenas de páginas sin reescribirse. Segundo, independencia de framework: como el navegador lo entiende de forma nativa, una página hecha con React, Vue, Angular o HTML puro puede usar el mismo componente. Tercero, menos colisiones: sus estilos no se filtran hacia afuera ni los estilos externos lo afectan. Cuarto, mantenimiento local: cambiar un componente afecta a quienes lo usan, y el resto del código no tiene por qué enterarse.',
          },
          {
            type: 'image-placeholder',
            caption:
              'Comparación en dos columnas. Izquierda, titulada sin Web Components: el mismo bloque de HTML, CSS y JS copiado en tres páginas distintas, con estilos que chocan entre sí. Derecha, titulada con Web Components: una sola pieza reutilizable que aparece en las tres páginas, con sus estilos aislados.',
          },
          {
            type: 'p',
            text: 'Conviene aclarar algo: el estándar da las herramientas base, pero no obliga a escribir todo a mano. Existen librerías que facilitan crear componentes, y ese es el papel de Lit en este proyecto. Lit no reemplaza al estándar; lo usa por debajo y te ahorra el trabajo repetitivo.',
          },
          { type: 'heading', text: 'Un ejemplo conceptual' },
          {
            type: 'p',
            text: 'Imagina una etiqueta mi-boton que, al usarla, dibuja un botón con su propio aspecto y su propio comportamiento. Quien la escribe en una página solo necesita saber que existe y qué atributos acepta; no necesita saber cómo está hecha por dentro:',
          },
          {
            type: 'code',
            lang: 'html',
            code: `<mi-boton variante="principal">Guardar</mi-boton>`,
          },
          {
            type: 'p',
            text: 'Esa línea se lee como cualquier HTML, pero detrás hay un componente que dibuja el botón dentro de su propio espacio aislado. Si mañana cambias su color o su comportamiento, las páginas que lo usan no tienen que tocarse. Y como es una etiqueta estándar, la misma línea funciona en una página sin framework o dentro de una aplicación hecha con otra tecnología.',
          },
          {
            type: 'note',
            text: 'Esta es la idea detrás de todo el catálogo de ac-lit: sus 38 componentes se construyen como Web Components, y usamos Lit para escribirlos con menos código. En los próximos capítulos pasas de este concepto a código real del repo, pero la pregunta de fondo será siempre la misma: qué encapsula cada pieza y cómo se reutiliza.',
          },
        ],
        checkpoint:
          'Puedes explicar con tus propias palabras qué es un Web Component, nombrar las 3 tecnologías del estándar (Custom Elements, Shadow DOM y HTML Templates) y qué garantiza cada una, y explicar por qué son reutilizables entre frameworks.',
      },
      {
        id: 'webcomponents-elementos',
        title: 'Elementos de un Web Component',
        objective: `Un Web Component se arma con tres piezas que trabajan juntas: Custom Elements (la etiqueta y su clase), Shadow DOM (el DOM y los estilos aislados) y HTML Templates (la estructura reutilizable que se clona).`,
        estimatedMinutes: 20,
        content: [
          {
            type: 'p',
            text: `Cuando decimos que algo es un Web Component, en realidad hablamos de tres estándares del navegador que se combinan. Ninguno es un framework: cada uno resuelve un problema distinto, y juntos permiten crear etiquetas HTML propias que se comportan como cualquier otro elemento.`,
          },
          { type: 'heading', text: '1. Custom Elements: tu propia etiqueta' },
          {
            type: 'p',
            text: `Un custom element es una clase de JavaScript que le asigna comportamiento a una etiqueta con nombre propio. El nombre debe llevar un guion (por ejemplo mi-tarjeta) y el registro se hace con una sola llamada: customElements.define('mi-tarjeta', MiTarjeta). A partir de ahí, cada vez que el navegador encuentre <mi-tarjeta> en el documento, creará una instancia de esa clase.`,
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'mi-tarjeta.js',
            code: `class MiTarjeta extends HTMLElement {
  connectedCallback() {
    this.textContent = 'Hola desde mi propia etiqueta';
  }
}

customElements.define('mi-tarjeta', MiTarjeta);`,
          },
          {
            type: 'p',
            text: `La clase recibe callbacks de ciclo de vida: connectedCallback cuando el elemento entra al DOM, disconnectedCallback cuando sale y attributeChangedCallback cuando cambia uno de los atributos observados. Así el componente puede reaccionar a su propia existencia y a los cambios que recibe.`,
          },
          { type: 'heading', text: 'Atributos y properties: no son lo mismo' },
          {
            type: 'p',
            text: `Un atributo es lo que escribes en el HTML, por ejemplo <mi-tarjeta titulo="Ventas">. El navegador siempre lo guarda como texto, así que titulo="42" llega como "42". Una property es un valor de JavaScript sobre el objeto del elemento, como miTarjeta.datos = { total: 42 }, y puede ser de cualquier tipo: número, objeto, arreglo o función.`,
          },
          {
            type: 'p',
            text: `En la práctica, los atributos sirven para configurar algo simple que se escribe a mano, y las properties para pasar datos complejos desde otro código. Esta diferencia es justo la que vas a ver de cerca más adelante con Lit, donde un mismo componente recibe unos valores como atributo y otros como property.`,
          },
          { type: 'heading', text: '2. Shadow DOM: un DOM y unos estilos aislados' },
          {
            type: 'p',
            text: `El Shadow DOM crea un árbol de DOM privado dentro del componente. Lo que está adentro no puede ser alterado por consultas como document.querySelector desde la página, y los estilos definidos adentro no se filtran hacia afuera. Por eso un botón del componente no hereda por accidente el color de la página, ni una regla global le rompe el diseño.`,
          },
          {
            type: 'p',
            text: `Se activa con attachShadow, normalmente en el constructor: this.attachShadow({ mode: 'open' }). Con mode 'open' el shadow root sigue accesible desde JavaScript (elemento.shadowRoot); con 'closed' queda oculto, aunque casi no se usa porque complica la depuración.`,
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'mi-tarjeta.js (fragmento)',
            code: `class MiTarjeta extends HTMLElement {
  constructor() {
    super();
    const raiz = this.attachShadow({ mode: 'open' });
    raiz.innerHTML = '<style>p { color: teal; }</style><p>Dentro del shadow</p>';
  }
}`,
          },
          {
            type: 'p',
            text: `Desde adentro, el componente puede dejar huecos para recibir contenido de quien lo usa con <slot>. El contenido que se escribe entre las etiquetas del componente se proyecta en ese hueco, pero sigue siendo del documento que lo escribió, y los estilos de la página siguen aplicándose a él.`,
          },
          {
            type: 'code',
            lang: 'html',
            filename: 'Dentro del shadow root y uso desde afuera',
            code: `<!-- dentro del shadow root del componente -->
<section>
  <h2>Título fijo</h2>
  <slot></slot>
</section>

<!-- uso desde la página -->
<mi-tarjeta>
  <p>Este párrafo se proyecta en el slot</p>
</mi-tarjeta>`,
          },
          { type: 'heading', text: '3. HTML Templates: estructura que se clona' },
          {
            type: 'p',
            text: `El elemento <template> guarda HTML que el navegador parsea pero no renderiza: no crea nodos visibles, no carga imágenes y no ejecuta scripts hasta que alguien lo usa. Su contenido vive en un fragmento aparte (template.content) que decides cuándo mostrar.`,
          },
          {
            type: 'p',
            text: `Para usarlo, clonas ese contenido con cloneNode(true) y lo insertas en el shadow root del componente. Así una misma estructura se reutiliza en cada instancia del elemento sin volver a escribir el HTML, y cada clon es independiente: cambiar uno no afecta a los demás.`,
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'Clonado de un template',
            code: `const plantilla = document.createElement('template');
plantilla.innerHTML = '<p class="etiqueta">Hola</p>';

const copia = plantilla.content.cloneNode(true);
this.shadowRoot.appendChild(copia);`,
          },
          {
            type: 'note',
            text: `Cómo encajan: Custom Elements define quién es el componente, Shadow DOM aísla lo que muestra y Template describe la estructura que se clona dentro de ese aislamiento. En este catálogo no vas a escribir customElements.define, attachShadow ni clonar templates a mano: Lit resuelve las tres piezas por ti. Igual, entender qué hace por dentro ayuda a explicar por qué un componente se vuelve a renderizar, por qué sus estilos no se filtran y por qué una property no es lo mismo que un atributo.`,
          },
        ],
        checkpoint: `Puedes nombrar las 3 piezas de un Web Component (Custom Elements, Shadow DOM, HTML Templates), explicar qué resuelve cada una y la diferencia entre un atributo (siempre texto) y una property (cualquier tipo de dato).`,
      },
      {
        id: 'lit-ciclo-vida',
        title: 'Lit y su ciclo de vida',
        objective:
          'Lit es una librería mínima que hace cómodo escribir Web Components estándar: declaras propiedades reactivas y un render, y ella se encarga de volver a pintar cuando algo cambia. Entender en qué fase corre cada método es lo que evita la mayoría de los bugs típicos.',
        estimatedMinutes: 20,
        content: [
          { type: 'heading', text: 'Qué es Lit' },
          {
            type: 'p',
            text: 'Lit es una librería liviana, hoy mantenida bajo la OpenJS Foundation, para construir Web Components. No inventa un sistema de componentes propio: un componente Lit es un Custom Element nativo que puedes usar en cualquier página o framework. Lo que aporta es una capa mínima encima de la plataforma para escribirlo con menos código.',
          },
          { type: 'heading', text: 'Qué resuelve frente a hacerlo a mano' },
          {
            type: 'p',
            text: 'Con la API nativa tendrías que registrar el elemento con customElements.define, crear el shadow root, escribir a mano el HTML inicial y repintar cada vez que cambia un dato. Lit te da tres cosas: propiedades reactivas (cuando una cambia, se programa un nuevo render solo), un método render() declarativo que devuelve una plantilla con html, y una clase base (LitElement) que gestiona el shadow root y el registro. Así el código se concentra en el estado y en cómo se ve ese estado.',
          },
          { type: 'heading', text: 'El ciclo de vida de un componente Lit' },
          {
            type: 'p',
            text: 'Un componente Lit pasa por fases en un orden predecible. A grandes rasgos: se conecta al DOM (connectedCallback), detecta que una propiedad reactiva cambió y programa una actualización, calcula valores derivados en willUpdate(), genera el DOM con render() y lo aplica, y finalmente avisa con updated() y, solo la primera vez, con firstUpdated(). Cuando el elemento sale del DOM corre disconnectedCallback(), que queda fuera de esa secuencia y puede ocurrir en cualquier momento.',
          },
          {
            type: 'p',
            text: 'Antes de willUpdate() hay un paso intermedio, shouldUpdate(), que puede cancelar la actualización. El diagrama oficial de este ciclo, publicado en lit.dev, resume el orden completo:',
          },
          {
            type: 'image-placeholder',
            caption:
              'Diagrama oficial del ciclo de vida de componentes de Lit, publicado en lit.dev (página Lifecycle). Pendiente: descargar o enlazar desde esa fuente.',
          },
          { type: 'heading', text: 'Por qué vale la pena investigarlo por tu cuenta' },
          {
            type: 'p',
            text: 'Saber en qué fase estás te dice qué puedes hacer en cada una. En updated() y firstUpdated() el DOM ya está pintado, así que es el lugar seguro para medir elementos o enfocar un campo. En willUpdate() puedes calcular valores derivados sin disparar otra actualización, y en render() solo describes el DOM a partir del estado. Cambiar una propiedad dentro de updated() sí dispara un nuevo ciclo, y hacerlo sin cuidado produce bucles infinitos. Por eso conviene leer la documentación con calma: shouldUpdate, updateComplete y el orden exacto de cada método son los puntos que más se confunden al empezar.',
          },
          {
            type: 'links',
            title: 'Para seguir investigando',
            items: [
              {
                label: 'Sitio oficial de Lit',
                url: 'https://lit.dev/',
                description:
                  'Visión general, tutoriales y documentación de la versión actual. Empieza aquí para entender qué problema resuelve.',
              },
              {
                label: 'Lit: ciclo de vida de componentes (Lifecycle)',
                url: 'https://lit.dev/docs/components/lifecycle/',
                description:
                  'Detalla cada método, en qué orden corre y qué no conviene hacer dentro de cada uno. Léela antes de tocar un componente en los próximos capítulos.',
              },
            ],
          },
        ],
        checkpoint:
          'Puedes explicar en una frase qué es Lit y qué resuelve sobre la plataforma nativa, y nombrar en orden las fases principales de su ciclo de vida (conectar, detectar cambios, willUpdate, render, updated).',
      },
      {
        id: 'tokens-diseno',
        title: 'Tokens de diseño y Emerald Pro',
        objective:
          'Un token de diseño es un valor con nombre que representa una decisión visual compartida -- primero entiendes el concepto general de la industria, y después lo ves aplicado en Emerald Pro, el sistema de tokens real de este catálogo.',
        estimatedMinutes: 25,
        content: [
          { type: 'heading', text: 'Qué es un token de diseño' },
          {
            type: 'p',
            text: 'Un token de diseño es un valor con nombre que representa una decisión de diseño: un color, un espaciado, una tipografía, un radio de borde. En lugar de escribir el valor literal (por ejemplo, #2a7f62 o 16px) en cada lugar donde se usa, le das un nombre y lo reutilizas. El token es la unidad mínima de una decisión visual, guardada en un solo lugar.',
          },
          { type: 'heading', text: 'Características de un buen token' },
          {
            type: 'p',
            text: 'Primero, se nombra según su propósito (semántico), no según su valor. Un token llamado --color-primary dice para qué sirve; uno llamado --color-verde-400 solo dice qué color es, y se vuelve confuso si la marca cambia de verde a azul. Segundo, existe una sola fuente de verdad: cada decisión se define una vez y el resto del sistema la consume. Tercero, es portable: el mismo token puede exportarse a CSS, iOS, Android o a una herramienta de diseño, porque describe la intención y no una tecnología particular.',
          },
          { type: 'heading', text: 'Para qué sirven' },
          {
            type: 'p',
            text: 'Dan consistencia visual, porque todas las pantallas usan la misma escala de espaciados y los mismos colores. Permiten cambios centralizados: ajustar un valor en un solo lugar actualiza todo lo que lo usa. Y facilitan la comunicación entre diseño y desarrollo, porque ambos hablan del mismo nombre en vez de describir "el azul de la página de inicio".',
          },
          { type: 'heading', text: 'Consideraciones al usarlos' },
          {
            type: 'p',
            text: 'No conviene convertir cada valor en un token: si todo es un token, nada lo es. Mantén una escala limitada (pocos pasos de color, pocos tamaños de texto) para que cada elección tenga sentido. Y documenta el propósito de cada token, para que quien lo use sepa cuándo aplicarlo y cuándo no.',
          },
          { type: 'heading', text: 'Un ejemplo conceptual' },
          {
            type: 'p',
            text: 'Imagina una app con 50 botones primarios. Si cada botón tiene su azul escrito a mano, cambiar la marca obliga a tocar 50 lugares, y siempre queda alguno sin cambiar. Si todos usan --color-primary, cambiarlo una sola vez actualiza los 50 botones a la vez.',
          },
          { type: 'heading', text: 'Nuestros tokens: Emerald Pro' },
          {
            type: 'p',
            text: 'Ahora veamos cómo se aplica esta idea en el catálogo. Emerald Pro es el sistema de tokens de este repo, y el caso de estudio que sigue muestra sus valores reales.',
          },
          {
            type: 'p',
            text: 'Si cada componente escribiera border-radius: 16px a mano, cambiar el radio del catálogo entero significaría editar 38 archivos. Emerald Pro resuelve esto con tokens: variables CSS con nombre, definidas una sola vez en @ac-base/ac-core, que cada componente referencia en vez de escribir el valor literal.',
          },
          { type: 'heading', text: 'La escala de radio de borde' },
          {
            type: 'p',
            text: 'Son 4 pasos, de menor a mayor superficie: un control chico dentro de otro más grande usa un paso menos que su contenedor. --radius-full queda aparte, reservado para estados binarios y tags (switch, radio, badge) -- nunca para una superficie como una card.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/base/ac-core/src/tokens/base.css',
            code: `--radius-sm: 0.5rem;  /* 8px  -- elementos chicos/icónicos (botón de cerrar, marca del checkbox) */
--radius-md: 1rem;    /* 16px -- controles (botón, input, select, tabs) */
--radius-lg: 1.5rem;  /* 24px -- superficies (card, panel, toast, popover) */
--radius-xl: 2rem;    /* 32px -- la superficie más grande del catálogo (modal) */
--radius-full: 9999px;`,
          },
          { type: 'heading', text: 'Espaciado y tipografía' },
          {
            type: 'p',
            text: 'El espaciado sigue una grilla de 4px (--space-1 a --space-6), y la tipografía tiene 4 tamaños con nombre según su rol -- nunca un valor en px suelto.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/base/ac-core/src/tokens/base.css',
            code: `--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem;  /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem;    /* 16px */

--font-size-xs: 0.75rem; /* badge, texto micro */
--font-size-sm: 0.85rem; /* ayuda, hints */
--font-size-md: 0.95rem; /* cuerpo, default */
--font-size-lg: 1.1rem;  /* títulos */
--font-weight-bold: 700;`,
          },
          { type: 'heading', text: 'Cómo se ven aplicados: ac-badge-basic' },
          {
            type: 'p',
            text: 'Un badge es un indicador de estado (una "pastilla"), no una superficie -- por eso usa --radius-full y no --radius-md. Así se ve su regla base real:',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/components/ac-badge-basic/src/badge-basic.styles.scss',
            code: `.ac-badge-basic {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
  border-radius: var(--radius-full, 9999px);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-xs, 0.75rem);
  line-height: var(--line-height-tight, 1.4);
}`,
          },
          {
            type: 'note',
            text: 'var(--nombre, respaldo) se lee así: lo que va antes de la coma es el token que manda; lo que va después solo aplica si ese token no está definido en absoluto (no es un segundo intento, es un valor fijo de emergencia).',
          },
          { type: 'heading', text: 'Los 4 colores semánticos de estado' },
          {
            type: 'p',
            text: 'Las 4 variantes del badge usan colores FIJOS que no cambian entre tema claro y oscuro -- un estado de "error" debe verse igual de rojo sin importar el tema de la página. Por eso no usan --color-muted ni --color-surface (esos sí cambian con el tema):',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/components/ac-badge-basic/src/badge-basic.styles.scss',
            code: `.ac-badge--neutral  { background: var(--color-neutral, #44433d); color: #fff; }
.ac-badge--success  { background: var(--color-success, #499c54); color: #000; }
.ac-badge--warning  { background: var(--color-warning, #e8a400); color: #000; }
.ac-badge--danger   { background: var(--color-danger, #e05555);  color: #000; }`,
          },
        ],
        checkpoint:
          'Puedes explicar qué es un token de diseño y sus tres características (nombre semántico, fuente única, portable). En Emerald Pro, puedes nombrar los 4 pasos de la escala de radio, explicar por qué un badge usa --radius-full en vez de --radius-md, y por qué sus 4 colores de estado no cambian entre tema claro y oscuro.',
      },
      {
        id: 'investigacion-webcomponents',
        title: 'Investigación: sigue profundizando',
        objective:
          'Este capítulo te dio las bases -- ahora te toca profundizar por tu cuenta con fuentes reales de la comunidad de Web Components.',
        estimatedMinutes: 15,
        content: [
          { type: 'heading', text: 'Por qué investigar por tu cuenta' },
          {
            type: 'p',
            text: 'La plataforma web cambia: aparecen nuevas APIs, cambian las buenas prácticas y los frameworks evolucionan. Un laboratorio fijo se queda como una foto del momento en que se escribió; los sitios de la comunidad siguen vivos y actualizados. Aprender a buscar y leer fuentes primarias es parte del oficio.',
          },
          {
            type: 'links',
            title: 'Para seguir explorando',
            items: [
              {
                label: 'webcomponents.org',
                url: 'https://www.webcomponents.org/',
                description:
                  'Sitio de la comunidad dedicado a compartir y discutir componentes web; buen punto de partida para descubrir librerías y debates sobre el tema.',
              },
              {
                label: 'DesarrolloWeb.com -- Web Components',
                url: 'https://desarrolloweb.com/home/web-components',
                description:
                  'Explicaciones en español sobre Custom Elements, Shadow DOM, plantillas y módulos ES, con enlaces a manuales de Polymer y Lit.',
              },
              {
                label: '"Orientando a componentes: la Web" (SlideShare)',
                url: 'https://es.slideshare.net/slideshow/orientando-a-componentes-la-web-55613507/55613507',
                description:
                  'Presentación en español sobre programación orientada a componentes en la web: Custom Elements, Shadow DOM, plantillas y patrones de diseño.',
              },
              {
                label: 'web.dev',
                url: 'https://web.dev/?hl=es-419',
                description:
                  'Guías, cursos y artículos sobre HTML, CSS, JavaScript, rendimiento y accesibilidad, escritos por el equipo de Chrome y por expertos externos.',
              },
            ],
          },
          {
            type: 'note',
            text: 'Vuelve a este capítulo después de explorar los recursos, con una pregunta o idea concreta en mente: qué parte de Custom Elements o de Shadow DOM quieres entender mejor, o qué práctica de tu propio componente te gustaría revisar con una fuente en la mano.',
          },
        ],
        checkpoint:
          'Visitaste al menos 2 de los 4 recursos y puedes nombrar algo nuevo que aprendiste de cada uno.',
      },
    ],
  },
  {
    id: 'construccion',
    title: 'Capítulo 1 — Construcción',
    summary:
      'Construye un componente propio de punta a punta: desde `aclit component:create` hasta un flujo completo con API pública/privada, eventos, estilos, modal, transición interna y multipasos.',
    estimatedMinutes: 545,
    outcomes: [
      'Scaffoldear un componente real de punta a punta con el CLI propio y entender la estructura de carpetas y archivos que genera.',
      'Componer un flujo complejo con 18 componentes del catálogo sin montar nada a mano.',
      'Separar API pública vs. privada en una clase Lit.',
      'Cablear el 100% de los eventos de forma declarativa, incluido tu propio patrón de emisión (_emit()).',
      'Aplicar tu propio sistema de estilos SCSS sobre los tokens del design system.',
      'Construir un ciclo completo de guardado/éxito/error/reset usando ref().',
    ],
    // Componente de referencia real (`catalog-site/lab-reference/<nombre>/`,
    // ver docs/CONVENTIONS.md) -- `renderLabContent()` en catalog.js arma el
    // link "Ver solución" a partir de este nombre de carpeta cuando existe.
    referenceDemo: 'ac-registro-wizard',
    labs: [
      {
        id: 'construccion-01-scaffold',
        title: '1. Scaffoldear el componente y levantar la demo vacía',
        estimatedMinutes: 25,
        objective:
          'Vas a instalar el CLI de ac-lit y crear tu propio proyecto de componente en una carpeta cualquiera de tu máquina, totalmente afuera de ac-lit. Al final tendrás `ac-registro-wizard` corriendo en el navegador, y vas a entender cada pieza de su `package.json`.',
        content: [
          { type: 'heading', text: 'Instala el CLI' },
          {
            type: 'p',
            text: 'El CLI de ac-lit (`@ac-base/cli`) genera la estructura base de un componente, la misma que tiene cualquier paquete del catálogo. Lo instalas una sola vez, como paquete global:',
          },
          { type: 'code', lang: 'bash', code: 'npm install -g @ac-base/cli' },
          { type: 'heading', text: 'Crea tu proyecto en cualquier carpeta' },
          {
            type: 'p',
            text: 'Este paso corre en una carpeta cualquiera de tu máquina, la que uses para tus proyectos. No necesitas clonar ni tocar el repositorio de ac-lit en ningún momento: tu componente es un proyecto propio, en su propia carpeta, totalmente afuera de ese repo.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'aclit component:create ac-registro-wizard',
          },
          {
            type: 'p',
            text: 'El comando crea la carpeta `ac-registro-wizard/` justo donde estás parado, con todo el scaffold adentro. El nombre tiene que empezar con `ac-`: el CLI lo exige, y así el tag del componente queda como `<ac-registro-wizard>`.',
          },
          { type: 'heading', text: 'Así se ve tu package.json' },
          {
            type: 'p',
            text: 'Este es el `package.json` que genera el CLI para tu componente, con las versiones reales publicadas en npm:',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'ac-registro-wizard/package.json',
            code: `{
  "name": "@ac-components/ac-registro-wizard",
  "version": "0.1.0",
  "description": "ac-lit registro-wizard Web Component",
  "license": "MIT",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./locales.json": "./locales.json"
  },
  "files": ["/src/", "index.js", "locales.json"],
  "publishConfig": { "access": "public" },
  "scripts": {
    "component:lint": "eslint .",
    "component:build:styles": "node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs src/registro-wizard.styles.scss src/registro-wizard.styles.js RegistroWizardStyles",
    "component:build:styles:watch": "node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs src/registro-wizard.styles.scss src/registro-wizard.styles.js RegistroWizardStyles --watch",
    "component:serve": "pnpm run component:build:styles && concurrently -k -n styles,vite -c blue,green \\"pnpm run component:build:styles:watch\\" \\"vite demo\\"",
    "component:build": "pnpm run component:build:styles && vite build",
    "component:preview": "vite preview",
    "component:test": "pnpm run component:build:styles && web-test-runner \\"test/**/*.test.js\\""
  },
  "dependencies": {
    "@ac-base/ac-component-mixin": "^0.1.0",
    "@ac-base/ac-intl-mixin": "^0.1.0"
  },
  "peerDependencies": { "lit": "^3.0.0" },
  "devDependencies": {
    "@ac-base/ac-core": "^0.1.0",
    "@ac-base/ac-demo-content": "^0.1.0",
    "@ac-base/cli": "^0.2.0",
    "@open-wc/testing": "^4.0.0",
    "@web/test-runner": "^0.18.0",
    "concurrently": "^9.1.0",
    "lit": "^3.0.0",
    "sass": "^1.79.4",
    "vite": "^5.4.8"
  }
}`,
          },
          {
            type: 'note',
            text: 'El bloque `publishConfig` viene por defecto porque el CLI asume que vas a publicar tu componente a npm, con acceso público. Si este es solo un proyecto de práctica, puedes borrar ese bloque y agregar `"private": true` justo después de `"version"`: así npm nunca lo publica por error. Si algún día quieres publicarlo de verdad, el paquete ya está listo para hacerlo.',
          },
          { type: 'heading', text: 'Qué hace cada sección' },
          {
            type: 'p',
            text: 'Los primeros campos (`name`, `version`, `description` y `license`) son la identidad del paquete: cómo se llama, en qué versión está, qué es y con qué licencia se distribuye. El `name` usa el scope `@ac-components/`, que es el que usa el catálogo para sus componentes.',
          },
          {
            type: 'p',
            text: '`"type": "module"` indica que el código usa `import` y `export` de ES modules. `main` y `exports` definen qué se carga cuando alguien importa el paquete (aquí, `index.js`), y `exports` además expone `locales.json`, para que las traducciones puedan leerse desde fuera. `files` dice qué se incluye si algún día publicas el paquete.',
          },
          {
            type: 'p',
            text: 'Los `scripts` son los comandos que corres con `pnpm run`. Todos llevan el prefijo `component:`, la misma convención de todo el catálogo: `component:serve` levanta la demo, `component:build` genera la versión de producción, `component:test` corre los tests unitarios y `component:lint` revisa el código.',
          },
          { type: 'heading', text: 'dependencies: lo que viaja con tu componente' },
          {
            type: 'p',
            text: 'Estas dos se instalan también en el navegador de quien use tu componente, porque son código de runtime:',
          },
          {
            type: 'p',
            text: '`@ac-base/ac-component-mixin` te da `ComponentMixin(LitElement)`, la clase base de tu componente, con la propiedad `ambient` y `componentBaseStyles`, que fija la tipografía del sistema en `:host`.',
          },
          {
            type: 'p',
            text: '`@ac-base/ac-intl-mixin` agrega la traducción, es decir `this.t()`. No la importas directamente: `ComponentMixin` la usa por dentro, así que tú solo heredas de `ComponentMixin` y ya tienes `this.t()` disponible.',
          },
          {
            type: 'p',
            text: 'Ojo con `lit`: va como `peerDependency`, no como dependencia. Eso significa que la app que consuma tu componente debe traer su propia copia de `lit`, y tu paquete no la duplica.',
          },
          { type: 'heading', text: 'devDependencies: herramientas para desarrollar y probar' },
          {
            type: 'p',
            text: 'Estas no viajan con el componente: son herramientas de tu proceso de desarrollo. La más importante es `@ac-base/cli`, así que empezamos por ella.',
          },
          { type: 'heading', text: 'Por qué @ac-base/cli es una devDependency de tu proyecto' },
          {
            type: 'p',
            text: 'Instalar el CLI globalmente no alcanza. El script `component:build:styles` llama directamente a un archivo del paquete, por una ruta relativa a tu proyecto:',
          },
          {
            type: 'code',
            lang: 'json',
            code: '"component:build:styles": "node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs src/registro-wizard.styles.scss src/registro-wizard.styles.js RegistroWizardStyles"',
          },
          {
            type: 'p',
            text: 'Ese archivo tiene que existir dentro de tu `node_modules`. Por eso el CLI tiene que estar como devDependency del proyecto. El CLI global solo lo usas para el comando inicial, `aclit component:create`; a partir de ahí, tu proyecto es autosuficiente: `pnpm install` le trae todo lo que necesita, incluido el compilador de estilos.',
          },
          {
            type: 'p',
            text: 'El resto de las devDependencies son más directas: `@ac-base/ac-core` trae los tokens de diseño de Emerald Pro, que tus estilos usan. `@ac-base/ac-demo-content` es el contenedor de la demo que levanta `vite demo`, con el selector de idioma, tema, tamaño de dispositivo y panel de eventos.',
          },
          {
            type: 'p',
            text: '`@open-wc/testing` y `@web/test-runner` corren tus tests unitarios en un navegador real, con `component:test`.',
          },
          {
            type: 'p',
            text: '`concurrently` corre dos procesos a la vez en `component:serve`: el watcher de estilos y `vite demo`. `sass` compila tu `.scss` a estilos, y `vite` sirve la demo y genera el build.',
          },
          {
            type: 'p',
            text: 'Y `lit` aparece también como devDependency para que la demo tenga Lit mientras desarrollas; como peerDependency, quien consuma el componente es quien lo provee.',
          },
          { type: 'heading', text: 'Por qué no aparece @ac-base/ac-e2e-testing' },
          {
            type: 'p',
            text: 'Esa dependencia es privada: vive dentro del repo de ac-lit y nunca se publicó a npm. Como tu proyecto está afuera de ese repo, el CLI no puede instalarla, así que la omite junto con los scripts `component:test:e2e*` que dependen de ella. Dentro del workspace de ac-lit sí aparece, porque ahí sí se puede resolver.',
          },
          { type: 'heading', text: 'Instala dependencias y levanta la demo' },
          {
            type: 'p',
            text: 'Entra a la carpeta del proyecto, instala y levanta la demo. Usamos `pnpm`, como en el resto del laboratorio: tus scripts llaman a `pnpm run` por dentro, así que necesitas pnpm activo, tal como indican los requisitos de software.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'cd ac-registro-wizard\npnpm install\npnpm run component:serve',
          },
          {
            type: 'p',
            text: 'Cuando `component:serve` termine de arrancar, abre en el navegador la URL que imprime Vite (por lo general http://localhost:5173). Vas a ver la demo con `ac-demo-content` alrededor y tu componente de ejemplo adentro.',
          },
        ],
        checkpoint:
          'Tu `package.json` tiene las 2 dependencias base (`@ac-base/ac-component-mixin` y `@ac-base/ac-intl-mixin`) con versiones reales de npm, no `workspace:^`; entiendes por qué `@ac-base/cli` es una devDependency de tu propio proyecto; y la demo abre en el navegador sin errores en la consola.',
      },
      {
        id: 'construccion-01b-estructura-carpetas',
        title: '1.1. La estructura de carpetas que genera el CLI',
        estimatedMinutes: 20,
        objective:
          'Vas a recorrer cada carpeta y archivo que genera `aclit component:create` dentro de `ac-registro-wizard/`. Al final sabrás qué parte del proyecto es el componente real, qué parte solo sirve para la demo y los tests, y qué parte casi nunca vas a tocar.',
        content: [
          { type: 'heading', text: 'Por qué los archivos llevan el nombre de tu componente' },
          {
            type: 'p',
            text: 'El CLI no copia archivos con nombres fijos. La plantilla tiene marcadores como `__file_base__`, `__class_name__`, `__tag__` y `__package_name__`, y al generar el proyecto los reemplaza tanto dentro del contenido de cada archivo como en los nombres de archivos y carpetas. Para `ac-registro-wizard` los valores son: `__tag__` queda como `ac-registro-wizard`, `__file_base__` como `registro-wizard` (el nombre sin el prefijo `ac-`), `__class_name__` como `RegistroWizard` y `__package_name__` como `@ac-components/ac-registro-wizard`. Por eso el archivo principal se llama `registro-wizard.js` y no `__file_base__.js`.',
          },
          { type: 'heading', text: 'Vista general de la estructura' },
          {
            type: 'p',
            text: 'Este es el árbol completo que genera el comando. Compáralo con tu carpeta: si todavía no corriste `pnpm install`, no verás `node_modules/`, y si ya corriste `component:serve`, aparecerá un archivo más en `src/` que se explica en la siguiente sección.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: `ac-registro-wizard/
├── README.md
├── package.json
├── index.js
├── locales.json
├── vite.config.js
├── web-test-runner.config.js
├── src/
│   ├── registro-wizard.js
│   └── registro-wizard.styles.scss
├── demo/
│   ├── index.html
│   ├── demo.js
│   ├── demo-base.css
│   └── public/
│       └── case-basic.html
├── test/
│   └── registro-wizard.test.js
└── test_e2e/
    ├── wdio.conf.js
    ├── wdio.a11y.conf.js
    ├── features/
    │   ├── registro-wizard.feature
    │   └── registro-wizard-accessibility.feature
    ├── step-definitions/
    │   └── registro-wizard.steps.js
    └── pages/
        ├── registro-wizard.page.js
        └── demo.page.js`,
          },
          { type: 'heading', text: 'src/: el código real del componente' },
          {
            type: 'p',
            text: 'Aquí vive toda la lógica del componente. `src/registro-wizard.js` define la clase que extiende `LitElement` con `ComponentMixin`: declara las propiedades reactivas, el método `render()` y los estilos. `src/registro-wizard.styles.scss` contiene los estilos en SCSS.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ac-registro-wizard/src/registro-wizard.js',
            code: `import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';

import { RegistroWizardStyles } from './registro-wizard.styles.js';

export class RegistroWizard extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-registro-wizard';
  }

  static get styles() {
    return [componentBaseStyles, RegistroWizardStyles];
  }

  // ... properties, constructor y render()
}`,
          },
          {
            type: 'p',
            text: 'La línea que importa `RegistroWizardStyles` apunta a un archivo `.js` que no viene en la plantilla. Lo genera el script `component:build:styles` a partir del `.scss`, y se vuelve a generar cada vez que corres `component:serve`, `component:build` o `component:test`. Por eso no lo editas a mano: editas el `.scss`.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'ac-registro-wizard/src/registro-wizard.styles.scss',
            code: `:host {
  display: inline-block;
}

.registro-wizard {
  font-size: var(--font-size-md, 0.95rem);
}`,
          },
          { type: 'heading', text: 'index.js: el punto de entrada del paquete' },
          {
            type: 'p',
            text: 'Es el archivo que indica el campo `"main"` de `package.json`. Importa la clase desde `src/`, registra las traducciones y llama a `customElements.define`, que es lo que hace que la etiqueta `<ac-registro-wizard>` funcione en el navegador. Quien instale tu paquete hará `import` de él, y con eso se carga todo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ac-registro-wizard/index.js',
            code: `import locales from './locales.json' with { type: 'json' };
import { registerTranslations } from '@ac-base/ac-intl-mixin';
import { RegistroWizard } from './src/registro-wizard.js';

export { RegistroWizard } from './src/registro-wizard.js';

registerTranslations(RegistroWizard.is, locales);

// Auto-registro del componente
customElements.define(RegistroWizard.is, RegistroWizard);`,
          },
          { type: 'heading', text: 'locales.json: las traducciones' },
          {
            type: 'p',
            text: 'Guarda los textos que el componente puede mostrar, agrupados por idioma: `es-PE`, `en-EN` y `pt-BR`. Cada texto tiene una clave con el nombre base del componente, por ejemplo `registro-wizard-label`. Si le pasas esa clave a la propiedad `text`, el mixin busca el texto en el idioma activo con `this.t()`. Lo vas a usar más adelante, cuando tu componente tenga textos propios.',
          },
          { type: 'heading', text: 'demo/: la vitrina de desarrollo' },
          {
            type: 'p',
            text: 'La demo sirve para ver tu componente en el navegador mientras desarrollas, con `aclit component:serve`. No forma parte del paquete publicado. Tiene cuatro piezas. `index.html` es el punto de entrada de Vite: define la página con el elemento `ac-demo-content`, que pone el marco de la demo (nombre, tecnología, idiomas, modo oscuro) y en el que van los casos de uso.',
          },
          {
            type: 'code',
            lang: 'html',
            filename: 'ac-registro-wizard/demo/index.html',
            code: `<ac-demo-content
  name="ac-registro-wizard"
  tech="Lit v3"
  package-name="@ac-components/ac-registro-wizard"
  language="es-PE, en-EN"
  ambients="default"
  dark-mode
>
  <ac-demo-case header="Básico" href="case-basic.html"></ac-demo-case>
</ac-demo-content>`,
          },
          {
            type: 'p',
            text: '`demo.js` declara lo que carga la demo: importa tu componente desde `../index.js`, importa `ac-demo-content` y los tokens CSS de `ac-core`. Si necesitas otro componente de apoyo o un token adicional, lo agregas aquí. `demo-base.css` contiene los estilos del marco de la demo (fondo, tipografía, márgenes, clases como `.row`). Afecta a la página de demo, no a tu componente, cuyos estilos viven en `src/`.',
          },
          {
            type: 'p',
            text: 'La carpeta `public/` es la que Vite copia tal cual, sin procesarla. `case-basic.html` es un fragmento de HTML, sin `<!doctype>` ni `<head>`, y es el archivo al que apunta el atributo `href` de `<ac-demo-case>`. Ahí van los ejemplos de uso con la etiqueta real de tu componente.',
          },
          {
            type: 'code',
            lang: 'html',
            filename: 'ac-registro-wizard/demo/public/case-basic.html',
            code: `<section>
  <h2>Básico</h2>
  <div class="row">
    <ac-registro-wizard data-testid="registro-wizard-default">Hola</ac-registro-wizard>
  </div>
</section>`,
          },
          { type: 'heading', text: 'test/: pruebas unitarias' },
          {
            type: 'p',
            text: 'Las pruebas unitarias viven en `test/` y siguen el patrón `<nombre>.test.js`. `web-test-runner.config.js` busca `test/**/*.test.js`, las ejecuta en un navegador real y usa la interfaz TDD de Mocha: `suite` y `test` en lugar de `describe` e `it`. Las corres con `aclit component:test`. Cada prueba monta el componente con `fixture` de `@open-wc/testing` y revisa el resultado.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ac-registro-wizard/test/registro-wizard.test.js',
            code: `suite('ac-registro-wizard', () => {
  test('renders slotted content by default', async () => {
    const el = await fixture(html\`<ac-registro-wizard>Hola</ac-registro-wizard>\`);
    expect(el.textContent.trim()).to.equal('Hola');
  });

  // ... más pruebas
});`,
          },
          { type: 'heading', text: 'test_e2e/: pruebas de punta a punta' },
          {
            type: 'p',
            text: 'Estas pruebas abren la demo en un navegador real y hacen lo que haría una persona. Usan WebdriverIO para manejar el navegador y Cucumber para escribir los escenarios en lenguaje natural. Están divididas en tres carpetas que trabajan en cadena: `features/`, `step-definitions/` y `pages/`.',
          },
          {
            type: 'p',
            text: '`features/` tiene los escenarios en Gherkin, con las palabras clave `Feature`, `Scenario`, `Given`, `When` y `Then`. Hay dos archivos: `registro-wizard.feature`, con el flujo funcional, y `registro-wizard-accessibility.feature`, que revisa accesibilidad WCAG, incluido el modo oscuro. La etiqueta `@accessibility` separa a los dos grupos.',
          },
          {
            type: 'p',
            text: '`step-definitions/` tiene el código que ejecuta cada paso de Gherkin. Cada `Given`, `When` o `Then` que escribes en un feature necesita su implementación aquí, con el mismo texto. Si el texto no coincide, Cucumber no encuentra el paso.',
          },
          {
            type: 'p',
            text: '`pages/` aplica el patrón Page Object: encapsula cómo se encuentra un elemento en el DOM, para que los pasos no tengan selectores CSS sueltos. Así se ve la cadena completa para el escenario del caso básico.',
          },
          {
            type: 'code',
            lang: 'text',
            filename: 'ac-registro-wizard/test_e2e/features/registro-wizard.feature',
            code: 'Then el componente contiene el texto "Hola"',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ac-registro-wizard/test_e2e/step-definitions/registro-wizard.steps.js',
            code: `Then('el componente contiene el texto {string}', async function (expectedText) {
  const component = componentProvider.find(RegistroWizardPage);
  await component.waitForDisplayed();
  // ... compara el texto con expectedText
});`,
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ac-registro-wizard/test_e2e/pages/registro-wizard.page.js',
            code: `export class RegistroWizardPage extends ComponentObject {
  constructor() {
    super({ selector: '[data-testid="registro-wizard-default"]' });
  }
}`,
          },
          {
            type: 'p',
            text: 'Si cambias el `data-testid` en `demo/public/case-basic.html`, tienes que cambiarlo también en el page object, o el paso no encontrará el elemento. `demo.page.js` hace lo mismo con la página de la demo.',
          },
          {
            type: 'p',
            text: 'Los dos archivos de configuración de WebdriverIO definen qué corre cada grupo. `wdio.conf.js` ejecuta los features sin la etiqueta `@accessibility`, que son los funcionales. `wdio.a11y.conf.js` ejecuta solo los que sí la tienen, y revisa WCAG con axe-core. Ambos apuntan a `http://localhost:4173` (o a lo que digas en la variable `AC_E2E_BASE_URL`), donde `component:preview` sirve la demo ya construida. Por eso `aclit component:test:e2e` y `aclit component:test:e2e:a11y` compilan la demo, la levantan y corren las pruebas por ti.',
          },
          { type: 'heading', text: 'Archivos sueltos en la raíz' },
          {
            type: 'p',
            text: '`README.md` documenta el componente: instalación, propiedades, traducciones y comandos de desarrollo. Es el texto que verá quien lea tu paquete en npm.',
          },
          {
            type: 'p',
            text: '`vite.config.js` configura Vite para la demo. Define `root: demo` (la carpeta de la demo), el puerto 5173 para `component:serve` y `outDir: ../dist` para `component:build`, así que lo que se compila queda en `dist/` del proyecto.',
          },
          {
            type: 'p',
            text: '`web-test-runner.config.js` configura los tests unitarios: qué archivos buscar (`test/**/*.test.js`), cómo reportar los resultados y la interfaz TDD de Mocha.',
          },
          {
            type: 'note',
            text: 'Solo `src/`, `index.js` y `locales.json` se publican en npm, según la lista `files` de `package.json`. Las carpetas `demo/`, `test/` y `test_e2e/`, y los archivos `vite.config.js` y `web-test-runner.config.js`, no salen en el paquete. El `README.md` sí viaja, porque npm lo incluye siempre. No necesitas tocar `vite.config.js`, `web-test-runner.config.js` ni los archivos de WebdriverIO: son scaffolding ya resuelto. Modifícalos solo si tienes una necesidad muy puntual.',
          },
        ],
        checkpoint:
          'Puedes recorrer `ac-registro-wizard/` de arriba abajo y explicar para qué sirve cada carpeta (`src/`, `demo/`, `test/` y `test_e2e/`), cuál es el único código que se publica, y por qué el archivo principal se llama `registro-wizard.js` y no `__file_base__.js`.',
      },
      {
        id: 'construccion-02-first-component',
        title: '2. Instalar y declarar tu primer componente del catálogo',
        estimatedMinutes: 25,
        objective:
          'Vas a agregar una dependencia real del catálogo (`ac-input-basic`) a tu componente y declararla en tu `render()`, para ver un componente del catálogo funcionando dentro de tu propia demo.',
        content: [
          { type: 'heading', text: 'Un componente del catálogo es una dependencia más' },
          {
            type: 'p',
            text: 'Se instala, se importa por su efecto de registro y se declara directo en el HTML que devuelve tu `render()` -- exactamente igual que cualquier otra dependencia del monorepo. La única diferencia con un paquete externo es el protocolo `workspace:^`, porque vive en el mismo repo.',
          },
          { type: 'heading', text: 'Agrega la dependencia con pnpm add' },
          {
            type: 'p',
            text: 'Nunca edites a mano el rango de versión de una dependencia -- deja que `pnpm` lo resuelva. Como `ac-input-basic` vive en el mismo workspace que tu componente, `pnpm add` escribe solo el protocolo `workspace:^` en tu `package.json` (si el componente viviera afuera del monorepo, pnpm pondría el rango real publicado en npm, no `workspace:^`):',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'pnpm add @ac-components/ac-input-basic',
          },
          {
            type: 'p',
            text: 'Tu `package.json` queda así, sin que hayas tocado el archivo a mano:',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/package.json',
            code: '{\n  "dependencies": {\n    "@ac-base/ac-component-mixin": "workspace:^",\n    "@ac-base/ac-intl-mixin": "workspace:^",\n    "@ac-components/ac-input-basic": "workspace:^"\n  }\n}',
          },
          { type: 'heading', text: 'Impórtalo por su efecto de registro' },
          {
            type: 'p',
            text: 'Un import sin asignarlo a ninguna variable ejecuta el `customElements.define(...)` que trae el paquete -- después de esa línea, el tag ya existe para el navegador. Agrégalo arriba de `src/registro-wizard.js`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: "import '@ac-components/ac-input-basic';",
          },
          { type: 'heading', text: 'Declaralo directo en el render()' },
          {
            type: 'p',
            text: "Nunca `document.createElement('ac-input-basic')` ni montarlo a mano: en Lit, un componente hijo se escribe directo en el template `html` que devuelve `render()`, con sus propiedades como bindings. Así lo hace, en el código real del wizard, el campo de nombre del paso 1:",
          },
          {
            type: 'code',
            lang: 'js',
            filename:
              'catalog-site/lab-reference/ac-registro-wizard/src/elements/step-datos/registro-wizard-step-datos.js',
            code: "<ac-input-basic\n  label=${this.t('registro-wizard-nombre-label')}\n  .value=${this.nombre}\n  .error=${this.nombreError}\n  @ac-input-basic-input=${this._onNombreInput}\n></ac-input-basic>",
          },
          {
            type: 'p',
            text: '`label` es un atributo de texto plano -- un string que ya tradujiste con `this.t()`. `.value` y `.error` llevan el punto porque son properties de Lit: pasan el valor real, no su representación como string. Y `@ac-input-basic-input` escucha el evento propio que dispara `ac-input-basic` en cada tecla -- su `event.detail.value` es lo que vas a reemitir hacia arriba.',
          },
          {
            type: 'note',
            text: 'Si el componente no aparece, lo primero a revisar es que el tag que escribiste en el template sea idéntico al que devuelve el `static get is()` del paquete que importaste -- un typo ahí no tira ningún error: el navegador simplemente no reconoce el tag y lo trata como un elemento desconocido, sin estilos ni comportamiento.',
          },
        ],
        checkpoint:
          '`ac-input-basic` se ve dentro de tu componente (no al lado, como hermano, en el HTML de la demo) y escribir en el campo dispara su evento `ac-input-basic-input` -- visible con un `console.log` temporal en el handler o en el panel de eventos de las dev tools.',
      },
      {
        id: 'construccion-03-more-components-and-init',
        title: '3. Sumar el resto de componentes y construir `init()`',
        estimatedMinutes: 75,
        objective:
          'Vas a declarar en el `render()` todos los componentes del catálogo que tu wizard necesita (18 en total) y a escribir el método público `init()`, que simula una lectura inicial contra `ac-api-users`.',
        content: [
          { type: 'heading', text: 'ac-api-users vive en el template aunque no pinte nada' },
          {
            type: 'p',
            text: '`ac-api-users` no tiene interfaz visual: es un simulador de API, no un control de formulario. Pero para que puedas invocar sus métodos y recibir sus eventos, el navegador necesita el elemento montado de verdad en el DOM -- Lit solo crea y actualiza nodos para lo que declaras en el template que devuelve `render()`; un componente que nunca declaras ahí simplemente no existe, y no hay método que invocar sobre un elemento que no existe. Por eso se declara como un hijo más, aunque no renderice nada visible:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: '<ac-api-users\n  ${ref(this._apiUsersRef)}\n  version=${API_VERSION}\n  @ac-api-users-get-user-success=${this._onInitDataSuccess}\n  @ac-api-users-get-user-error=${this._onInitDataError}\n  @ac-api-users-register-success=${this._onRegisterSuccess}\n  @ac-api-users-register-error=${this._onRegisterError}\n></ac-api-users>',
          },
          { type: 'heading', text: 'Declara el resto de componentes del catálogo' },
          {
            type: 'p',
            text: 'La versión completa de referencia usa 18 componentes del catálogo en total, agrupados por dónde los vas a usar: estructura (`ac-transition-container`, `ac-expandable-multistep` + `ac-expandable-step`, `ac-modal-basic`), paso 1/datos (`ac-input-basic` x2, `ac-select-basic`), paso 2/preferencias (`ac-checkbox-basic`, `ac-switch-basic`, `ac-radio-basic`), paso 3/resumen (`ac-avatar-basic`, `ac-badge-basic`, `ac-text-basic`, `ac-divider-basic`) y transversales (`ac-button-basic`, `ac-tooltip-basic`, `ac-spinner-basic`, `ac-notification-basic`), más `ac-api-users` del paso anterior. Cada uno sigue exactamente el mismo patrón de tres pasos que ya usaste con `ac-input-basic` en el laboratorio anterior: se agrega a `dependencies` con `workspace:^`, se importa por su efecto de registro arriba del archivo, y se declara directo en el `render()` -- ningún `document.createElement`, ningún componente montado a mano.',
          },
          {
            type: 'heading',
            text: 'createRef() y ref(): invocar un método, no solo leer una property',
          },
          {
            type: 'p',
            text: 'Un binding `.prop=${valor}` solo sirve para pasarle datos a un hijo de forma declarativa: Lit se encarga de escribirlo en la property cada vez que `valor` cambia, pero nunca te da acceso al nodo en sí. El problema es que `obtenerDatosUsuario(...)` no es una property que puedas bindear -- es un MÉTODO que necesitas invocar en un momento preciso (cuando corre `init()`), no cada vez que el componente vuelve a renderizar. Para eso existe `ref()`: te da una referencia real al elemento del DOM, resuelta por Lit en el momento correcto del ciclo de render, sin que tengas que buscarlo a mano con `querySelector` ni arriesgarte a que todavía no exista.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: "import { createRef, ref } from 'lit/directives/ref.js';",
          },
          {
            type: 'p',
            text: 'En el constructor, cada ref arranca como un contenedor vacío hasta que el template se renderiza por primera vez:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: 'constructor() {\n  super();\n  this._infoOpen = false;\n  this._resetState();\n  this._apiUsersRef = createRef();\n  this._stepsRef = createRef();\n}',
          },
          {
            type: 'p',
            text: 'Y en el template, `${ref(this._apiUsersRef)}` (el que ya viste en el bloque de `ac-api-users` de arriba) es lo que conecta esa referencia con el nodo real una vez que existe en el DOM -- después de eso, `this._apiUsersRef.value` ES el elemento `<ac-api-users>`, con todos sus métodos disponibles.',
          },
          { type: 'heading', text: 'Escribe init()' },
          {
            type: 'p',
            text: 'El método público `init()` es la única llamada de LECTURA del wizard -- distinta del método de GUARDADO que vas a cablear en un laboratorio posterior. Usa la referencia para invocar `obtenerDatosUsuario` sobre el mock, con el id de usuario simulado que importa de `utils/constants.js` (`INIT_USER_ID`, que vale `1`), exactamente como lo haría cualquier app consumidora al montar el componente:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: 'init() {\n  this._apiUsersRef.value?.obtenerDatosUsuario(INIT_USER_ID);\n}',
          },
          {
            type: 'note',
            text: 'El `?.` importa: la primera vez que el componente se conecta, el template todavía puede no haberse renderizado y `this._apiUsersRef.value` sigue siendo `undefined`. Sin el optional chaining, llamar `init()` demasiado pronto lanzaría un error en vez de simplemente no hacer nada todavía. Nunca reemplaces este patrón por `this.shadowRoot.querySelector(...)`.',
          },
        ],
        checkpoint:
          'Con la demo abierta, llamar `wizard.init()` dispara la lectura simulada contra `ac-api-users` sin ningún error en consola -- puedes confirmarlo con un `console.log` temporal dentro del handler de éxito, o viendo que el estado interno del wizard cambia.',
      },
      {
        id: 'construccion-04-private-methods',
        title: '4. Separar la lógica interna en métodos privados',
        estimatedMinutes: 50,
        objective:
          'Entender por qué la API pública de un componente real se reduce a 2 métodos (`init()`/`reset()`) y mover toda la lógica interna a métodos privados con prefijo `_`, usando `state: true` para el estado que no es API pública.',
        content: [
          { type: 'heading', text: 'Solo dos métodos públicos' },
          {
            type: 'p',
            text: 'La clase completa de `ac-registro-wizard` expone exactamente 2 métodos sin prefijo: `init()` (dispara la lectura inicial contra `ac-api-users`) y `reset()` (vuelve todo el wizard a su estado inicial). Todo lo demás -- cada handler de evento, el armado del payload de guardado, la reacción a éxito/error -- lleva el prefijo `_` y es lógica interna que nadie fuera del componente necesita invocar.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  init() {
    this._apiUsersRef.value?.obtenerDatosUsuario(INIT_USER_ID);
  }

  reset() {
    this._resetState();
    this._stepsRef.value?.reset();
    this._emit('ac-registro-wizard-reset');
  }`,
          },
          { type: 'heading', text: 'Estado interno: `state: true`, nunca `type`/`reflect`' },
          {
            type: 'p',
            text: 'Cada property que guarda estado interno del wizard (el valor de un campo, si el modal está abierto, si se está guardando) se declara con `{ state: true }` en `static get properties()`. Las 13 properties de este wizard son así -- ninguna usa `type`/`reflect`, porque su API pública completa son los 2 métodos de arriba, sin ninguna property propia. Eso no es la regla general del catálogo: `ac-modal-basic`, por ejemplo (laboratorio 7), SÍ tiene una property pública real con `type: Boolean, reflect: true` (su `open`, que necesita verse como atributo HTML). `state: true` le dice a Lit "esto dispara un re-render, pero no es un atributo ni una API pública" -- lo que corresponde cuando, como acá, el dato es puramente interno.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  static get properties() {
    return {
      _open: { state: true },           // transición raíz visible -- arranca en true, este wizard ES la pantalla raíz
      _modalOpen: { state: true },      // modal de éxito visible
      _infoOpen: { state: true },       // modal de info general visible
      _nombre: { state: true },
      _email: { state: true },
      _rol: { state: true },
      _notificaciones: { state: true },
      _terminos: { state: true },
      _plan: { state: true },           // default PLAN_MENSUAL
      _loading: { state: true },        // llamada de guardado en curso
      _errorMessage: { state: true },
      _welcomeUser: { state: true },    // datos de bienvenida precargados por init()
      _registeredUser: { state: true }, // datos ya registrados, para el modal de éxito
    };
  }`,
          },
          { type: 'heading', text: 'Qué va en un método separado vs. una línea inline' },
          {
            type: 'p',
            text: 'El criterio es simple: si un handler solo lee un valor del evento y lo guarda (`this._nombre = event.detail.value`), puede quedar en una línea dentro del propio handler. Pero si hace algo más -- validar, armar un payload, decidir qué otras properties cambian -- va en un método privado con nombre propio. Mira `_onConfirmClick`: valida `_terminos`, y solo si pasa arma el objeto que le manda a `registrarUsuario`. Y `_onRegisterSuccess`: no es solo "guardar el dato", son 4 cambios de estado coordinados más la emisión de un evento propio.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  _onConfirmClick() {
    if (!this._terminos) {
      this._errorMessage = this.t('registro-wizard-terminos-error');
      return;
    }
    this._errorMessage = '';
    this._loading = true;
    this._apiUsersRef.value?.registrarUsuario({
      nombre: this._nombre,
      email: this._email,
      rol: this._rol || DEFAULT_ROL,
    });
  }

  _onRegisterSuccess(event) {
    this._loading = false;
    this._errorMessage = '';
    this._registeredUser = event.detail.data;
    this._open = false;
    this._modalOpen = true;
    this._emit('ac-registro-wizard-register-success', { data: event.detail.data });
  }`,
          },
          {
            type: 'note',
            text: 'Todas las properties de estado se inicializan juntas en `_resetState()`, un método privado que el constructor llama una vez y que `reset()` reutiliza más adelante -- así nunca hay dos lugares distintos decidiendo cuál es el valor inicial de una property.',
          },
        ],
        checkpoint:
          'Revisando la clase, los únicos dos métodos sin `_` son `init` y `reset`; cada property de estado interno usa `{ state: true }`, y `_onConfirmClick`/`_onRegisterSuccess` muestran por qué una lógica con más de un paso va en su propio método privado.',
      },
      {
        id: 'construccion-05-declarative-events',
        title: '5. Cablear cada evento de forma declarativa',
        estimatedMinutes: 75,
        objective:
          'Dominar las dos caras del mismo patrón: escuchar eventos de los hijos con bindings `@evento=${...}` directo en el template, y emitir los eventos propios del componente con un único método `_emit(name, detail)` -- sin que aparezca nunca un `addEventListener` imperativo.',
        content: [
          { type: 'heading', text: 'Escuchar: bindings declarativos, nunca addEventListener' },
          {
            type: 'p',
            text: 'El padre de este wizard no escucha por separado los eventos de cada campo del formulario (nombre, email, rol, notificaciones, términos, plan): esa complejidad vive en un único hijo, `<registro-wizard-steps>`, que consolida los 3 pasos y emite eventos ya resueltos. El padre solo pone un `@evento=${this._handler}` por cada uno, directo en el template -- igual que hace con los 4 eventos de `<ac-api-users>` (2 de lectura inicial, 2 de guardado).',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js (render())',
            code: `      <ac-api-users
        \${ref(this._apiUsersRef)}
        version=\${API_VERSION}
        @ac-api-users-get-user-success=\${this._onInitDataSuccess}
        @ac-api-users-get-user-error=\${this._onInitDataError}
        @ac-api-users-register-success=\${this._onRegisterSuccess}
        @ac-api-users-register-error=\${this._onRegisterError}
      ></ac-api-users>`,
          },
          {
            type: 'p',
            text: 'Y así se ve el binding con `<registro-wizard-steps>`: 8 propiedades que bajan por `.prop=${...}` y 8 eventos que suben por `@evento=${...}`, todos en el mismo elemento. Ninguno de los dos lados necesita código imperativo -- Lit vuelve a conectar los bindings en cada render, así que no hay que preocuparse por "desconectar" nada.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js (render())',
            code: `          <registro-wizard-steps
            \${ref(this._stepsRef)}
            .nombre=\${this._nombre}
            .email=\${this._email}
            .rol=\${this._rol}
            .welcomeName=\${this._welcomeUser?.nombre ?? ''}
            .terminos=\${this._terminos}
            .notificaciones=\${this._notificaciones}
            .plan=\${this._plan}
            .loading=\${this._loading}
            @registro-wizard-steps-nombre-change=\${this._onNombreInput}
            @registro-wizard-steps-email-change=\${this._onEmailInput}
            @registro-wizard-steps-rol-change=\${this._onRolChange}
            @registro-wizard-steps-terminos-change=\${this._onTerminosChange}
            @registro-wizard-steps-notificaciones-change=\${this._onNotificacionesChange}
            @registro-wizard-steps-plan-change=\${this._onPlanChange}
            @registro-wizard-steps-confirm-click=\${this._onConfirmClick}
            @registro-wizard-steps-step-change=\${this._onStepsStepChange}
          ></registro-wizard-steps>`,
          },
          { type: 'heading', text: 'Emitir: un único `_emit(name, detail)`' },
          {
            type: 'p',
            text: 'Para el otro sentido -- avisar hacia afuera que algo pasó -- todo el componente pasa por un solo método privado. Es el único lugar de la clase que construye un `CustomEvent` a mano; cualquier otro método que necesite avisar algo lo llama a él, nunca repite el `new CustomEvent(...)` por su cuenta.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }`,
          },
          {
            type: 'note',
            text: 'Nunca vas a ver un `addEventListener` imperativo en este patrón (ni en `connectedCallback` ni en ningún otro lado): si necesitas escuchar algo, el binding `@evento=${...}` va en el template, junto al elemento que lo dispara. Eso mantiene cada escucha visible en un solo lugar, atada al propio `render()` -- sin riesgo de dejar un listener colgado si el elemento se quita del DOM.',
          },
        ],
        checkpoint:
          'Buscar `addEventListener` en `src/registro-wizard.js` no devuelve ningún resultado: los 4 eventos de `ac-api-users` y los 8 de `registro-wizard-steps` se escuchan con bindings `@evento` en el template, y `_emit(name, detail)` es el único lugar de la clase que crea un `CustomEvent`.',
      },
      {
        id: 'construccion-06-styles',
        title: '6. Aplicar tus propios estilos desde `.scss`',
        estimatedMinutes: 35,
        objective:
          'Escribir `src/registro-wizard.styles.scss`, compilarlo al módulo `.styles.js` que Lit consume con el script `component:build:styles` de `@ac-base/cli`, y agregarlo a `static get styles()` junto a `componentBaseStyles`.',
        content: [
          {
            type: 'heading',
            text: 'El pipeline: `.scss` -> `.styles.js` -> `static get styles()`',
          },
          {
            type: 'p',
            text: 'Ningún componente del catálogo escribe CSS directo en el JS. El flujo es siempre el mismo: escribes un archivo `.scss` normal, un script lo compila a un módulo `.js` que exporta un `css` de Lit, y ese archivo compilado (que nunca se versiona, está en `.gitignore`) se importa en el componente. Así se ve el `.scss` real de este wizard -- 18 líneas, sin nada exótico: dos reglas de `:host` y una clase para el layout del body, usando tokens de `@ac-base/ac-core` con un valor de respaldo después de la coma.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'src/registro-wizard.styles.scss',
            code: `:host {
  display: block;
  box-sizing: border-box;
  max-width: 100%;
}

:host([hidden]) {
  display: none;
}

.registro-wizard__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4, 1rem);
  padding: var(--space-4, 1rem);
  box-sizing: border-box;
  max-width: 100%;
}`,
          },
          { type: 'heading', text: 'Compilar: `component:build:styles`' },
          {
            type: 'p',
            text: 'El `package.json` que generó el CLI en el laboratorio 1 ya trae el script `component:build:styles` -- no hace falta escribirlo, solo correrlo. Por debajo, ese script llama al compilador de `@ac-base/cli` con 3 argumentos: el `.scss` de entrada, el `.js` de salida y el nombre de la constante que exporta.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs src/registro-wizard.styles.scss src/registro-wizard.styles.js RegistroWizardStyles',
          },
          { type: 'heading', text: 'Usarlo: importar y sumarlo a `static get styles()`' },
          {
            type: 'p',
            text: 'El archivo compilado exporta la constante que le pasaste como tercer argumento (`RegistroWizardStyles`). Se importa una sola vez arriba del componente y se agrega al arreglo que devuelve `static get styles()`, junto a `componentBaseStyles` -- el mismo `componentBaseStyles` que ya trae el scaffold desde el laboratorio 1, con los estilos base que comparte todo el catálogo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `import { RegistroWizardStyles } from './registro-wizard.styles.js';

// ...

  static get styles() {
    return [componentBaseStyles, RegistroWizardStyles];
  }`,
          },
          {
            type: 'note',
            text: '`src/registro-wizard.styles.js` nunca se versiona -- si cambias de máquina o clonas el repo de nuevo, el componente va a renderizar sin estilos hasta que corras `component:build:styles` otra vez. `pnpm --filter <tu-paquete> run component:serve` ya corre ese script en modo watch en paralelo (vía `concurrently`, generado por el CLI), así que cada guardado del `.scss` recompila y recarga la demo sola.',
          },
        ],
        checkpoint:
          'La demo refleja el espaciado y el layout del `.scss` (gap y padding del body, sin nada de eso en el HTML), `static get styles()` incluye `componentBaseStyles` y `RegistroWizardStyles`, y guardar el `.scss` con `component:serve` corriendo recarga la demo sin que hayas tocado nada más.',
      },
      {
        id: 'construccion-07-modal',
        title: '7. Sumar `ac-modal-basic` para la confirmación final',
        estimatedMinutes: 25,
        objective:
          'Entender cómo `ac-modal-basic` reacciona a eventos (nunca se cierra solo) y por qué su contenido real vive en un componente hijo aparte, no inline en el padre.',
        content: [
          { type: 'heading', text: '`ac-modal-basic` no decide nada por su cuenta' },
          {
            type: 'p',
            text: 'Igual que `ac-transition-container`, `ac-modal-basic` solo dispara eventos cuando el usuario toca sus botones -- quien lo consume decide qué hacer con cada uno. El modal de éxito del wizard usa `size="full"`, un `header` y un `primary-text` traducibles con `this.t()`, y se abre/cierra con una property privada de estado: `_modalOpen`. Así se declara en `registro-wizard.js`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<ac-modal-basic
  ?open=\${this._modalOpen}
  size="full"
  header=\${this.t('registro-wizard-modal-header')}
  primary-text=\${this.t('registro-wizard-modal-primary')}
  @ac-modal-basic-primary-click=\${this._onModalPrimaryClick}
>
  <registro-wizard-modal-resultado
    .userId=\${this._registeredUser?.id ?? null}
    .nombre=\${this._registeredUser?.nombre ?? ''}
    .email=\${this._registeredUser?.email ?? ''}
    .rol=\${this._registeredUser?.rol ?? ''}
  ></registro-wizard-modal-resultado>
</ac-modal-basic>`,
          },
          {
            type: 'p',
            text: 'El click en "Cerrar" dispara `@ac-modal-basic-primary-click`, que llama a `_onModalPrimaryClick`. En la versión final ese método también reinicia todo el formulario -- el detalle completo de `reset()` lo armas en el laboratorio 10:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onModalPrimaryClick() { this._modalOpen = false; this.reset(); }`,
          },
          { type: 'heading', text: 'El contenido real vive en un componente hijo' },
          {
            type: 'p',
            text: '`ac-modal-basic` solo aporta la estructura (overlay, header, botones). Lo que se ve adentro -- avatar, mensaje, badge del rol -- es un componente propio, `registro-wizard-modal-resultado`, que recibe cuatro properties planas (`userId`, `nombre`, `email`, `rol`) y no dispara ningún evento: es puramente de presentación. Fíjate que su `render()` no pinta nada hasta tener un nombre real, para no mostrar el modal vacío un instante antes de que lleguen los datos:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/modal-resultado/registro-wizard-modal-resultado.js',
            code: `render() {
  if (!this.nombre) return html\`\`;

  return html\`
    <div class="registro-wizard-modal-resultado__content">
      <ac-avatar-basic name=\${this.nombre} size="lg"></ac-avatar-basic>
      <ac-text-basic tag="p" size="lg"
        >Usuario #\${this.userId} registrado con éxito.</ac-text-basic
      >
      <ac-text-basic tag="p" size="md">\${this.nombre} · \${this.email}</ac-text-basic>
      <ac-badge-basic ambient="success">\${ROL_BADGE_LABEL[this.rol] ?? this.rol}</ac-badge-basic>
    </div>
  \`;
}`,
          },
          { type: 'heading', text: 'El mismo patrón, para un segundo modal' },
          {
            type: 'p',
            text: 'El wizard tiene un segundo modal, abierto desde el ícono ⓘ de la cabecera: `registro-wizard-modal-info`, con información general sobre el flujo. Es un hermano del modal de éxito dentro de `registro-wizard.js` -- mismo `ac-modal-basic` como estructura, mismo criterio de delegar el contenido a un componente hijo, solo que este no recibe ninguna property (es texto estático traducido con `this.t()`) ni dispara eventos:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<ac-modal-basic
  ?open=\${this._infoOpen}
  header=\${this.t('registro-wizard-info-title')}
  @ac-modal-basic-close=\${this._onInfoModalClose}
>
  <registro-wizard-modal-info></registro-wizard-modal-info>
</ac-modal-basic>`,
          },
          {
            type: 'note',
            text: 'El patrón se repite en todo el catálogo: un componente estructural (`ac-modal-basic`) que solo sabe abrir/cerrar y emitir eventos, más un componente hijo liviano y sin lógica propia que aporta el contenido real. Separar así evita que `ac-modal-basic` tenga que conocer los datos de cada caso de uso que lo consume.',
          },
        ],
        checkpoint:
          'Puedes explicar por qué `ac-modal-basic` no decide solo cuándo cerrarse, qué cuatro properties recibe `registro-wizard-modal-resultado` y por qué su `render()` no pinta nada sin un nombre, y qué patrón comparte con `registro-wizard-modal-info`.',
      },
      {
        id: 'construccion-08-transition-container',
        title: '8. Envolver todo el flujo en `ac-transition-container`',
        estimatedMinutes: 35,
        objective:
          'Entender por qué `_open` arranca en `true` en este wizard (no hay pantalla "anterior"), qué hace `hide-menu-icon` y qué decide hacer el componente cuando la flecha de volver -- fija, no se puede ocultar -- recibe un click.',
        content: [
          { type: 'heading', text: 'Este wizard ES la pantalla raíz' },
          {
            type: 'p',
            text: 'En un uso típico de `ac-transition-container` hay una navegación real: un menú, y una sub-pantalla a la que se entra con una transición. Acá no: el wizard completo es la pantalla raíz, visible desde que el componente se monta, sin ningún botón "Abrir" previo. Por eso `_open` arranca en `true` -- no en `false` esperando un click -- y así queda declarado en el estado y pasado al contenedor:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `static get properties() {
  return {
    // ...
    _open: { state: true },   // transición raíz visible -- arranca en true, este wizard ES la pantalla raíz, no tiene "anterior"
    // ...
  };
}

_resetState() {
  this._open = true;
  this._modalOpen = false;
  // ... el resto de las properties privadas vuelven a su valor inicial
}`,
          },
          { type: 'heading', text: '`hide-menu-icon` sí, la flecha de volver no' },
          {
            type: 'p',
            text: '`hide-menu-icon` oculta el ícono de hamburguesa cuando el flujo no lo necesita. La flecha de volver, en cambio, es fija: `ac-transition-container` siempre la muestra, y tu componente siempre tiene que decidir qué hacer con su click -- aunque la decisión sea "reiniciar" en vez de "navegar hacia atrás", porque acá no existe una pantalla anterior real. El `slot="header-end"` deja sumar una acción extra a la cabecera -- en este caso, el ícono de información que abre el segundo modal del laboratorio 7:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<ac-transition-container
  ?open=\${this._open}
  header-text=\${this.t('registro-wizard-header-text')}
  hide-menu-icon
  @ac-transition-container-header-back-icon-click=\${this._onBackIconClick}
>
  <ac-icon-button-basic slot="header-end" name="info" ambient="secondary"
    a11y-label=\${this.t('registro-wizard-info-aria')}
    @click=\${this._onInfoIconClick}
  ></ac-icon-button-basic>
  <div class="registro-wizard__body">
    <!-- ... el resto del flujo, ver laboratorio 9 ... -->
  </div>
</ac-transition-container>`,
          },
          {
            type: 'p',
            text: 'Los dos handlers son deliberadamente simples: la flecha de volver reinicia todo el flujo en vez de navegar, y el ícono de información solo abre el modal que ya conoces del laboratorio 7.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onBackIconClick() { this.reset(); }   // este wizard no tiene pantalla anterior: la flecha de volver reinicia el flujo
_onInfoIconClick() { this._infoOpen = true; }`,
          },
          {
            type: 'note',
            text: '`<ac-api-users>` y los dos `<ac-modal-basic>` son hermanos de `ac-transition-container`, nunca van anidados dentro de su contenido -- en el laboratorio 10 vas a ver el bug real que eso evita.',
          },
        ],
        checkpoint:
          'Puedes explicar por qué `_open` arranca en `true`, qué diferencia hay entre `hide-menu-icon` (opcional) y la flecha de volver (fija), qué hace `_onBackIconClick` en este wizard puntual y para qué sirve el slot `header-end`.',
      },
      {
        id: 'construccion-09-multistep',
        title: '9. Convertir el flujo interno en multipasos',
        estimatedMinutes: 75,
        objective:
          'Entender cómo `registro-wizard-steps` encapsula el multistep interno (`ac-expandable-multistep` + 3 `ac-expandable-step`) y expone hacia su padre una API simple -- properties planas y eventos ya consolidados -- en vez de que el padre tenga que lidiar con cada paso individual.',
        content: [
          { type: 'heading', text: 'Un componente hijo que encapsula todo el multistep' },
          {
            type: 'p',
            text: 'El multistep interno no vive dentro de `registro-wizard.js`: vive en un componente propio, `registro-wizard-steps`. El padre no conoce `ac-expandable-multistep` ni los 3 pasos individuales -- solo le pasa sus datos como properties planas (`.nombre`, `.email`, `.rol`, ...) y escucha un puñado de eventos ya consolidados:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<registro-wizard-steps
  \${ref(this._stepsRef)}
  .nombre=\${this._nombre} .email=\${this._email} .rol=\${this._rol}
  .welcomeName=\${this._welcomeUser?.nombre ?? ''}
  .terminos=\${this._terminos} .notificaciones=\${this._notificaciones} .plan=\${this._plan}
  .loading=\${this._loading}
  @registro-wizard-steps-confirm-click=\${this._onConfirmClick}
  @registro-wizard-steps-step-change=\${this._onStepsStepChange}
></registro-wizard-steps>`,
          },
          { type: 'heading', text: 'Puertas adentro: el multistep coordina, los 3 pasos emiten' },
          {
            type: 'p',
            text: 'Dentro de `registro-wizard-steps` sí aparece `ac-expandable-multistep` con sus 3 `ac-expandable-step`, cada uno con una `createRef()` propia. El contenido real de cada paso es, a su vez, otro componente hijo (`registro-wizard-step-datos`, `-step-preferencias`, `-step-resumen`). Este es el `render()` completo:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `render() {
  return html\`
    <ac-expandable-multistep
      @ac-expandable-multistep-active-step-change=\${this._onMultistepStepChange}
    >
      <ac-expandable-step
        \${ref(this._step1Ref)}
        header=\${this.t('registro-wizard-step1-header')}
        active
      >
        <registro-wizard-step-datos
          .nombre=\${this.nombre}
          .email=\${this.email}
          .rol=\${this.rol}
          .nombreError=\${this._nombreError}
          .welcomeName=\${this.welcomeName}
          @registro-wizard-step-datos-nombre-input=\${this._onNombreInput}
          @registro-wizard-step-datos-email-input=\${this._onEmailInput}
          @registro-wizard-step-datos-rol-change=\${this._onRolChange}
          @registro-wizard-step-datos-next-click=\${this._onStep1NextClick}
        ></registro-wizard-step-datos>
      </ac-expandable-step>

      <ac-expandable-step \${ref(this._step2Ref)} header=\${this.t('registro-wizard-step2-header')}>
        <registro-wizard-step-preferencias
          .terminos=\${this.terminos}
          .notificaciones=\${this.notificaciones}
          .plan=\${this.plan}
          @registro-wizard-step-preferencias-terminos-change=\${this._onTerminosChange}
          @registro-wizard-step-preferencias-notificaciones-change=\${this._onNotificacionesChange}
          @registro-wizard-step-preferencias-plan-change=\${this._onPlanChange}
          @registro-wizard-step-preferencias-next-click=\${this._onStep2NextClick}
        ></registro-wizard-step-preferencias>
      </ac-expandable-step>

      <ac-expandable-step \${ref(this._step3Ref)} header=\${this.t('registro-wizard-step3-header')}>
        <registro-wizard-step-resumen
          .nombre=\${this.nombre}
          .email=\${this.email}
          .rol=\${this.rol}
          .plan=\${this.plan}
          .notificaciones=\${this.notificaciones}
          .loading=\${this.loading}
          @registro-wizard-step-resumen-confirm-click=\${this._onConfirmClick}
        ></registro-wizard-step-resumen>
      </ac-expandable-step>
    </ac-expandable-multistep>
  \`;
}`,
          },
          {
            type: 'p',
            text: 'El paso 1 nunca avanza solo: `registro-wizard-steps` valida nombre/correo y, si pasan, llama al método público `complete()` del step por `ref()` -- nunca asigna `active`/`completed` a mano, porque eso no pasa por el flujo reactivo que escucha `ac-expandable-multistep`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `_onStep1NextClick() {
  if (!this.nombre.trim() || !this.email.trim()) {
    this._nombreError = this.t('registro-wizard-nombre-error');
    return;
  }
  this._step1Ref.value?.complete();
}`,
          },
          {
            type: 'heading',
            text: 'Hacia abajo: cada paso delega en su propio componente de contenido',
          },
          {
            type: 'p',
            text: '`registro-wizard-step-datos` (paso 1) no guarda ningún estado propio de los datos: recibe `nombre`/`email`/`rol`/`nombreError`/`welcomeName` por property y reemite cada interacción como un evento propio, siempre con el mismo método `_emit` que ya viste en `registro-wizard.js`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/step-datos/registro-wizard-step-datos.js',
            code: `_onNombreInput(event) {
  this._emit('registro-wizard-step-datos-nombre-input', { value: event.detail.value });
}

_onNextClick() {
  this._emit('registro-wizard-step-datos-next-click');
}

_emit(name, detail = {}) {
  this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
}`,
          },
          {
            type: 'p',
            text: 'El paso 3 (`registro-wizard-step-resumen`) hace lo mismo con el botón "Confirmar": mientras `loading` es `true` (una property que le llega desde el padre, a través de `registro-wizard-steps`), muestra un spinner en vez del botón:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/step-resumen/registro-wizard-step-resumen.js',
            code: `\${
  this.loading
    ? html\`<ac-spinner-basic size="md" ambient="primary"></ac-spinner-basic>\`
    : html\`<ac-button-basic
        ambient="primary"
        @ac-button-basic-click=\${this._onConfirmClick}
        >\${this.t('registro-wizard-confirm')}</ac-button-basic
      >\`
}`,
          },
          { type: 'heading', text: 'Hacia arriba: la API simple que ve el padre' },
          {
            type: 'p',
            text: '`registro-wizard-steps` reemite cada evento de hoja (y el cambio de paso del multistep) como su propio evento namespaced -- `registro-wizard-steps-nombre-change`, `-email-change`, `-rol-change`, `-terminos-change`, `-notificaciones-change`, `-plan-change`, `-confirm-click` y `-step-change`. Así, `registro-wizard.js` nunca escucha nada de los 3 pasos individuales, solo de este único componente:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `_onMultistepStepChange(event) {
  this._emit('registro-wizard-steps-step-change', {
    step: event.detail.stepNumber,
    totalSteps: event.detail.totalSteps,
  });
}`,
          },
          {
            type: 'note',
            text: 'Composición real en tres niveles: el padre (`registro-wizard`) coordina estado y guardado; el hijo compuesto (`registro-wizard-steps`) coordina la navegación entre pasos; los hijos de hoja (`step-datos`/`-preferencias`/`-resumen`) no guardan nada, solo muestran y emiten. Cada nivel expone una API más chica que el nivel de abajo.',
          },
        ],
        checkpoint:
          'Puedes explicar qué hace automáticamente `ac-expandable-multistep`, por qué `registro-wizard-steps` llama a `step.complete()` por `ref()` en vez de asignar `active`/`completed` a mano, y cómo ese mismo componente expone hacia `registro-wizard.js` properties planas y eventos consolidados en vez de obligar al padre a tratar con cada paso.',
      },
      {
        id: 'construccion-10-close-the-loop',
        title: '10. Cerrar el ciclo: guardar, confirmar y `reset()`',
        estimatedMinutes: 105,
        objective:
          'Recorrer el flujo completo de guardado -- validación, llamada simulada, éxito, error -- y entender por qué `reset()` tiene que resetear también al componente hijo de pasos, no solo al padre.',
        content: [
          { type: 'heading', text: 'El flujo completo de "Confirmar"' },
          {
            type: 'p',
            text: 'El evento `registro-wizard-steps-confirm-click` (el que armaste en el laboratorio 9) llega a `_onConfirmClick`, en `registro-wizard.js`. Antes de llamar a la API, valida que se hayan aceptado los términos -- si no, fija un mensaje de error y no llama a nada:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onConfirmClick() {
  if (!this._terminos) {
    this._errorMessage = this.t('registro-wizard-terminos-error');
    return;
  }
  this._errorMessage = '';
  this._loading = true;
  this._apiUsersRef.value?.registrarUsuario({
    nombre: this._nombre,
    email: this._email,
    rol: this._rol || DEFAULT_ROL,
  });
}`,
          },
          { type: 'heading', text: 'Éxito: cerrar la transición, abrir el modal' },
          {
            type: 'p',
            text: 'Cuando `ac-api-users` responde con éxito, `_onRegisterSuccess` guarda los datos reales, cierra la transición raíz del laboratorio 8 y abre el modal del laboratorio 7 -- en el mismo gesto:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onRegisterSuccess(event) {
  this._loading = false;
  this._errorMessage = '';
  this._registeredUser = event.detail.data;
  this._open = false;       // cierra la transición
  this._modalOpen = true;   // abre el modal de éxito
  this._emit('ac-registro-wizard-register-success', { data: event.detail.data });
}`,
          },
          { type: 'heading', text: 'Error: solo un mensaje, nada se cierra' },
          {
            type: 'p',
            text: 'Si la llamada falla, `_onRegisterError` solo fija `_errorMessage` -- nunca toca `_open` ni `_modalOpen`, para que la transición se quede abierta y el usuario pueda reintentar sin perder lo que ya escribió. El mensaje se muestra con un `ac-notification-basic` inline, declarado como hermano del resto del cuerpo:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onRegisterError(event) {
  this._loading = false;
  this._errorMessage = event.detail.error?.message ?? this.t('registro-wizard-register-error');
  this._emit('ac-registro-wizard-register-error', { error: event.detail.error });
}`,
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `\${this._errorMessage
  ? html\`<ac-notification-basic ambient="danger" .message=\${this._errorMessage} @ac-notification-basic-dismiss-click=\${this._onDismissError}></ac-notification-basic>\`
  : ''}`,
          },
          { type: 'heading', text: '`reset()` real: resetea al padre Y al hijo de pasos' },
          {
            type: 'p',
            text: 'El botón "Cerrar" del modal (laboratorio 7) y la flecha de volver (laboratorio 8) llaman, los dos, a `reset()`. Ese método no solo restaura las properties privadas del padre -- también llama a `reset()` sobre `registro-wizard-steps`, por la misma `createRef()` que ya usas para llamar `init()`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `reset() {
  this._resetState();
  this._stepsRef.value?.reset();
  this._emit('ac-registro-wizard-reset');
}`,
          },
          {
            type: 'p',
            text: 'Ese segundo `reset()` -- el de `registro-wizard-steps` -- es el que devuelve los 3 `ac-expandable-step` a su estado inicial (paso 1 activo, pasos 2 y 3 ni completados ni activos):',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `reset() {
  this._nombreError = '';
  if (this._step1Ref.value) {
    this._step1Ref.value.completed = false;
    this._step1Ref.value.active = true;
  }
  if (this._step2Ref.value) {
    this._step2Ref.value.completed = false;
    this._step2Ref.value.active = false;
  }
  if (this._step3Ref.value) {
    this._step3Ref.value.completed = false;
    this._step3Ref.value.active = false;
  }
}`,
          },
          {
            type: 'note',
            text: 'El bug real que esto evita: si `reset()` del padre solo restaurara sus propias properties (nombre, correo, rol...) sin llamar también al `reset()` de `registro-wizard-steps`, el formulario se vería "vacío" por fuera -- pero el multistep seguiría mostrando el paso 3 (resumen) activo por dentro, con datos que ya no existen. Resetear un componente compuesto significa resetear también a sus hijos con estado propio, no solo al estado que vive en el padre.',
          },
        ],
        checkpoint:
          'Puedes trazar el ciclo completo (confirmar → loading → éxito o error) citando los cuatro métodos reales, y explicar por qué `reset()` del padre tiene que llamar también al `reset()` de `registro-wizard-steps`, con el bug concreto que eso evita.',
      },
    ],
  },
  {
    id: 'testing-unitario',
    title: 'Capítulo 2 — Testing unitario',
    summary:
      'Cubre con tests reales el componente que construiste en el Capítulo 1: la convención suite/test de ac-lit, cómo correr y leer la suite de un paquete, y cómo testear estado inicial y flujos asíncronos con fixture(), oneEvent() y los helpers del archivo de tests.',
    estimatedMinutes: 150,
    outcomes: [
      'Explicar por qué ac-lit usa suite/test (no describe/it) y la regla de un solo expect por test, citando la convención real del proyecto.',
      'Ejecutar la suite de tests de un paquete con component:test y leer su salida en la terminal.',
      'Escribir un test que verifique el estado inicial de un componente Lit montándolo con fixture().',
      'Escribir un test que simule interacción real del usuario y espere un evento asíncrono con oneEvent().',
    ],
    labs: [
      {
        id: 'testing-unitario-01-convencion-suite-test',
        title: '1. La convención real: suite/test y un solo expect',
        estimatedMinutes: 45,
        objective:
          'Entender por qué los tests de ac-lit usan suite/test en vez de describe/it, y por qué cada test valida una sola cosa con un único expect, citando la convención real del proyecto y el archivo de tests de ac-registro-wizard.',
        content: [
          { type: 'heading', text: 'suite y test, no describe e it' },
          {
            type: 'p',
            text: 'Los tests de cada componente de ac-lit no usan la interfaz BDD de Mocha (describe/it, la que ves en la mayoría de tutoriales) sino su interfaz TDD: suite y test. No es un detalle de estilo -- es una convención real del proyecto, y se activa con una opción real de configuración.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'web-test-runner.config.js (ac-registro-wizard)',
            code: `// Interfaz TDD de Mocha (suite/test/setup/teardown en vez de
// describe/it/before/after) — alinea el naming con el framework del cliente.
testFramework: {
  config: {
    ui: 'tdd',
  },
},`,
          },
          {
            type: 'p',
            text: 'Así se ve en código real: el archivo completo de tests de ac-registro-wizard arranca con un único suite(...) que envuelve todos los test(...) del componente.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js (ac-registro-wizard)',
            code: `suite('ac-registro-wizard', () => {
  test('_open es true al conectarse', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    expect(el._open).to.be.true;
  });

  // ...el resto de los test() del componente, todos dentro del mismo suite()
});`,
          },
          {
            type: 'note',
            text: 'suite/test y describe/it son, en Mocha, literalmente el mismo motor con dos nombres distintos -- no cambia nada en cómo corren los tests. La razón de elegir suite/test en ac-lit es de comunicación: el framework de testing que el equipo usa en el código que consume estos componentes también usa esa interfaz, y mantener el mismo vocabulario en todo el stack evita que alguien lea "describe" en un lado y "suite" en otro y se pregunte si son dos herramientas distintas.',
          },
          { type: 'heading', text: 'Un solo expect por test' },
          {
            type: 'p',
            text: 'La segunda mitad de la convención es más estricta todavía: cada test valida una sola aserción. Si una interacción produce varios efectos observables, eso no es un test con varios expect -- son varios tests, cada uno con su propio fixture(...), aunque eso signifique repetir setup.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js (tres test, una sola interacción)',
            code: `  test('confirmar con éxito dispara ac-registro-wizard-register-success', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    fastApi(el);
    await advanceToStep3(el);
    const successEvent = oneEvent(el, 'ac-registro-wizard-register-success');
    clickActionButton(el, 2);
    const event = await successEvent;
    expect(event.detail.data.nombre).to.equal('Juan Perez');
  });

  test('confirmar con éxito abre el modal de confirmación', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    fastApi(el);
    await advanceToStep3(el);
    const successEvent = oneEvent(el, 'ac-registro-wizard-register-success');
    clickActionButton(el, 2);
    await successEvent;
    await el.updateComplete;
    expect(el._modalOpen).to.be.true;
  });

  test('confirmar con éxito cierra la transición del wizard', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    fastApi(el);
    await advanceToStep3(el);
    const successEvent = oneEvent(el, 'ac-registro-wizard-register-success');
    clickActionButton(el, 2);
    await successEvent;
    await el.updateComplete;
    expect(el._open).to.be.false;
  });`,
          },
          {
            type: 'note',
            text: 'Las tres repiten exactamente la misma secuencia (fastApi, advanceToStep3, clickActionButton) y solo cambia la última línea. Es deliberado: si mañana se rompe únicamente el cierre de la transición (_open ya no pasa a false) pero el evento y el modal siguen funcionando, vas a ver fallar solo el tercer test -- con un expect por test, el nombre del test que falla te dice exactamente qué se rompió, sin tener que leer el cuerpo.',
          },
        ],
        checkpoint:
          'Puedes explicar, sin mirar el código, por qué ac-lit usa suite/test en vez de describe/it, y por qué los tres tests de "confirmar con éxito" repiten el mismo setup en vez de juntarse en uno solo con tres expect.',
      },
      {
        id: 'testing-unitario-02-entorno-y-estado-inicial',
        title: '2. Levantar el entorno de test y verificar el estado inicial',
        estimatedMinutes: 45,
        objective:
          'Ejecutar la suite de tests de un componente con component:test, leer su salida, y escribir un test que verifique el estado inicial de un componente Lit montándolo con fixture().',
        content: [
          { type: 'heading', text: 'El script component:test' },
          {
            type: 'p',
            text: 'Cada paquete de ac-lit expone el mismo juego de scripts component:*. El que te interesa ahora es component:test: compila los estilos .scss del componente (los tests importan el componente real, que a su vez importa su .styles.js generado) y después corre @web/test-runner sobre todos los archivos test/**/*.test.js del paquete.',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'packages/components/ac-registro-wizard/package.json (scripts)',
            code: `"component:test": "pnpm run component:build:styles && web-test-runner \\"test/**/*.test.js\\"",`,
          },
          {
            type: 'p',
            text: 'Para correrlo mientras trabajas en un componente puntual, no corras la suite completa del monorepo -- acótalo al paquete con --filter, la práctica real de validación local en este proyecto.',
          },
          {
            type: 'code',
            lang: 'bash',
            filename: '(desde la raíz del monorepo)',
            code: `pnpm --filter @ac-components/ac-registro-wizard run component:test`,
          },
          {
            type: 'note',
            text: 'A diferencia de un test con jsdom, @web/test-runner levanta un navegador real (Chromium por defecto) para cada corrida. Es más lento que jsdom, pero necesario: estás testeando Custom Elements con Shadow DOM real, y jsdom no implementa Shadow DOM con la fidelidad que estos tests necesitan (querySelector contra shadowRoot, eventos que cruzan el límite del shadow boundary, etc.).',
          },
          { type: 'heading', text: 'Montar el componente real con fixture()' },
          {
            type: 'p',
            text: 'open-wc/testing expone fixture(), que recibe un template de lit-html y devuelve el elemento ya conectado al DOM (con connectedCallback() corrido). Es la base de todos los tests del archivo: ningún test de este componente lo instancia con document.createElement ni lo testea desconectado.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js (imports)',
            code: `import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing';
import '../index.js';`,
          },
          {
            type: 'p',
            text: 'Con eso ya puedes escribir el test más simple del archivo: verificar una property privada en su valor inicial, justo después de montar el componente.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js',
            code: `  test('_open es true al conectarse', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    expect(el._open).to.be.true;
  });`,
          },
          {
            type: 'note',
            text: '_open es una property privada (prefijo _, sin reflect a atributo) que controla la transición de entrada/salida del wizard completo -- se testea igual que cualquier property pública, porque fixture() te da la instancia real de la clase, no una vista limitada a su API pública. El guion bajo es una convención de nombre, no una barrera de acceso en JS.',
          },
        ],
        checkpoint:
          'Puedes correr pnpm --filter @ac-components/ac-registro-wizard run component:test desde la raíz del repo, ver los tests existentes pasar en la salida de la terminal, y explicar en qué se diferencia fixture() de instanciar el elemento a mano con document.createElement.',
      },
      {
        id: 'testing-unitario-03-flujos-y-eventos-async',
        title: '3. Testear flujos asíncronos: eventos, helpers y reset()',
        estimatedMinutes: 60,
        objective:
          'Escribir tests que simulan interacción real (llenar campos, hacer click) y esperan eventos asíncronos con oneEvent(), apoyándote en los helpers del archivo de tests para llegar al estado que necesitas sin repetir lógica de navegación en cada test.',
        content: [
          { type: 'heading', text: 'Simular al usuario real, no llamar al método interno' },
          {
            type: 'p',
            text: 'El primer paso (datos personales) requiere nombre y correo antes de poder avanzar. El test no asigna _nombre y _email directamente -- busca el ac-input-basic real dentro del shadow DOM del paso, le pone un valor al input nativo y dispara un evento input de verdad. Eso es lo que hace el helper fillStep1.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js (helper fillStep1)',
            code: `async function fillStep1(el, { nombre = 'Juan Perez', email = 'juan@test.com' } = {}) {
  const datos = stepContent(el, 0);
  const [nombreInput, emailInput] = datos.shadowRoot.querySelectorAll('ac-input-basic');
  const nombreField = nombreInput.shadowRoot.querySelector('input');
  nombreField.value = nombre;
  nombreField.dispatchEvent(new Event('input'));
  const emailField = emailInput.shadowRoot.querySelector('input');
  emailField.value = email;
  emailField.dispatchEvent(new Event('input'));
  await el.updateComplete;
}`,
          },
          {
            type: 'note',
            text: 'Esto atraviesa tres niveles de shadow DOM (ac-registro-wizard -> registro-wizard-steps -> registro-wizard-step-datos -> ac-input-basic) con shadowRoot.querySelector encadenado, nunca con un selector plano compuesto. Disparar el evento input real -- no asignar la property y listo -- es lo que efectivamente ejercita el binding declarativo del Capítulo 1: si ese binding se rompiera, este test fallaría igual que le fallaría a un usuario real escribiendo en el campo.',
          },
          { type: 'heading', text: 'Esperar un evento con oneEvent()' },
          {
            type: 'p',
            text: 'init() dispara una petición a ac-api-users que resuelve de forma asíncrona. El test no puede llamar a init() y revisar el estado en la siguiente línea -- tiene que esperar el evento que marca que la petición terminó. Para eso está oneEvent(el, nombreDelEvento): devuelve una promesa que se resuelve con el primer evento de ese tipo que el elemento emita.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js',
            code: `  test('init() invoca obtenerDatosUsuario sobre el ac-api-users interno', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    fastApi(el);
    const successEvent = oneEvent(el, 'ac-api-users-get-user-success');
    el.init();
    const event = await successEvent;
    expect(event.detail.method).to.equal('obtenerDatosUsuario');
  });`,
          },
          {
            type: 'note',
            text: 'fastApi(el) (otro helper del archivo) le baja el timeout al ac-api-users interno a 1ms antes de llamar a init() -- sin eso, cada test de este tipo tardaría lo mismo que la latencia simulada real de la API, y la suite completa se volvería lenta. oneEvent() se suscribe antes de disparar la acción (const successEvent = oneEvent(...) va antes de el.init()), nunca después: un evento que ya se emitió no se puede volver a esperar.',
          },
          { type: 'heading', text: 'Componer helpers para llegar al paso 3: reset()' },
          {
            type: 'p',
            text: 'Varios tests necesitan el wizard ya en el paso 3 (resumen) para poder testear la confirmación. En vez de repetir fillStep1 + click + aceptar términos + click en cada test, el archivo define advanceToStep3(el), que encadena los helpers anteriores una sola vez.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js (helper advanceToStep3)',
            code: `async function advanceToStep3(el) {
  await fillStep1(el);
  clickActionButton(el, 0);
  await aTimeout(30);
  acceptTerminos(el);
  await stepsHost(el).updateComplete;
  clickActionButton(el, 1);
  await aTimeout(30);
}`,
          },
          {
            type: 'p',
            text: 'Con ese helper disponible, testear reset() vuelve a aplicar la misma regla del Laboratorio 1: una interacción, varios efectos observables, un test por efecto.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test/registro-wizard.test.js (tres test de reset())',
            code: `  test('reset() dispara ac-registro-wizard-reset', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    const resetEvent = oneEvent(el, 'ac-registro-wizard-reset');
    el.reset();
    const event = await resetEvent;
    expect(event.type).to.equal('ac-registro-wizard-reset');
  });

  test('reset() vuelve _nombre a una cadena vacía', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    await fillStep1(el);
    el.reset();
    expect(el._nombre).to.equal('');
  });

  test('reset() vuelve a activar el paso 1', async () => {
    const el = await fixture(html\`<ac-registro-wizard></ac-registro-wizard>\`);
    await fillStep1(el);
    clickActionButton(el, 0);
    await aTimeout(30);
    el.reset();
    expect(steps(el)[0].active).to.be.true;
  });`,
          },
          {
            type: 'note',
            text: 'Los tres montan su propio fixture y repiten el setup mínimo que necesitan -- ninguno reutiliza una instancia entre tests. Eso es intencional: un fixture por test evita que el estado de un test se filtre al siguiente, que es exactamente el tipo de bug intermitente y difícil de rastrear que esta convención busca evitar.',
          },
        ],
        checkpoint:
          'Puedes escribir un test nuevo para este componente que llegue al paso 3 con advanceToStep3(el), dispare un error con api.simulateError = true, y verifique con un único expect que el wizard no cierra su transición -- explicando por qué eso no puede ir en el mismo test que verifica que aparece la notificación de error.',
      },
    ],
  },
  {
    id: 'js-basico-repaso',
    title: 'Capítulo 3 — Repaso: scope, closures y contexto',
    summary:
      'Repaso corto de scope, closures y cómo se resuelve this -- base para lo que sigue en Intermedio y Avanzado.',
    estimatedMinutes: 60,
    outcomes: [
      'Distinguir scope de bloque (let/const) de scope de función (var), y explicar qué es hoisting.',
      'Explicar qué es un closure y reconocer uno real en este mismo proyecto.',
      'Explicar cómo se resuelve this según la forma de la llamada (función, método, arrow function) y por qué una arrow function preserva el this del lugar donde se define.',
    ],
    labs: [
      {
        id: 'js-basico-repaso-01-scope-y-closures',
        title: '1. Scope: var, let/const y closures',
        estimatedMinutes: 35,
        objective:
          'Distinguir el scope de función (var) del scope de bloque (let/const), entender qué es hoisting, y reconocer un closure real de este proyecto a nivel de módulo, no solo como función anidada.',
        content: [
          { type: 'heading', text: 'var: scope de función' },
          {
            type: 'p',
            text: 'Cuando declaras una variable con var, su alcance no es el bloque donde la escribiste (un if, un for, o un bloque suelto entre llaves) sino toda la función que la contiene. Si la declaras fuera de cualquier función, su alcance es global.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `function procesarPedido(items) {
  if (items.length > 0) {
    var primerItem = items[0];
  }
  // primerItem sigue existiendo aquí, aunque el if ya terminó --
  // var no respeta el bloque, solo la función.
  return primerItem;
}`,
          },
          { type: 'heading', text: 'let y const: scope de bloque' },
          {
            type: 'p',
            text: 'let y const sí respetan el bloque: una variable declarada con let o const dentro de un if, un for o un bloque suelto deja de existir en cuanto ese bloque termina. Es la diferencia práctica que te conviene memorizar.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `function procesarPedido(items) {
  if (items.length > 0) {
    let primerItem = items[0];
    console.log(primerItem); // accesible aquí, dentro del bloque
  }
  console.log(primerItem); // ReferenceError: primerItem no está definida
}`,
          },
          {
            type: 'note',
            text: 'const no significa "inmutable" -- significa que esa referencia no se puede reasignar. Un objeto o arreglo declarado con const sigue pudiendo mutar su contenido: const lista = []; lista.push(1) funciona sin problema, lo que falla es lista = [] (una reasignación completa). La trampa real es asumir que const congela el valor cuando solo congela el enlace entre el nombre y ese valor.',
          },
          { type: 'heading', text: 'Hoisting: declaraciones que suben, pero no todas igual' },
          {
            type: 'p',
            text: 'Hoisting es el comportamiento por el cual el motor de JavaScript procesa las declaraciones de un scope antes de ejecutar el código línea por línea. var, let y const se hoistean los tres, pero no de la misma forma -- y esa diferencia es justo la que conviene entender.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `console.log(a); // undefined -- var ya existe, todavía sin valor asignado
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;`,
          },
          {
            type: 'note',
            text: 'var se hoistea e inicializa de inmediato con undefined, por eso console.log(a) no revienta. let y const también se hoistean, pero quedan en lo que se llama la "temporal dead zone": existen en el scope, pero acceder a ellas antes de la línea donde se declaran lanza un ReferenceError en vez de devolver undefined en silencio. Esa diferencia no es un capricho -- si let se comportara como var, un typo de orden en el código pasaría desapercibido devolviendo undefined, en vez de avisarte con un error exactamente donde está el problema.',
          },
          { type: 'heading', text: 'Closures: una función recuerda el scope donde nació' },
          {
            type: 'p',
            text: 'Un closure ocurre cuando una función conserva acceso a variables de su scope exterior, incluso después de que ese scope ya terminó de ejecutarse. El ejemplo que más se repite en tutoriales es una función que devuelve otra función anidada, pero esa no es la única forma en la que aparece un closure: el mismo mecanismo aplica también a nivel de módulo, con funciones exportadas que comparten una variable que vive en el scope del propio archivo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-intl-mixin/src/intl-mixin.js',
            code: `let globalLocale = 'es-PE';

// ...

export function getGlobalLocale() {
  return globalLocale;
}

export function setGlobalLocale(locale) {
  globalLocale = locale;
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('ac-locale-changed', { detail: { locale } }));
    }
  } catch (_) {
    /* no-op: dispatch is best-effort outside a browser environment */
  }
}`,
          },
          {
            type: 'p',
            text: 'globalLocale es una variable del scope del módulo -- nunca se exporta, así que ningún otro archivo puede tocarla directamente. Lo único que sí se exporta son getGlobalLocale y setGlobalLocale, y las dos "cierran sobre" (eso es, literalmente, un closure) esa misma variable: la leen o la reasignan sin que nadie se la pase como argumento.',
          },
          {
            type: 'note',
            text: 'Esto no es el típico "función adentro de función" de los tutoriales -- es el mismo mecanismo (una función conserva acceso al scope en el que fue definida) aplicado al scope de un módulo completo en vez de al scope de otra función. Como un módulo de JavaScript se ejecuta una sola vez sin importar cuántos archivos lo importen, los cien componentes que importan este archivo comparten la misma globalLocale -- por eso cambiar el idioma desde un único selector actualiza a todos los componentes montados.',
          },
        ],
        checkpoint:
          'Puedes explicar por qué console.log(b) antes de su propia línea let b = 20 lanza ReferenceError en vez de devolver undefined como pasaría con var, y por qué getGlobalLocale y setGlobalLocale son un closure aunque ninguna de las dos está anidada dentro de la otra.',
      },
      {
        id: 'js-basico-repaso-02-contexto-this',
        title: '2. Contexto: cómo se resuelve `this`',
        estimatedMinutes: 25,
        objective:
          'Explicar cómo se resuelve this según la forma en la que se llama a una función -- suelta, como método, o desde una arrow function -- y reconocer por qué una arrow function real de este proyecto necesita serlo.',
        content: [
          { type: 'heading', text: 'this se decide en la llamada, no en la definición' },
          {
            type: 'p',
            text: 'La regla de fondo es esta: this no depende de dónde escribiste la función, sino de cómo la llamaste. La misma función puede devolver un this distinto según la forma en la que se invoque cada vez.',
          },
          { type: 'heading', text: 'Función suelta: this no apunta a nada útil' },
          {
            type: 'code',
            lang: 'js',
            code: `function mostrarLocale() {
  console.log(this);
}

mostrarLocale(); // this es undefined`,
          },
          {
            type: 'note',
            text: 'En un script clásico sin modo estricto, this ahí sería el objeto global (window en el navegador). Pero los módulos ES corren siempre en modo estricto -- y todo el código fuente de este proyecto está escrito como módulos ES -- así que una función suelta como esta recibe this === undefined.',
          },
          {
            type: 'heading',
            text: 'Método de un objeto o de una clase: this es quien hizo la llamada',
          },
          {
            type: 'p',
            text: 'Cuando llamas a una función como propiedad de un objeto (objeto.metodo()), this dentro del método es ese objeto -- no la clase donde se definió el método, sino lo que está a la izquierda del punto en la llamada concreta.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-intl-mixin/src/intl-mixin.js',
            code: `getLocale() {
  return this.locale;
}`,
          },
          {
            type: 'p',
            text: 'Llamado como miComponente.getLocale(), this dentro del método es miComponente -- por eso puede leer this.locale sin que nadie se lo pase como argumento.',
          },
          {
            type: 'note',
            text: 'Si extraes el método de su objeto y lo llamas suelto (const fn = miComponente.getLocale; fn()), this se pierde: ya no es miComponente, vuelve a ser el mismo this inútil de una función suelta. El método no "recuerda" a qué objeto pertenece -- solo lo sabe en el instante en que alguien lo llama con la sintaxis objeto.metodo(). Esa pérdida es justo el problema real que resuelve, de otra forma, el ejemplo siguiente.',
          },
          {
            type: 'heading',
            text: 'Arrow function: no tiene this propio, hereda el de donde se define',
          },
          {
            type: 'p',
            text: 'Una arrow function nunca crea su propio this -- dentro de ella, this es el mismo this que ya existía en el scope donde la arrow function fue escrita, sin importar después cómo se la llame. Así se usa en código real, dentro del render() de una página:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'cli/templates/app/src/pages/users-table-page.js (dentro de render())',
            code: `\${USERS.map(
  user => html\`
    <li>
      <ac-button-basic
        ambient="primary"
        @ac-button-basic-click=\${() => this._onSelectClick(user)}
      >
        Seleccionar a \${user.name}
      </ac-button-basic>
      <a href="#/usuarios/\${user.id}">Ver detalle</a>
    </li>
  \`,
)}`,
          },
          {
            type: 'p',
            text: 'render() es un método de la clase AppUsersTablePage, así que dentro de él this ya es la instancia del componente. La arrow function () => this._onSelectClick(user) se define ahí mismo, dentro de render() -- por eso, cuando Lit la invoque más adelante al hacer click, this._onSelectClick sigue resolviéndose contra la instancia del componente, nunca contra el botón que disparó el evento.',
          },
          {
            type: 'note',
            text: 'Un matiz importante: un binding @ac-button-basic-click=${this._onSelectClick} sin envolver en arrow function también resolvería this correctamente aquí -- Lit llama a los listeners de un binding @evento con el host del componente como this, a diferencia de un addEventListener nativo del DOM. Pero eso no alcanza para este caso: _onSelectClick necesita el user de cada elemento, y ese valor cambia en cada vuelta del .map(). No hay forma de pasarle ese argumento sin una función que lo capture. La arrow function está ahí sobre todo por el argumento variable (user); que además resuelva bien this es, en este caso puntual, una ventaja añadida, no la razón principal.',
          },
          {
            type: 'p',
            text: 'Y hay un paralelo directo con el laboratorio anterior: () => this._onSelectClick(user) es, en sí misma, un closure -- conserva acceso a user, la variable del scope de la función que pasaste a .map(), incluso después de que esa vuelta puntual del .map() ya terminó de ejecutarse.',
          },
        ],
        checkpoint:
          'Puedes explicar por qué dentro de getLocale() this es la instancia que lo llamó, por qué esa referencia se perdería si extrajeras el método y lo llamaras suelto, y por qué la arrow function de users-table-page.js necesita serlo aunque Lit ya resuelva bien el this de un binding @evento sin envolver.',
      },
    ],
  },
];

// Intermedio retoma el mismo proyecto (ac-registro-wizard) y suma los temas
// que Básico no cubre en profundidad -- numeración propia (Capítulo 1, 2, 3...)
// porque cada nivel es su propia página independiente, no una continuación
// lineal de los capítulos de Básico.
const INTERMEDIO_CHAPTERS = [
  {
    id: 'accesibilidad',
    title: 'Capítulo 1 — Accesibilidad',
    summary:
      'Corre la auditoría de accesibilidad real del proyecto con axe-core, entiende cómo se inyecta sin la librería típica, y corrige una violación de contraste real de este mismo catálogo.',
    estimatedMinutes: 90,
    outcomes: [
      'Correr la auditoría de accesibilidad (`component:test:e2e:a11y`) e interpretar un reporte de violaciones reales.',
      'Explicar por qué este proyecto inyecta axe-core directo en vez de usar `@axe-core/webdriverio`.',
      'Reconocer y corregir una violación real de contraste con el patrón "fondo sólido + texto fijo".',
    ],
    labs: [
      {
        id: 'accesibilidad-01-correr-la-auditoria',
        title: '1. Correr la auditoría de accesibilidad real',
        estimatedMinutes: 30,
        objective:
          'Correr la suite de accesibilidad real de `ac-registro-wizard` y leer su reporte de violaciones, entendiendo de dónde sale cada pieza (feature, config, comando).',
        content: [
          { type: 'heading', text: 'Dos feature files, separados por un tag' },
          {
            type: 'p',
            text: 'Cada componente del catálogo que tiene suite E2E trae dos feature files: uno funcional y uno de accesibilidad, separados por el tag `@accessibility` para que cada suite corra de forma independiente. Este es el feature de accesibilidad real de `ac-registro-wizard`, completo: dos escenarios, uno en el tema por defecto (claro) y otro que primero activa el modo oscuro.',
          },
          {
            type: 'code',
            lang: 'gherkin',
            filename:
              'test_e2e/features/registro-wizard-accessibility.feature (ac-registro-wizard)',
            code: `@e2e @accessibility
Feature: ac-registro-wizard - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-registro-wizard no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-registro-wizard"

  @smoke
  Scenario: El demo de ac-registro-wizard no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-registro-wizard no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG`,
          },
          {
            type: 'note',
            text: 'El segundo escenario no es redundante: el contraste de un color puede cumplir WCAG en un tema y fallar en el otro. Lo vas a ver con un caso real en el laboratorio 3 de este capítulo.',
          },
          { type: 'heading', text: 'Una config de WebdriverIO que solo corre ese tag' },
          {
            type: 'p',
            text: "`wdio.a11y.conf.js` no define nada propio: llama a `buildWdioConfig` (el helper compartido de `@ac-base/ac-e2e-testing`, el mismo que usa `wdio.conf.js` para la suite funcional) y le pasa `tags: '@accessibility'` para que solo levante los escenarios marcados con ese tag.",
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test_e2e/wdio.a11y.conf.js (ac-registro-wizard)',
            code: `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWdioConfig } from '@ac-base/ac-e2e-testing';

const here = path.dirname(fileURLToPath(import.meta.url));

export const config = buildWdioConfig({
  baseUrl: process.env.AC_E2E_BASE_URL ?? 'http://localhost:4173',
  specs: [path.join(here, 'features/**/*.feature')],
  tags: '@accessibility',
  cucumberOpts: {
    import: [path.join(here, 'step-definitions/**/*.js')],
  },
});`,
          },
          { type: 'heading', text: 'Correrla' },
          {
            type: 'p',
            text: 'El `package.json` del componente define el script completo: compila, levanta un `vite preview` en el puerto 4173, espera a que esté listo y recién ahí corre la suite contra ese servidor -- todo con `start-server-and-test`, sin que tengas que levantar nada a mano en otra terminal.',
          },
          {
            type: 'code',
            lang: 'bash',
            filename: 'package.json (ac-registro-wizard, scripts)',
            code: `"component:test:e2e:a11y": "pnpm run component:build && start-server-and-test component:preview http://localhost:4173 component:test:e2e:a11y:run",
"component:test:e2e:a11y:run": "wdio run test_e2e/wdio.a11y.conf.js"`,
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'pnpm --filter @ac-components/ac-registro-wizard run component:test:e2e:a11y',
          },
          {
            type: 'p',
            text: 'Cuando hay una violación real, el paso que la detecta no se limita a decir "falló": arma un resumen legible con el id de la regla, su descripción (`help`) y el selector de cada nodo afectado, y recién ahí lanza el error.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test_e2e/step-definitions/registro-wizard.steps.js (ac-registro-wizard)',
            code: `Then('el demo no tiene violaciones de accesibilidad WCAG', async function () {
  const results = await runAccessibilityCheck();
  if (results.violations.length > 0) {
    const summary = results.violations
      .map(violation => {
        const targets = violation.nodes.map(node => node.target.join(' ')).join(', ');
        return \`- \${violation.id}: \${violation.help} (\${targets})\`;
      })
      .join('\\n');
    throw new Error(
      \`Se encontraron \${results.violations.length} violaciones de accesibilidad:\\n\${summary}\`,
    );
  }
});`,
          },
          {
            type: 'note',
            text: 'El `id` de la regla (ej. `color-contrast`, `label-content-name-mismatch`) es tu punto de partida para buscar en la documentación de axe-core qué espera exactamente esa regla -- no hace falta memorizarlas, pero sí saber que el id es el dato que importa, no el texto genérico de "hay una violación".',
          },
        ],
        checkpoint:
          'Puedes correr `component:test:e2e:a11y` sobre `ac-registro-wizard` (o sobre tu propio componente, si ya tiene su `test_e2e/`) y, si forzás una violación a propósito (por ejemplo bajando el contraste de un texto), leer el resumen que imprime el paso y identificar el `id` de la regla y el selector del nodo afectado.',
      },
      {
        id: 'accesibilidad-02-como-se-inyecta-axe-core',
        title: '2. Cómo se inyecta axe-core, sin `@axe-core/webdriverio`',
        estimatedMinutes: 25,
        objective:
          'Entender por qué el proyecto no usa el paquete típico de integración de axe-core con WebdriverIO, y cómo `runAccessibilityCheck` logra lo mismo inyectando axe-core "crudo".',
        content: [
          { type: 'heading', text: 'Por qué no `@axe-core/webdriverio`' },
          {
            type: 'p',
            text: 'La integración más conocida de axe-core con WebdriverIO es el paquete `@axe-core/webdriverio`. Este proyecto no lo usa: a la fecha, su versión publicada depende de `client.executeAsync`, un comando que WebdriverIO v10 eliminó a favor de `execute()` con funciones async. El comentario que explica esto vive directo arriba de la función que resuelve el problema.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-e2e-testing/src/accessibility.js',
            code: `// axe-core se inyecta como script "crudo" en la página bajo prueba. No se usa
// el paquete @axe-core/webdriverio: a la fecha de este paquete su versión
// publicada (4.14.0) depende de \`client.executeAsync\`, un comando que
// WebdriverIO v10 eliminó a favor de \`execute()\` con funciones async. Inyectar
// axe-core directamente es además el camino sin intermediarios desactualizados.`,
          },
          { type: 'heading', text: '`runAccessibilityCheck`: inyectar y correr' },
          {
            type: 'p',
            text: 'La función hace dos cosas, en ese orden: primero inyecta el script de axe-core completo en la página (leído una sola vez del propio paquete `axe-core` instalado como dependencia, con `require.resolve` + `readFileSync`, y cacheado en `axeSource` para no releerlo en cada llamada), y después corre `window.axe.run` dentro del navegador con `browser.execute()` -- la función async que WDIO v10 sí soporta.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-e2e-testing/src/accessibility.js',
            code: `let axeSource;
function getAxeSource() {
  axeSource ??= readFileSync(require.resolve('axe-core/axe.min.js'), 'utf-8');
  return axeSource;
}

/**
 * Corre axe-core contra el documento actual y devuelve el resultado completo
 * de \`axe.run\` (\`{ violations, passes, ... }\`).
 */
export async function runAccessibilityCheck({ tags = ACCESSIBILITY_TAGS, context } = {}) {
  await browser.execute(getAxeSource());
  return browser.execute(
    async (runOnlyTags, runContext) => {
      return window.axe.run(runContext ?? document, {
        runOnly: { type: 'tag', values: runOnlyTags },
      });
    },
    tags,
    context ?? null,
  );
}`,
          },
          {
            type: 'note',
            text: 'El primer `browser.execute(getAxeSource())` no "llama" a nada propio: el string que recibe es el contenido completo de `axe.min.js`, así que WebdriverIO lo ejecuta tal cual en la página -- es el mismo efecto que pegar ese script en una etiqueta `<script>` del documento. Recién después de eso existe `window.axe` para que el segundo `browser.execute` lo use.',
          },
          { type: 'heading', text: 'Qué reglas WCAG evalúa' },
          {
            type: 'p',
            text: 'El segundo `browser.execute` le pasa a `axe.run` un `runOnly` por tag, no la lista completa de reglas de axe-core. Esos tags son una constante compartida, así que todas las suites de accesibilidad del catálogo evalúan exactamente el mismo conjunto de criterios WCAG.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-e2e-testing/src/config.js',
            code: `/** Tags WCAG evaluados en las suites de accesibilidad (axe-core). */
export const ACCESSIBILITY_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];`,
          },
          {
            type: 'note',
            text: 'Este helper vive una sola vez en `@ac-base/ac-e2e-testing`, el paquete base de testing E2E compartido por todo el monorepo -- ningún componente (ni `ac-registro-wizard`, ni el que vayas a construir tú) reimplementa su propia inyección de axe-core. `runAccessibilityCheck` es lo único que importa el step definition del laboratorio anterior.',
          },
        ],
        checkpoint:
          'Puedes explicar, sin mirar el código, por qué `runAccessibilityCheck` no usa `@axe-core/webdriverio` (la incompatibilidad concreta con WDIO v10) y qué hace cada uno de los dos `browser.execute()` -- el primero inyecta el script, el segundo lo corre.',
      },
      {
        id: 'accesibilidad-03-contraste-fondo-solido',
        title: '3. Un bug de contraste real: fondo sólido + texto fijo',
        estimatedMinutes: 35,
        objective:
          'Entender, con un bug real de este catálogo, por qué un fondo sólido con texto fijo necesita tokens de color que NO cambien entre modo claro/oscuro, y por qué un color sin caja propia (texto plano o borde sobre la página) es todavía más frágil.',
        content: [
          { type: 'heading', text: 'El bug real en `ac-badge-basic`' },
          {
            type: 'p',
            text: 'Un componente que pinta un fondo sólido con un color de texto fijo (como un badge: fondo de color + texto blanco o negro) tiene que usar los tokens semánticos fijos de la paleta (`--color-neutral`, `--color-success`, `--color-warning`, `--color-danger`), nunca `--color-muted`/`--color-bg`/`--color-surface` -- esos sí cambian entre modo claro y oscuro. `ac-badge-basic` se armó así desde el principio, justo por este bug ya conocido en el catálogo: si el fondo del badge cambiara con el tema, el texto blanco/negro que se eligió por contraste contra el color ORIGINAL dejaría de cumplir WCAG AA en el tema donde ese color ya no es el mismo.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/components/ac-badge-basic/src/badge-basic.styles.scss',
            code: `/* Variants - fondo sólido + texto calculado para cumplir contraste WCAG AA
   (4.5:1) contra ESE fondo, no contra la página: el texto blanco/negro de
   cada variant fue elegido por cálculo, no a ojo.
   Los 4 usan tokens semánticos fijos (--color-neutral/success/warning/danger)
   que NO cambian entre light/dark-mode — un badge debe verse igual sin
   importar el tema de la página (a diferencia de --color-muted/--color-bg,
   que sí cambian y por eso NO se usan acá: fue justo el bug real que esto
   corrigió). */
.ac-badge--neutral {
  background: var(--color-neutral, #44433d);
  color: #fff;
}

.ac-badge--success {
  background: var(--color-success, #499c54);
  color: #000;
}

.ac-badge--warning {
  background: var(--color-warning, #e8a400);
  color: #000;
}

.ac-badge--danger {
  background: var(--color-danger, #e05555);
  color: #000;
}`,
          },
          {
            type: 'note',
            text: 'La regla práctica: si tu componente tiene caja propia (fondo sólido) y texto fijo adentro, el color de fondo tiene que ser un token que NO se redefina en `modern-warm-palette-light.css` -- si lo redefine, es un token "de tema", pensado para fondos/superficies de página, no para una caja con su propio color de marca.',
          },
          { type: 'heading', text: 'Sin caja propia, el problema es peor: `ac-radio-basic`' },
          {
            type: 'p',
            text: 'Un control sin fondo propio (borde o punto de marca directo sobre la página, como `ac-radio-basic`, `ac-link-basic` o `ac-spinner-basic`) es todavía más frágil: su contraste depende por completo del fondo de la PÁGINA, que sí cambia entre temas. En la revisión de accesibilidad de estos componentes se encontró justo este caso en `ac-radio-basic`: el borde y el punto del estado marcado usaban `--color-primary-500` fijo, un verde pensado para fondo oscuro (ahí daba 7:1 de contraste) que en tema claro caía a ~2.4:1 contra la página -- no llega al 3:1 no-textual que exige WCAG 1.4.11 para el borde/relleno de un control.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/components/ac-radio-basic/src/radio-basic.styles.scss',
            code: `.ac-radio-basic {
  /* Color del punto/borde cuando está marcado: el control no tiene caja
     propia (va directo sobre el fondo de la página), así que el tono de
     marca se redefine por tema más abajo — mismo criterio que
     ac-link-basic/ac-spinner-basic. */
  --ac-radio-active: var(--color-primary-500, #10b981);
}

:host-context([data-theme='light']) .ac-radio-basic {
  --ac-radio-active: var(--color-primary-700, #047857);
}`,
          },
          {
            type: 'p',
            text: 'El fix no es "elegir un color intermedio que funcione más o menos en los dos temas" -- eso casi siempre falla en alguno de los dos. Es definir una custom property propia del componente (`--ac-radio-active`) y redefinirla a un tono distinto bajo `:host-context([data-theme=\'light\'])`: oscuro sobre fondo claro, claro sobre fondo oscuro, cada uno validado por separado contra el fondo real de SU tema.',
          },
          {
            type: 'note',
            text: '`ac-divider-basic` confirma esto mismo con números reales: su label usaba `--color-subtext` (`#787a80`) tal como sugería la spec inicial -- pasaba en tema claro (~6.2:1) pero el escenario de accesibilidad en modo oscuro lo marcó como violación real de `color-contrast` (~3.9:1 contra `--color-bg` en oscuro, por debajo del 4.5:1 que exige WCAG AA para texto normal). El smoke test en tema claro no lo detectaba -- solo el escenario que activa el toggle de tema, el mismo que viste en el laboratorio 1 de este capítulo. Por eso `--color-subtext` tal cual nunca es seguro para texto suelto sin caja, ni siquiera en el tema para el que a simple vista parece pensado: hay que medir, no asumir.',
          },
        ],
        checkpoint:
          'Puedes explicar con tus palabras la diferencia entre los dos casos (fondo sólido con texto fijo vs. color sin caja propia sobre la página), por qué cada uno necesita una solución distinta, y por qué el escenario de accesibilidad en modo oscuro existe como caso separado del smoke test -- con el número real de `ac-divider-basic` (~3.9:1 vs. 4.5:1) como evidencia de que "se ve bien" no alcanza.',
      },
    ],
  },
  {
    id: 'e2e',
    title: 'Capítulo 2 — Testing E2E',
    summary:
      'Lee el escenario Gherkin real de ac-registro-wizard, entiende el patrón Page Object/Component Object que lo sostiene, conecta cada step con su implementación en JS y corre la suite completa.',
    estimatedMinutes: 150,
    outcomes: [
      'Leer un escenario Gherkin y distinguir Given/When/Then como descripción de comportamiento, no de implementación.',
      'Explicar por qué existe un Page Object/Component Object por encima de WebdriverIO crudo, citando el patrón base compartido.',
      'Trazar cada step de un .feature hasta su step definition en JS y el método del Page Object que invoca.',
      'Correr la suite e2e real de un componente y explicar qué hace cada pieza del comando (build, preview, wdio).',
    ],
    labs: [
      {
        id: 'e2e-01-gherkin-feature',
        title: '1. Leer el escenario Gherkin real',
        estimatedMinutes: 35,
        objective:
          'Leer el .feature real de ac-registro-wizard y entender por qué un escenario Gherkin describe comportamiento en lenguaje natural, nunca selectores ni detalles de implementación.',
        content: [
          { type: 'heading', text: 'Gherkin: lenguaje natural, no código' },
          {
            type: 'p',
            text: 'Un escenario Gherkin describe lo que hace una persona y lo que debería pasar, en oraciones que cualquiera del equipo puede leer sin saber WebdriverIO ni Cucumber. Nunca menciona un selector CSS, un shadow root ni un método -- eso vive más abajo, en los step definitions y el Page Object. Este es el archivo completo de ac-registro-wizard, sin recortar.',
          },
          {
            type: 'code',
            lang: 'gherkin',
            filename: 'test_e2e/features/registro-wizard.feature',
            code: `@e2e
Feature: ac-registro-wizard - flujo completo

  Como desarrollador del catálogo ac-lit
  Quiero que ac-registro-wizard avance por sus 3 pasos y registre un usuario
  Para asegurar que el wizard de referencia funciona de punta a punta

  Background:
    Given el usuario está en el demo de "ac-registro-wizard"

  @smoke
  Scenario: Completar el wizard de registro muestra el modal con los datos reales
    When el usuario completa el paso 1 con nombre "Juan Pérez" y correo "juan@test.com"
    And el usuario avanza al paso 2
    And el usuario acepta los términos y avanza al paso 3
    And el usuario confirma el registro
    Then el modal de registro exitoso se muestra
    And el usuario registrado es "Juan Pérez"

  Scenario: La página no tiene scroll horizontal durante el flujo
    When el usuario completa el paso 1 con nombre "Juan Pérez" y correo "juan@test.com"
    And el usuario avanza al paso 2
    Then la página no tiene scroll horizontal`,
          },
          { type: 'heading', text: 'Background, tags y dos escenarios independientes' },
          {
            type: 'p',
            text: 'El `Background` corre antes de cada `Scenario` de este archivo: ambos escenarios arrancan con el usuario ya parado en el demo del componente, así ninguno de los dos repite ese paso. El tag `@e2e` arriba del `Feature` identifica toda la suite funcional del componente (distinta de la suite de accesibilidad, que vive en un segundo .feature con el tag `@accessibility`); `@smoke` sobre el primer escenario marca el camino feliz completo -- el que normalmente correrías primero si tuvieras que elegir uno solo. El segundo escenario reutiliza los mismos dos primeros pasos del primero (llegar hasta el paso 2) pero verifica algo totalmente distinto: que la página no generó scroll horizontal, un detalle visual que no tiene nada que ver con registrar un usuario.',
          },
          {
            type: 'note',
            text: 'Fíjate que ningún paso dice "hace clic en el botón con selector .foo" -- dice "el usuario avanza al paso 2" o "el usuario confirma el registro". Esa distancia deliberada respecto de la implementación es la que te permite leer el .feature como una lista de casos de uso, incluso sin saber todavía cómo está hecho el componente por dentro.',
          },
        ],
        checkpoint:
          'Puedes señalar, línea por línea del .feature, cuál paso es Given, cuáles son When y cuáles son Then (recordando que `And` hereda el tipo del paso anterior), y explicar en una frase qué verifica cada uno de los dos escenarios sin mencionar un solo selector.',
      },
      {
        id: 'e2e-02-page-object-pattern',
        title: '2. El patrón Page Object / Component Object',
        estimatedMinutes: 45,
        objective:
          'Entender por qué todos los componentes del catálogo pasan por el mismo patrón `PageObject`/`ComponentObject` de `@ac-base/ac-e2e-testing` en vez de llamar a WebdriverIO directo desde cada step, y leer la implementación real de ambos.',
        content: [
          { type: 'heading', text: 'El problema que resuelve: selectores fuera del .feature' },
          {
            type: 'p',
            text: 'Si cada step definition buscara el DOM a mano (`$(\'[data-testid="..."]\').$(\'...\')`), cualquier cambio interno del componente -- una clase CSS, un nivel más de shadow DOM -- rompería los steps aunque el comportamiento visible siguiera siendo el mismo. El Page Object (para páginas completas) y el Component Object (para un componente dentro de una página) resuelven esto encapsulando selectores y acciones detrás de métodos con nombre: el step solo dice "completa el paso 1 con estos datos", nunca cómo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-e2e-testing/src/page-object.js',
            code: `export class PageObject {
  constructor({ path = '' } = {}) {
    this.path = path;
  }

  async open() {
    this.context = await browser.url(this.path);
    // ...
    return this;
  }
}

export class ComponentObject {
  constructor({ selector, scope = null }) {
    this.selector = selector;
    this.scope = scope;
  }

  get root() {
    return this.scope ? this.scope.$(this.selector) : $(this.selector);
  }

  get executor() {
    return this.scope ?? browser;
  }

  async waitForDisplayed(options) {
    await this.root.waitForDisplayed(options);
    return this;
  }

  async click() {
    await this.root.click();
  }
}`,
          },
          {
            type: 'p',
            text: 'Cada componente extiende `ComponentObject` con su propio selector y sus propios métodos de dominio. Así se ve el de ac-registro-wizard: el constructor fija el selector por `data-testid` (la ancla que todo elemento que la suite necesita ubicar expone en el `demo/index.html`) y cada método público describe una acción completa del wizard, no un clic suelto.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test_e2e/pages/registro-wizard.page.js',
            code: `export class RegistroWizardPage extends ComponentObject {
  constructor(testId = 'registro-wizard-default', scope) {
    super({ selector: \`[data-testid="\${testId}"]\`, scope });
  }

  async snapshot() {
    return this.executor.execute(selector => {
      const el = document.querySelector(selector);
      const stepsHost = el.shadowRoot.querySelector('registro-wizard-steps');
      const steps = [...stepsHost.shadowRoot.querySelectorAll('ac-expandable-step')];
      return {
        open: el._open,
        modalOpen: el._modalOpen,
        activeStepIndex: steps.findIndex(step => step.active),
        errorMessage: el._errorMessage,
        registeredUser: el._registeredUser,
      };
    }, this.selector);
  }
}`,
          },
          {
            type: 'note',
            text: 'El getter `executor` (`this.scope ?? browser`) existe porque el demo de este componente carga su caso activo como un documento completo dentro de un `<iframe>` (ver `ac-demo-case`), así que no hay un "frame actual" global al que apuntar con WebDriver BiDi -- cada comando necesita el browsing context explícito. Todos los métodos que atraviesan varios shadow roots a mano (como `snapshot()`, `fillStep1()`, `clickActionButton()`) usan `this.executor.execute(...)` en vez de `this.root` justamente por eso: necesitan ese contexto correcto, que llega desde afuera como `scope`.',
          },
        ],
        checkpoint:
          'Puedes explicar, sin mirar el código, qué pasaría con el .feature del laboratorio anterior si cambiara el nombre de la clase `ac-expandable-step` dentro del shadow root del wizard: nada en el .feature se toca, solo `snapshot()` en `registro-wizard.page.js`.',
      },
      {
        id: 'e2e-03-step-definitions',
        title: '3. Conectar el .feature con los step definitions',
        estimatedMinutes: 40,
        objective:
          'Leer los step definitions reales de ac-registro-wizard y trazar cada Given/When/Then del .feature hasta el método del Page Object que termina ejecutando.',
        content: [
          { type: 'heading', text: 'Cucumber Expressions: del texto del step a una función' },
          {
            type: 'p',
            text: 'Cada `Given`/`When`/`Then` del .feature tiene una contraparte en JS con el mismo texto (con `{string}` donde el .feature pone un valor entre comillas). Cucumber empareja uno con otro por ese texto -- por eso importa escribirlo igual en ambos lados. El primer `Given` del Background abre el demo y ubica el componente; fíjate que necesita el `caseFrame()` del `DemoPage` (el `null`-o-frame del laboratorio anterior) para encontrar el wizard adentro del iframe de su caso.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test_e2e/step-definitions/registro-wizard.steps.js',
            code: `Given('el usuario está en el demo de {string}', async function (_componentName) {
  this.demoPage = await pageProvider.open(DemoPage);
  this.wizard = componentProvider.find(
    RegistroWizardPage,
    undefined,
    await this.demoPage.caseFrame(),
  );
  await this.wizard.waitForDisplayed();
  await this.wizard.setApiTimeout(1);
});

When(
  'el usuario completa el paso 1 con nombre {string} y correo {string}',
  async function (nombre, email) {
    await this.wizard.fillStep1(nombre, email);
  },
);

When('el usuario avanza al paso 2', async function () {
  await this.wizard.clickActionButton(0);
  await browser.waitUntil(async () => (await this.wizard.snapshot()).activeStepIndex === 1, {
    timeout: 3000,
    timeoutMsg: 'El wizard no avanzó al paso 2',
  });
});`,
          },
          {
            type: 'p',
            text: 'Fíjate en `el usuario avanza al paso 2`: no alcanza con hacer clic y seguir -- el wizard anima la transición entre pasos, así que el step espera con `browser.waitUntil(...)` hasta que `snapshot()` confirme que `activeStepIndex` realmente cambió, con un `timeoutMsg` explícito si nunca pasa. Los dos `Then` finales del escenario `@smoke` también pasan por `snapshot()` para leer el estado interno del componente (`modalOpen`, `registeredUser`) en vez de buscar texto en el DOM renderizado.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'test_e2e/step-definitions/registro-wizard.steps.js',
            code: `Then('el modal de registro exitoso se muestra', async function () {
  await browser.waitUntil(async () => (await this.wizard.snapshot()).modalOpen === true, {
    timeout: 3000,
    timeoutMsg: 'El modal de registro exitoso no se abrió',
  });
});

Then('el usuario registrado es {string}', async function (nombreEsperado) {
  const { registeredUser } = await this.wizard.snapshot();
  if (registeredUser?.nombre !== nombreEsperado) {
    throw new Error(
      \`Se esperaba el usuario registrado "\${nombreEsperado}", pero se encontró "\${registeredUser?.nombre}".\`,
    );
  }
});`,
          },
          {
            type: 'note',
            text: 'Otra trampa real de las Cucumber Expressions, no presente en este .feature pero real en otros del catálogo: una `/` en el texto de un step significa alternancia ("tea/coffee" matchea "tea" **o** "coffee"), nunca una barra literal. Si tu propio escenario necesita una barra literal (por ejemplo "WCAG 2.0/2.1"), ese step necesita una expresión regex (`/.../`) en vez de una Cucumber Expression.',
          },
        ],
        checkpoint:
          'Tomas cada línea del escenario `@smoke` del laboratorio 1 y dices, de memoria o señalando el archivo, qué `Given`/`When`/`Then` de `registro-wizard.steps.js` la implementa y qué método de `RegistroWizardPage` termina llamando.',
      },
      {
        id: 'e2e-04-correr-la-suite',
        title: '4. Correr la suite e2e real',
        estimatedMinutes: 30,
        objective:
          'Correr `component:test:e2e` sobre un componente y explicar qué hace cada pieza de ese comando: compilar, servir y ejecutar WebdriverIO contra el build real.',
        content: [
          { type: 'heading', text: 'Un comando, tres pasos encadenados' },
          {
            type: 'p',
            text: 'La suite e2e no corre contra el código fuente (a diferencia de los tests unitarios del Capítulo 2) sino contra el componente ya compilado, servido como lo vería un navegador real. Por eso `component:test:e2e` no es un solo comando sino tres encadenados, tal como están en el `package.json` real de ac-registro-wizard.',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'package.json (de ac-registro-wizard)',
            code: `"component:test:e2e": "pnpm run component:build && start-server-and-test component:preview http://localhost:4173 component:test:e2e:run",
"component:test:e2e:run": "wdio run test_e2e/wdio.conf.js"`,
          },
          {
            type: 'p',
            text: 'En orden: `component:build` compila los `.scss` a `.styles.js` y corre `vite build` -- el mismo build que usarías en producción. Después, `start-server-and-test` levanta `component:preview` (un `vite preview` sobre ese build, en `http://localhost:4173`), espera a que esa URL responda, y solo entonces dispara `component:test:e2e:run`. Ese último script es el que realmente arranca WebdriverIO: `wdio run test_e2e/wdio.conf.js` lee la config del paquete, carga los step definitions y corre el .feature contra el servidor que acaba de levantarse. Si el servidor nunca responde, `start-server-and-test` nunca llega a correr WDIO -- así que un timeout ahí casi siempre es un problema del build, no de la suite.',
          },
          {
            type: 'code',
            lang: 'bash',
            filename: '(desde la raíz del monorepo, o dentro del paquete)',
            code: 'pnpm --filter @ac-components/ac-registro-wizard run component:test:e2e\n# equivalente, parado dentro del paquete:\naclit component:test:e2e',
          },
          {
            type: 'note',
            text: 'En CI la suite e2e corre en un job separado (`e2e`) marcado `continue-on-error: true` -- no bloquea el merge todavía, a diferencia de `lint-and-test`. Eso no es excusa para ignorar un fallo real: es una concesión mientras se demuestra estable en la práctica, no una suite que no importa.',
          },
        ],
        checkpoint:
          'Corriste `component:test:e2e` de un componente con suite propia (o, si no tienes uno a mano, puedes explicar sin ejecutarlo) y puedes decir en qué orden se ejecutan build, preview y wdio, y qué significa un timeout de `start-server-and-test` en ese orden.',
      },
    ],
  },
  {
    id: 'contribucion',
    title: 'Capítulo 3 — Flujo de contribución (bonus)',
    summary:
      'Conventional Commits, un changeset real y abrir tu propia PR para leer los checks de CI -- sobre tu propio fork.',
    estimatedMinutes: 60,
    outcomes: [
      'Escribir un commit que pase el hook de commitlint y explicar por qué el repo usa una sola rama permanente.',
      'Generar un changeset real para un cambio propio y leer cada campo, comparándolo con changesets ya mergeados en el historial.',
      'Abrir una PR sobre tu propio fork y distinguir el check de CI que bloquea el merge del que es solo informativo.',
    ],
    labs: [
      {
        id: 'contribucion-01-commits-y-ramas',
        title: '1. Conventional Commits y trunk-based',
        estimatedMinutes: 20,
        objective:
          'Entender por qué este repo usa una sola rama permanente y Conventional Commits, y escribir un commit que pase el hook de commitlint sin que tengas que confiar en tu propia memoria del formato.',
        content: [
          { type: 'heading', text: 'Una sola rama permanente: main' },
          {
            type: 'p',
            text: 'Este repo sigue un flujo trunk-based: `main` es la única rama permanente y siempre debe quedar en estado desplegable. Todo cambio se hace en una rama corta creada desde `main`, con un prefijo igual al tipo de commit que predomina en el cambio (`feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`, `ci/`). Esa rama nunca se pushea directo a `main` -- `main` está protegida -- así que todo llega vía Pull Request, y se recomienda squash merge para que el historial de `main` quede limpio: el título del squash termina siendo el commit final.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'git checkout main && git pull --ff-only origin main\ngit checkout -b feat/mi-cambio',
          },
          { type: 'heading', text: 'El hook que no te deja mentir: commitlint + Husky' },
          {
            type: 'p',
            text: 'El `pnpm install` inicial deja activados los git hooks locales (Husky) automáticamente. Uno de ellos es `commit-msg`, que corre commitlint contra cada mensaje de commit antes de aceptarlo -- si no respeta Conventional Commits, el commit se rechaza ahí mismo, antes de que llegue a ningún lado.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'commitlint.config.js',
            code: "module.exports = {\n  extends: ['@commitlint/config-conventional'],\n  rules: {\n    'scope-case': [2, 'always', 'kebab-case'],\n  },\n};",
          },
          {
            type: 'p',
            text: 'El formato exigido es `<tipo>(<scope>): <descripción en minúscula, sin punto final>`. Los tipos permitidos son `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. El `scope` es el nombre corto del paquete afectado, en kebab-case y sin el scope de npm (`cli`, `button`, `component-mixin`, no `@ac-base/cli` ni `componentMixin`) -- esa regla de kebab-case es justamente lo que agrega este repo por encima de `@commitlint/config-conventional`, que por sí solo no la exige. Puedes usar `*` o dejar el scope vacío para un cambio que toca todo el monorepo.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'feat(cli): agregar comando `aclit generate component`\nfix(button): corregir foco perdido al deshabilitar el botón\ndocs(conventions): documentar convención de nombres de eventos\nchore: configurar husky y commitlint',
          },
          {
            type: 'note',
            text: 'La regla `scope-case` rechaza un scope como `fix(acButton):` o `fix(ac-registro-wizard):` con mayúsculas -- tiene que ser kebab-case puro. Y el tipo va siempre en inglés (`feat`, no `funcionalidad`): Conventional Commits define los tipos en inglés aunque el resto del mensaje esté en español.',
          },
        ],
        checkpoint:
          'Sobre tu propio fork, intenta un commit con un mensaje que no respete el formato (por ejemplo `git commit -m "arreglo cosas"`) y confirma que Husky/commitlint lo rechaza antes de crearse. Después repite el commit con un mensaje válido (`fix(<scope>): <descripción>`) y confirma que esta vez pasa.',
      },
      {
        id: 'contribucion-02-generar-changeset',
        title: '2. Generar un changeset real',
        estimatedMinutes: 25,
        objective:
          'Correr `pnpm changeset` para un cambio propio y entender cada campo del archivo que genera, comparándolo con dos changesets reales ya mergeados en el historial del repo.',
        content: [
          { type: 'heading', text: 'Por qué cada paquete versiona por separado' },
          {
            type: 'p',
            text: 'Cada paquete en `packages/` y `cli/` versiona de forma independiente vía Changesets. Cuando tu cambio afecta uno o más paquetes publicables, el paso es generar un changeset para ese cambio, dentro de la misma rama y el mismo PR:',
          },
          { type: 'code', lang: 'bash', code: 'pnpm changeset' },
          {
            type: 'p',
            text: 'El comando te pregunta, de forma interactiva, qué paquetes cambiaron y el tipo de bump para cada uno (`patch`/`minor`/`major`), y termina generando un archivo nuevo en `.changeset/` con un nombre aleatorio de dos o tres palabras.',
          },
          { type: 'heading', text: 'La forma real de un changeset ya mergeado' },
          {
            type: 'p',
            text: "Estos archivos se consumen y se borran cuando alguien corre `pnpm version-packages`, así que no vas a encontrar ninguno en el working tree actual -- pero sí en el historial de git, con `git log --all --diff-filter=A -- '.changeset/*.md'`. Así se ve uno real, para un cambio que tocó un solo paquete:",
          },
          {
            type: 'code',
            lang: 'md',
            filename:
              '.changeset/cli-ac-router-range-fix.md (ya consumido -- visible solo en el historial de git)',
            code: "---\n'@ac-base/cli': patch\n---\n\nCorrige el rango externo de `@ac-base/ac-router` (`^0.1.0` → `^0.2.0`) en el scaffolding de `app:create` fuera del workspace -- la versión anterior no existe en el registro público y rompía `npm install` en cualquier app generada afuera de `ac-lit`.",
          },
          {
            type: 'p',
            text: 'El frontmatter YAML (entre los dos `---`) es una lista de paquetes afectados, cada uno con su tipo de bump como valor -- acá, un solo paquete en `patch`. Todo lo que va después del frontmatter es prosa libre: la descripción que Changesets copia tal cual al `CHANGELOG.md` de ese paquete cuando corre `version-packages`, así que vale la pena escribirla pensando en quien la lea ahí, no en quien revisa el PR.',
          },
          {
            type: 'p',
            text: 'Un mismo changeset puede listar varios paquetes a la vez, cada uno con su propio bump, cuando un solo PR los cambia juntos -- por ejemplo, este otro, para un cambio que tocó dos paquetes del catálogo con la misma descripción:',
          },
          {
            type: 'code',
            lang: 'md',
            filename:
              '.changeset/icon-input-semantic-types.md (ya consumido -- visible solo en el historial de git)',
            code: "---\n'@ac-components/ac-icon-basic': minor\n'@ac-components/ac-input-basic': minor\n---\n\n`ac-icon-basic` suma 4 íconos nuevos (`email`, `calendar`, `currency`, `hash`). `ac-input-basic` suma una capa semántica sobre `type` (`amount`, `date`, `number`, `email`) que muestra un ícono a la izquierda y un placeholder sugerido por tipo, sin cambiar el `type` nativo del `<input>` ni el comportamiento existente de `password`/`search`/`tel`/`url`.",
          },
          {
            type: 'note',
            text: 'Si tu componente nuevo depende de otro paquete interno vía `workspace:^`, no necesitas declarar a mano que esa dependencia también sube de versión -- `updateInternalDependencies: "patch"` en `.changeset/config.json` ya lo resuelve solo cuando alguien corre `version-packages`.',
          },
        ],
        checkpoint:
          'Sobre tu propio fork, corre `pnpm changeset` para un cambio real (aunque sea mínimo) en un paquete de `packages/` o `cli/`, elige un tipo de bump, y confirma que el `.md` generado en `.changeset/` tiene el nombre de tu paquete en el frontmatter y una descripción que te gustaría leer en un CHANGELOG.',
      },
      {
        id: 'contribucion-03-pr-y-ci',
        title: '3. Abrir tu PR y leer los 2 checks de CI',
        estimatedMinutes: 15,
        objective:
          'Abrir una PR real sobre tu propio fork con el commit y el changeset de los laboratorios anteriores, y entender la diferencia entre el check de CI que bloquea el merge y el que es solo informativo.',
        content: [
          { type: 'heading', text: 'PR sobre tu fork, nunca push directo' },
          {
            type: 'p',
            text: '`main` está protegida: no se puede pushear directo, así que tu rama llega siempre vía Pull Request, y ese PR debe pasar CI (lint + test) antes de poder mergearse. Se recomienda squash merge, con el título del squash en formato Conventional Commits -- el mismo formato que ya practicaste en el primer laboratorio, porque ese título termina siendo el commit final en `main`.',
          },
          { type: 'heading', text: 'Los 2 jobs de .github/workflows/ci.yml' },
          {
            type: 'p',
            text: 'Cada PR dispara dos jobs. Así se ve la cabecera real de cada uno:',
          },
          {
            type: 'code',
            lang: 'yaml',
            filename: '.github/workflows/ci.yml',
            code: 'jobs:\n  lint-and-test:\n    runs-on: ubuntu-latest\n    # ... Lint, Format check, Test, Build\n\n  e2e:\n    runs-on: ubuntu-latest\n    # No bloqueante todavía: no es (ni debe agregarse a) un required status check\n    # de `main` hasta que la suite demuestre estabilidad en varias corridas.\n    continue-on-error: true\n    # ... E2E tests, Accessibility tests',
          },
          {
            type: 'p',
            text: '`lint-and-test` (lint + `format:check` + `test` + `build`) es bloqueante -- si falla, el botón de merge queda deshabilitado. `e2e` (`test:e2e` + `test:e2e:a11y`) es no bloqueante gracias a `continue-on-error: true`: corre igual en cada PR y te muestra el resultado, pero una falla ahí no te impide mergear.',
          },
          {
            type: 'note',
            text: 'Que `e2e` sea no bloqueante no significa que no importe: `continue-on-error: true` evita que una falla ahí tumbe el check obligatorio, pero el resultado sigue visible en la lista de checks del PR. Si falla, vale la pena abrir sus logs antes de mergear -- la suite todavía no es lo bastante estable como para exigirla, pero una falla real sigue siendo una señal real.',
          },
        ],
        checkpoint:
          'Abre una PR real desde tu fork con el commit del laboratorio 1 y el changeset del laboratorio 2, espera a que terminen los dos checks en la lista de la PR, y confirma cuál de los dos (`lint-and-test` o `e2e`) es el que de verdad bloquea el botón de merge si falla.',
      },
    ],
  },
  {
    id: 'js-intermedio',
    title: 'Capítulo 4 — JavaScript intermedio: prototipos, módulos y programación defensiva',
    summary:
      'Prototipos y herencia prototípica, módulos y encapsulación, el event loop, y hábitos de programación defensiva -- todo con ejemplos reales de este mismo catálogo.',
    estimatedMinutes: 180,
    outcomes: [
      'Explicar la cadena de prototipos y cómo class/extends y las mixins de este catálogo la usan en la práctica.',
      'Explicar cómo los módulos ESM encapsulan estado, conectando con el closure de módulo que ya viste en Básico.',
      'Trazar el orden de ejecución entre código síncrono, microtasks y macrotasks en el event loop.',
      'Aplicar optional chaining, nullish coalescing, parámetros por defecto, copiar antes de modificar, un default en switch, y explicar por qué el modo estricto ya viene activado en este proyecto.',
    ],
    labs: [
      {
        id: 'js-intermedio-01-prototipos-y-modulos',
        title: '1. Prototipos y módulos',
        estimatedMinutes: 60,
        objective:
          'Entender qué construye realmente class/extends por debajo, cómo los mixins de este catálogo encadenan ese mismo mecanismo varias veces, y cómo un módulo ESM encapsula estado con la misma lógica que un closure.',
        content: [
          { type: 'heading', text: 'Qué construye realmente class/extends' },
          {
            type: 'p',
            text: '`class Hijo extends Padre {}` es azúcar sintáctico sobre un mecanismo más viejo: cada instancia de Hijo tiene como prototipo a Hijo.prototype, y Hijo.prototype tiene como su propio prototipo a Padre.prototype. Cuando llamas un método, el motor busca primero en el objeto, después en Hijo.prototype, después en Padre.prototype, y así sube la cadena hasta Object.prototype. extends solo arma ese enlace por ti.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `class Animal {
  hacerSonido() {
    return 'algún sonido';
  }
}

class Perro extends Animal {
  hacerSonido() {
    return 'guau';
  }
}

const rex = new Perro();
Object.getPrototypeOf(rex) === Perro.prototype; // true
Object.getPrototypeOf(Perro.prototype) === Animal.prototype; // true`,
          },
          {
            type: 'note',
            text: 'Object.getPrototypeOf no es un truco de laboratorio: es la forma directa de leer esa cadena en cualquier objeto real, incluyendo un elemento del DOM. Lo vas a usar en el checkpoint de este laboratorio.',
          },
          { type: 'heading', text: 'Un mixin es el mismo mecanismo, aplicado en cadena' },
          {
            type: 'p',
            text: 'Todo componente de este catálogo extiende ComponentMixin(LitElement) en vez de LitElement directo. Un "mixin" acá no es magia nueva: es una función que recibe una clase y devuelve otra clase que la extiende -- exactamente el mismo extends de arriba, solo que la clase padre se calcula en tiempo de ejecución en vez de escribirse a mano.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-component-mixin/src/component-mixin.js',
            code: `export const ComponentMixin = superClass =>
  class extends IntlMixin(ScopedElementsMixin(superClass)) {
    static get properties() {
      return {
        ...(super.properties || {}),
        ambient: { type: String, reflect: true },
        mode: { type: String, reflect: true },
        loading: { type: Boolean, reflect: true },
        loadingA11yLabel: { type: String, attribute: 'loading-a11y-label' },
        mediaRangeConfig: { type: Object, attribute: 'media-range-config' },
      };
    }`,
          },
          {
            type: 'p',
            text: 'Fíjate en el orden: primero se evalúa ScopedElementsMixin(superClass), que devuelve una clase intermedia; IntlMixin envuelve esa clase intermedia; y la clase de ComponentMixin extiende el resultado de todo eso. Cada capa se inserta en la cadena de prototipos entre la clase final y superClass (LitElement, en este caso) -- no son tres mecanismos distintos conviviendo, es un solo extends aplicado tres veces, una dentro de la otra.',
          },
          {
            type: 'note',
            text: 'Por eso un componente como ac-tabs-basic, que escribe `class TabsBasic extends ComponentMixin(LitElement)`, termina con una cadena de cinco o más eslabones antes de llegar a HTMLElement.prototype: su propio prototype, el de la clase de ComponentMixin, el de IntlMixin, el de ScopedElementsMixin, y el de LitElement/ReactiveElement.',
          },
          { type: 'heading', text: 'Módulos y encapsulación' },
          {
            type: 'p',
            text: 'Ya viste en Básico un closure real de ac-intl-mixin que encapsula estado a nivel de módulo: una variable de locale global y dos Map que ningún otro archivo puede tocar directamente. La encapsulación por módulo es justamente ese mismo mecanismo, sin necesitar ninguna función envolvente de por medio -- alcanza con que algo esté declarado en el nivel superior de un archivo y nunca se exporte con export.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-intl-mixin/src/intl-mixin.js',
            code: `let globalLocale = 'es-PE';
const translationsCache = new Map();
const translationsRegistry = new Map();

export function registerTranslations(tagName, localesData) {
  if (typeof tagName !== 'string' || !tagName) return;
  translationsRegistry.set(tagName, localesData || {});
}

export function getRegisteredTranslations(tagName) {
  if (typeof tagName !== 'string' || !tagName) return undefined;
  return translationsRegistry.get(tagName);
}`,
          },
          {
            type: 'p',
            text: 'globalLocale, translationsCache y translationsRegistry no aparecen en ningún export de este archivo, así que son invisibles fuera de él. La única manera de leer o escribir translationsRegistry desde otro módulo es a través de registerTranslations y getRegisteredTranslations -- dos funciones exportadas que actúan como la API pública de ese estado privado, igual que un closure expone solo lo que decide devolver.',
          },
        ],
        checkpoint:
          'Con el demo de ac-tabs-basic montado en la página, guarda el elemento en una variable desde la consola del navegador y encadena Object.getPrototypeOf varias veces (el.__proto__, su propio __proto__, y así) hasta llegar a HTMLElement.prototype. Confirma que pasas por una clase de ComponentMixin, una de IntlMixin y una de ScopedElementsMixin antes de llegar ahí.',
      },
      {
        id: 'js-intermedio-02-event-loop',
        title: '2. El event loop: call stack, macrotasks y microtasks',
        estimatedMinutes: 60,
        objective:
          'Entender el mecanismo del event loop -- call stack, cola de macrotasks y cola de microtasks -- y predecir con certeza el orden de ejecución entre código síncrono, temporizadores y promesas.',
        content: [
          { type: 'heading', text: 'Una sola hebra, un call stack' },
          {
            type: 'p',
            text: 'JavaScript corre en una sola hebra: solo hay un call stack, y mientras ese stack no esté vacío, no se ejecuta nada más -- ni un temporizador, ni el callback de una promesa, ni un evento de clic. Cada función que llamas se apila arriba, y se desapila cuando termina.',
          },
          { type: 'heading', text: 'Dos colas, no una' },
          {
            type: 'p',
            text: 'Cuando el call stack se vacía, el motor no va directo a "lo que sigue" de forma simple: tiene dos colas separadas. La cola de microtasks guarda los callbacks de promesas (.then, .catch, .finally) y queueMicrotask. La cola de macrotasks (a veces llamada "cola de tareas") guarda cosas como setTimeout, setInterval y la mayoría de eventos del DOM. La regla es: cada vez que el call stack queda vacío, el motor vacía completo la cola de microtasks (todas, una por una, incluyendo las que se agregan mientras la vacía) antes de sacar una sola macrotask de la otra cola.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `console.log('1 - sincrónico');

setTimeout(() => console.log('4 - macrotask (setTimeout)'), 0);

Promise.resolve().then(() => console.log('3 - microtask (promise)'));

console.log('2 - sincrónico');

// Orden real: 1, 2, 3, 4`,
          },
          {
            type: 'note',
            text: 'setTimeout(fn, 0) no significa "ejecuta ya": significa "encola fn como macrotask tan pronto como sea posible". Esa macrotask siempre espera a que el código síncrono actual termine y a que la cola de microtasks quede completamente vacía, así el delay sea 0.',
          },
          { type: 'heading', text: 'Un caso real: esperar un timer encadenado con await' },
          {
            type: 'p',
            text: 'Este helper real de la suite de ac-registro-wizard avanza el wizard hasta el paso 3 encadenando varios await. aTimeout viene de @open-wc/testing y es, literalmente, un setTimeout envuelto en una promesa: resolver esa promesa es una macrotask que se encola y se resuelve recién cuando le toca su turno.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/test/registro-wizard.test.js',
            code: `async function advanceToStep3(el) {
  await fillStep1(el);
  clickActionButton(el, 0);
  await aTimeout(30);
  acceptTerminos(el);
  await stepsHost(el).updateComplete;
  clickActionButton(el, 1);
  await aTimeout(30);
}`,
          },
          {
            type: 'p',
            text: 'Cada await aTimeout(30) pausa la función async en ese punto exacto: el resto de advanceToStep3 no se sigue ejecutando hasta que esa macrotask de 30ms se resuelva y, además, se vacíe la cola de microtasks que se haya acumulado mientras tanto. Por eso el orden entre esta función y cualquier otro código que corra "al mismo tiempo" en la suite es predecible, no accidental.',
          },
          {
            type: 'note',
            text: "La misma suite usa oneEvent(el, nombreDelEvento) para esperar un evento real en vez de un timer: const successEvent = oneEvent(el, 'ac-registro-wizard-register-success'); clickActionButton(el, 2); const event = await successEvent;. También es una promesa, pero la dispara un listener de evento, no un setTimeout -- el disparador es distinto, pero una vez que se resuelve, pasa por la misma cola de microtasks que cualquier otra promesa.",
          },
          {
            type: 'note',
            text: 'En Avanzado vas a usar este mismo mecanismo para entender promesas y async/await a fondo -- acá solo necesitas el orden de ejecución, no construir tus propias promesas todavía.',
          },
        ],
        checkpoint:
          'Antes de ejecutar nada, predice en papel el orden exacto en que se imprimen los console.log del snippet de este laboratorio que mezcla código síncrono, un setTimeout y un Promise.resolve().then(). Después corre ese mismo snippet en la consola del navegador y confirma si tu predicción fue correcta.',
      },
      {
        id: 'js-intermedio-03-programacion-defensiva',
        title: '3. Programación defensiva',
        estimatedMinutes: 60,
        objective:
          'Reconocer y aplicar un conjunto de hábitos de programación defensiva -- optional chaining, nullish coalescing, parámetros por defecto, scope de bloque, un default en switch y copiar antes de modificar -- con ejemplos reales de este catálogo.',
        content: [
          {
            type: 'heading',
            text: 'Optional chaining y nullish coalescing, juntos en un componente real',
          },
          {
            type: 'p',
            text: 'ac-tabs-basic recibe sus pestañas como un array que puede traer strings sueltos u objetos parciales. normalizeTab y _selectedId muestran optional chaining (?.) y nullish coalescing (??) trabajando en conjunto para nunca asumir que un valor existe.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/components/ac-tabs-basic/src/tabs-basic.js',
            code: `function normalizeTab(tab) {
  if (typeof tab === 'string') return { id: tab, label: tab, disabled: false };
  const id = String(tab?.id ?? '');
  return { id, label: String(tab?.label ?? id), disabled: Boolean(tab?.disabled) };
}

get _selectedId() {
  const tabs = this._tabs;
  const match = tabs.find(tab => tab.id === this.selected && !tab.disabled);
  return (match ?? tabs.find(tab => !tab.disabled))?.id ?? '';
}`,
          },
          {
            type: 'p',
            text: 'tab?.id devuelve undefined en vez de lanzar un error si tab fuera null o undefined. El operador ?? solo entra en acción cuando el valor de la izquierda es null o undefined -- nunca para 0, cadena vacía o false. En _selectedId, el encadenamiento completo dice: "usa la pestaña seleccionada y habilitada; si no hay, usa la primera habilitada que encuentres; si tampoco hay ninguna habilitada, devuelve una cadena vacía en vez de undefined".',
          },
          {
            type: 'note',
            text: "?? no es lo mismo que ||. 0 || 'valor' da 'valor' porque 0 es falsy para ||, pero 0 ?? 'valor' da 0 porque 0 no es null ni undefined. Si alguna vez necesitas distinguir \"no me mandaron nada\" de \"me mandaron un 0 real\", ?? es el operador correcto y || te va a jugar en contra.",
          },
          { type: 'heading', text: 'Parámetros por defecto, en el mismo mixin que ya conoces' },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-component-mixin/src/component-mixin.js',
            code: `sanitizeHtml(content, allowedTags = null, tagNameCheck = null) {
  const config = allowedTags ? { ALLOWED_TAGS: allowedTags } : {};

  if (typeof tagNameCheck !== 'function') {
    return DOMPurify.sanitize(content ?? '', config);
  }`,
          },
          {
            type: 'note',
            text: 'Un parámetro por defecto solo se activa cuando el argumento llega como undefined -- no cuando llega como null. Por eso sanitizeHtml no confía en allowedTags = null para filtrar: si alguien llama sanitizeHtml(texto, null) a propósito, allowedTags sigue siendo null (el default no se activa), y la línea siguiente lo trata como "sin filtro" con el operador ternario, no con otro ??. Es la misma razón por la que tagNameCheck se valida con typeof en vez de confiar en que el default alcance para cualquier entrada rara.',
          },
          { type: 'heading', text: 'Bloques {} y un default que nunca falta, dentro de un switch' },
          {
            type: 'p',
            text: 'Un switch comparte un único scope entre todos sus case a menos que abras tu propio bloque {} dentro de cada uno. Si dos case declaran const o let con el mismo nombre sin su propio bloque, el motor lanza un error de identificador duplicado -- aunque los case nunca se ejecuten juntos.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `function etiquetaDeAmbient(ambient) {
  switch (ambient) {
    case 'light': {
      const etiqueta = 'Modo claro';
      return etiqueta;
    }
    case 'dark': {
      const etiqueta = 'Modo oscuro';
      return etiqueta;
    }
    default:
      return 'Modo desconocido';
  }
}`,
          },
          {
            type: 'note',
            text: 'El default no es solo cortesía para quien lee el código: es la red que atrapa un valor que no anticipaste (un typo, un valor viejo que quedó guardado, una respuesta inesperada de una API) antes de que se propague como undefined silencioso más adelante en la aplicación.',
          },
          {
            type: 'heading',
            text: 'Copiar antes de modificar: el bug real que evita que Lit vuelva a renderizar',
          },
          {
            type: 'p',
            text: 'tabs en ac-tabs-basic es una property reactiva declarada como tabs: { type: Array }. Lit decide si debe volver a renderizar comparando, en cada asignación, la referencia anterior contra la nueva -- no el contenido. Si mutas el mismo array en el lugar, la referencia nunca cambia, y Lit no detecta ningún cambio.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `// NO dispara render: la referencia de \`tabs\` no cambia
elemento.tabs.push({ id: 'nueva', label: 'Nueva' });

// Sí dispara render: Lit ve una referencia nueva y vuelve a pintar
elemento.tabs = [...elemento.tabs, { id: 'nueva', label: 'Nueva' }];`,
          },
          {
            type: 'note',
            text: 'La misma regla aplica a un objeto: elemento.config.x = 1 muta el objeto existente (ninguna referencia cambió), mientras que elemento.config = { ...elemento.config, x: 1 } crea uno nuevo y sí dispara el render. El hábito defensivo es siempre el mismo: nunca llames push, splice, sort o una asignación de propiedad directa sobre un array u objeto que sea una property reactiva -- copia primero, modifica la copia, y asigna la copia completa.',
          },
          { type: 'heading', text: 'Por qué "use strict" ya viene activado solo' },
          {
            type: 'p',
            text: 'Ningún archivo de este catálogo escribe la directiva "use strict" a mano, y no hace falta: todos los package.json del monorepo declaran "type": "module", y los módulos ES son estrictos por defecto según la propia especificación del lenguaje, sin que nadie tenga que pedirlo.',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'packages/components/ac-text-basic/package.json',
            code: `"type": "module",
"main": "index.js",`,
          },
          {
            type: 'note',
            text: 'El modo estricto es justamente lo que vuelve defensivos varios de los hábitos de este laboratorio en algo obligatorio y no opcional: por ejemplo, asignar a una variable no declarada lanza un error en vez de crear silenciosamente una variable global, y un parámetro duplicado en la firma de una función es un error de sintaxis directo.',
          },
        ],
        checkpoint:
          'Con el demo de ac-tabs-basic montado, guarda el elemento en una variable desde la consola, ejecuta elemento.tabs.push({ id: "x", label: "X" }) y confirma que no cambia nada en pantalla. Después ejecuta elemento.tabs = [...elemento.tabs, { id: "x", label: "X" }] y confirma que la pestaña nueva sí aparece.',
      },
    ],
  },
];

// Avanzado retoma el mismo proyecto, primero con un repaso profundo de
// JavaScript (Capítulo 0) y después con la guía real de construcción de
// una aplicación completa (Capítulo 1 en adelante) -- numeración propia,
// igual criterio que Intermedio: cada nivel es su propia página.
const AVANZADO_CHAPTERS = [
  {
    id: 'js-avanzado',
    title: 'Capítulo 0 — JavaScript avanzado',
    summary:
      'Promesas y funciones asíncronas, funciones de orden superior, currying y composición, metaprogramación con Proxy/Reflect, generadores e iteradores, y tagged template literals -- la base real de html`` y css`` de Lit.',
    estimatedMinutes: 250,
    outcomes: [
      'Escribir y razonar sobre código asíncrono con promesas y async/await, entendiendo su relación con el event loop ya visto en Intermedio.',
      'Escribir funciones de orden superior, aplicar currying y componer funciones pequeñas en una sola operación.',
      'Explicar qué resuelven Proxy y Reflect, con un caso de uso real y sus límites.',
      'Escribir un generador propio y explicar la relación entre iterables, iteradores y el protocolo Symbol.iterator.',
      'Explicar qué es una tagged template literal y cómo exactamente ese mecanismo es lo que hace funcionar a html`` y css`` de Lit.',
    ],
    labs: [
      {
        id: 'js-avanzado-01-promesas-async-await',
        title: '1. Promesas y funciones asíncronas',
        estimatedMinutes: 50,
        objective:
          'Entender qué es una promesa, encadenarla con .then()/.catch(), y escribir el mismo flujo con async/await, incluido el manejo de errores con try/catch.',
        content: [
          { type: 'heading', text: 'Qué es una promesa' },
          {
            type: 'p',
            text: 'Una promesa es un objeto que representa un valor que todavía no existe, pero que en algún momento va a existir (o va a fallar). Tiene exactamente tres estados posibles: `pending` (ni resuelta ni rechazada todavía), `fulfilled` (se resolvió con un valor) y `rejected` (se rechazó con un error). Una vez que pasa de `pending` a cualquiera de los otros dos, queda fija para siempre -- no puede volver a cambiar de estado.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido',
            code: `const esperar = ms =>
  new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error('ms no puede ser negativo'));
      return;
    }
    setTimeout(() => resolve(\`esperaste \${ms}ms\`), ms);
  });

esperar(100); // pending al crearla -- todavía no se resolvió ni se rechazó`,
          },
          {
            type: 'note',
            text: 'El constructor `new Promise((resolve, reject) => {...})` recibe una función con dos parámetros: llamar a `resolve(valor)` pasa la promesa a `fulfilled`, llamar a `reject(error)` la pasa a `rejected`. Nada obliga a llamar a ninguna de las dos -- si no llamas a ninguna, la promesa queda en `pending` para siempre, una fuga real y difícil de detectar.',
          },
          { type: 'heading', text: 'Encadenar con .then() y .catch()' },
          {
            type: 'p',
            text: '`.then(onFulfilled, onRejected)` registra qué hacer cuando la promesa se resuelve (y, opcionalmente, qué hacer si se rechaza). Cada `.then()` devuelve una promesa nueva, así que se pueden encadenar uno tras otro: el valor que devuelve un `.then()` se convierte en el valor que recibe el siguiente. `.catch()` es equivalente a un `.then(undefined, onRejected)` al final de la cadena -- atrapa cualquier rechazo ocurrido en cualquier paso anterior, no solo el inmediatamente anterior.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido',
            code: `esperar(200)
  .then(mensaje => {
    console.log(mensaje); // "esperaste 200ms"
    return esperar(50);
  })
  .then(mensaje => console.log(mensaje)) // "esperaste 50ms"
  .catch(error => console.error('algo falló en la cadena:', error.message));`,
          },
          { type: 'heading', text: 'async/await: azúcar sintáctica sobre promesas' },
          {
            type: 'p',
            text: 'Una función declarada con `async` siempre devuelve una promesa, aunque dentro de ella escribas un `return` normal -- el valor devuelto se envuelve solo. Dentro de una función `async`, `await promesa` pausa esa función (no el programa entero) hasta que la promesa se resuelve, y el `await` "se convierte" en el valor resuelto. Es exactamente el mismo mecanismo de `.then()` por debajo, solo que se lee como código secuencial en vez de una cadena de callbacks.',
          },
          {
            type: 'code',
            lang: 'js',
            filename:
              'ejemplo autocontenido -- mismo flujo que el bloque anterior, con async/await',
            code: `async function demo() {
  const primero = await esperar(200);
  console.log(primero); // "esperaste 200ms"

  const segundo = await esperar(50);
  console.log(segundo); // "esperaste 50ms"
}`,
          },
          {
            type: 'note',
            text: 'Ya viste en Intermedio que una promesa resuelta encola su callback como microtask, y que las microtasks se vacían completas antes de que el event loop tome la siguiente macrotask pendiente. `await` no cambia ese mecanismo -- sigue siendo una microtask por debajo. Lo único que cambia es la sintaxis: en vez de pasar un callback a `.then()`, el motor "pausa" la función `async` en ese punto y la retoma cuando la microtask de esa promesa se ejecuta.',
          },
          { type: 'heading', text: 'Manejo de errores con try/catch en código async' },
          {
            type: 'p',
            text: 'Dentro de una función `async`, un `await` sobre una promesa rechazada lanza esa excepción en el punto exacto donde está el `await`, así que se atrapa con un `try/catch` normal -- la misma herramienta que ya usas para código síncrono, sin aprender nada nuevo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido',
            code: `async function demoConError() {
  try {
    const resultado = await esperar(-5); // esta promesa se rechaza
    console.log(resultado); // nunca se llega aquí
  } catch (error) {
    console.error('capturado:', error.message); // "capturado: ms no puede ser negativo"
  }
}`,
          },
          {
            type: 'note',
            text: 'Una trampa real: si llamas a una función `async` sin `await` (por ejemplo dentro de un `.forEach()`, que no espera nada), un rechazo dentro de ella no lo atrapa ningún `try/catch` que la rodee -- esa promesa queda rechazada "al aire". Si necesitas lanzar varias llamadas async desde un bucle y esperar a todas, usa `await Promise.all([...])` sobre un `.map()`, nunca un `.forEach()` con `await` adentro (el `await` ahí no detiene al `forEach`, que ya sigue a la siguiente iteración sin esperar).',
          },
        ],
        checkpoint:
          'Puedes explicar en una frase qué significa cada uno de los tres estados de una promesa, y reescribir una cadena de `.then()`/`.catch()` como una función `async` equivalente con `try/catch`, sin que cambie el comportamiento.',
      },
      {
        id: 'js-avanzado-02-orden-superior-currying-composicion',
        title: '2. Funciones de orden superior, currying y composición',
        estimatedMinutes: 50,
        objective:
          'Reconocer una función de orden superior en código real del repositorio, escribir una función curry propia, y componer funciones pequeñas en una sola con compose/pipe.',
        content: [
          { type: 'heading', text: 'Qué es una función de orden superior' },
          {
            type: 'p',
            text: 'Una función de orden superior (higher-order function, HOF) es una función que recibe otra función como argumento, devuelve una función, o ambas cosas. No hace falta buscar un ejemplo inventado: `.filter()` y `.map()`, que ya usas todo el tiempo sobre arrays, son HOF -- cada una recibe una función como argumento y la aplica. Este es un fragmento real del propio repositorio que encadena varias.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'scripts/catalog-serve.mjs',
            code: `const names = readdirSync(componentsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .filter(name => existsSync(join(componentsDir, name, 'package.json')))
  .filter(name => only.length === 0 || only.includes(name))
  .sort();`,
          },
          {
            type: 'p',
            text: 'Cada `.filter()` recibe una función que decide, entrada por entrada, si se queda o se descarta; `.map()` recibe una función que transforma cada entrada en otra cosa (de un objeto `Dirent` a su nombre de string). Ninguna de esas cuatro llamadas sabe de antemano qué condición vas a aplicar -- reciben esa lógica como argumento, en vez de tenerla escrita adentro. Eso es exactamente lo que hace a una función "de orden superior": no importa el resultado final, importa que la función en sí misma es un parámetro.',
          },
          { type: 'heading', text: 'Currying' },
          {
            type: 'p',
            text: 'Currying es transformar una función que recibe varios argumentos a la vez en una cadena de funciones que reciben un argumento cada una, y van devolviendo la siguiente función hasta que ya tienen todos los datos que necesitan para calcular el resultado final.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido',
            code: `// Sin curry: los tres argumentos llegan juntos.
function calcularDescuento(precio, porcentaje, impuesto) {
  return precio * (1 - porcentaje) * (1 + impuesto);
}

// Con curry: uno a la vez, cada llamada devuelve la siguiente función.
const calcularDescuentoCurry = precio => porcentaje => impuesto =>
  precio * (1 - porcentaje) * (1 + impuesto);

calcularDescuentoCurry(100)(0.2)(0.18); // 94.4 -- mismo resultado

// La utilidad real: fijar un argumento y reutilizar la función resultante.
const descuentoSobre100 = calcularDescuentoCurry(100);
descuentoSobre100(0.1)(0.18); // 106.2
descuentoSobre100(0.3)(0.18); // 82.6`,
          },
          {
            type: 'note',
            text: 'El valor del currying no es la sintaxis en sí, sino poder fijar los primeros argumentos de una función y quedarte con una versión especializada y reutilizable, sin tener que repetir esos argumentos cada vez que la llamas.',
          },
          { type: 'heading', text: 'Composición: compose y pipe' },
          {
            type: 'p',
            text: 'Componer funciones es combinar varias funciones pequeñas, cada una con una sola responsabilidad, en una sola operación que las aplica en cadena. `pipe` las aplica de izquierda a derecha (en el orden en que las escribes); `compose` las aplica de derecha a izquierda (el orden clásico de composición matemática, `f(g(x))`).',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido',
            code: `const pipe = (...fns) => valorInicial => fns.reduce((valor, fn) => fn(valor), valorInicial);
const compose = (...fns) => valorInicial => fns.reduceRight((valor, fn) => fn(valor), valorInicial);

const limpiar = texto => texto.trim();
const minusculas = texto => texto.toLowerCase();
const sinEspaciosDobles = texto => texto.replace(/\\s+/g, ' ');

const normalizar = pipe(limpiar, minusculas, sinEspaciosDobles);
normalizar('  Hola   Mundo  '); // "hola mundo"

// compose([a, b, c])(x) === a(b(c(x))) -- mismo resultado, orden invertido al leerlo
const normalizarCompose = compose(sinEspaciosDobles, minusculas, limpiar);
normalizarCompose('  Hola   Mundo  '); // "hola mundo"`,
          },
          {
            type: 'note',
            text: 'Una trampa común: confundir el orden de `pipe` y `compose` al leer código de otra persona. Si tienes dudas sobre cuál usa una función dada, prueba con dos funciones muy distintas entre sí (por ejemplo una que suma y otra que multiplica) y compara el resultado contra aplicar cada una a mano -- el orden equivocado casi siempre da un resultado visiblemente distinto, no un error silencioso.',
          },
        ],
        checkpoint:
          'Puedes señalar, en el fragmento de `catalog-serve.mjs`, por qué cada `.filter()`/`.map()` es una función de orden superior, y escribir desde cero una función `pipe` (o `compose`) de dos líneas que combine tres funciones simples en una.',
      },
      {
        id: 'js-avanzado-03-metaprogramacion-proxy-reflect',
        title: '3. Metaprogramación: Proxy y Reflect',
        estimatedMinutes: 50,
        objective:
          'Entender qué operaciones fundamentales sobre un objeto permiten interceptar Proxy y Reflect, construir un caso de uso real, y reconocer sus límites y costos.',
        content: [
          { type: 'heading', text: 'Qué resuelven Proxy y Reflect' },
          {
            type: 'p',
            text: 'Un `Proxy` envuelve un objeto y te deja interceptar las operaciones fundamentales que se hacen sobre él -- leer una propiedad, escribirla, comprobar si existe con `in`, borrarla, listar sus claves, etc. -- en vez de dejar que el motor de JavaScript las resuelva directamente contra el objeto original. Se crea con `new Proxy(objetivo, handler)`, donde `handler` es un objeto cuyas funciones ("traps") se ejecutan en el momento de cada operación interceptada.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido -- validación automática al escribir',
            code: `function crearPersonaValidada() {
  return new Proxy(
    {},
    {
      set(objetivo, propiedad, valor) {
        if (propiedad === 'edad' && (typeof valor !== 'number' || valor < 0)) {
          throw new TypeError('edad debe ser un número mayor o igual a 0');
        }
        objetivo[propiedad] = valor;
        return true; // obligatorio: indica que la asignación se aceptó
      },
    },
  );
}

const persona = crearPersonaValidada();
persona.nombre = 'Ana'; // pasa derecho, no hay regla para "nombre"
persona.edad = 30; // pasa la validación
persona.edad = -5; // lanza TypeError antes de llegar a guardarse`,
          },
          { type: 'heading', text: 'Reflect: el complemento de Proxy' },
          {
            type: 'p',
            text: '`Reflect` expone, como funciones normales, el comportamiento por defecto de esas mismas operaciones fundamentales (`Reflect.get`, `Reflect.set`, `Reflect.has`, `Reflect.deleteProperty`, etc.). Dentro de un handler de `Proxy` casi siempre conviene llamar a la función `Reflect` correspondiente para delegar el comportamiento estándar, en vez de reimplementarlo a mano (como hizo `objetivo[propiedad] = valor` arriba, que funciona pero no es la forma recomendada en casos más complejos, por ejemplo con herencia de por medio).',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido -- logger de accesos, con Reflect como fallback',
            code: `function conLoggerDeAccesos(objetivo) {
  return new Proxy(objetivo, {
    get(objetivo, propiedad, receptor) {
      console.log(\`lectura de "\${String(propiedad)}"\`);
      return Reflect.get(objetivo, propiedad, receptor); // comportamiento estándar
    },
    set(objetivo, propiedad, valor, receptor) {
      console.log(\`escritura de "\${String(propiedad)}" = \${valor}\`);
      return Reflect.set(objetivo, propiedad, valor, receptor);
    },
  });
}

const config = conLoggerDeAccesos({ tema: 'oscuro' });
config.tema; // log: lectura de "tema" -- y devuelve "oscuro"
config.tema = 'claro'; // log: escritura de "tema" = claro`,
          },
          { type: 'heading', text: 'Límites y costos' },
          {
            type: 'note',
            text: 'Proxy tiene un costo real, no solo teórico: cada operación interceptada pasa por una función adicional antes de llegar al objeto real, así que un acceso a través de un Proxy es más lento que un acceso directo. También es más difícil de depurar -- un `console.log` sobre un objeto envuelto en Proxy no siempre muestra sus valores reales directamente, y un stack trace no deja ver que una asignación pasó por un trap antes de guardarse. Por eso, usarlo solo cuando el problema concreto (validación transversal, objetos de solo lectura, logging automático) lo justifica, no como primera opción.',
          },
          {
            type: 'note',
            text: 'Este catálogo no usa Proxy ni Reflect en ningún componente real de `packages/` -- es una decisión deliberada: el catálogo prioriza código explícito y fácil de rastrear sobre mecanismos "mágicos" como este, incluso cuando Proxy resolvería algo de forma más compacta. Eso no significa que no sirva conocerlos: son parte real del lenguaje y aparecen en librerías de terceros (frameworks de reactividad, ORMs, mocks de pruebas), solo que no es el estilo que este repositorio elige para su propio código.',
          },
        ],
        checkpoint:
          'Puedes explicar con tus palabras qué hace el trap `set` del primer ejemplo si le quitas la validación de `edad`, y por qué llamar a `Reflect.get`/`Reflect.set` dentro de un handler es preferible a acceder al objetivo directamente.',
      },
      {
        id: 'js-avanzado-04-generadores-e-iteradores',
        title: '4. Generadores e iteradores',
        estimatedMinutes: 50,
        objective:
          'Escribir una función generadora con function*/yield, entender el protocolo iterable (Symbol.iterator), y ver por qué un generador es la forma más corta de implementarlo a mano.',
        content: [
          { type: 'heading', text: 'function* y yield' },
          {
            type: 'p',
            text: 'Una función declarada con `function*` (una función generadora) no se ejecuta de una sola vez al llamarla -- devuelve un objeto generador, y cada llamada a `.next()` sobre ese objeto corre el cuerpo de la función hasta el próximo `yield`, donde se pausa. `.next()` devuelve siempre un objeto `{ value, done }`: `value` es lo que se pasó a `yield` (o al `return` final), y `done` indica si el generador ya terminó.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido',
            code: `function* contarHasta(limite) {
  let actual = 1;
  while (actual <= limite) {
    yield actual;
    actual += 1;
  }
}

const generador = contarHasta(3);
generador.next(); // { value: 1, done: false }
generador.next(); // { value: 2, done: false }
generador.next(); // { value: 3, done: false }
generador.next(); // { value: undefined, done: true }`,
          },
          { type: 'heading', text: 'El protocolo iterable: Symbol.iterator' },
          {
            type: 'p',
            text: 'Un objeto es iterable (lo puedes recorrer con `for...of`, o expandir con `...`) si tiene un método en la clave especial `Symbol.iterator` que devuelve un iterador: un objeto con un método `.next()` que, igual que el generador de arriba, devuelve `{ value, done }`. Implementar ese protocolo a mano, sin generadores, es más verboso de lo que parece.',
          },
          {
            type: 'code',
            lang: 'js',
            filename:
              'ejemplo autocontenido -- protocolo iterable implementado a mano, sin generador',
            code: `const rangoManual = {
  desde: 1,
  hasta: 3,
  [Symbol.iterator]() {
    let actual = this.desde;
    const hasta = this.hasta;
    return {
      next() {
        if (actual > hasta) return { value: undefined, done: true };
        const value = actual;
        actual += 1;
        return { value, done: false };
      },
    };
  },
};

[...rangoManual]; // [1, 2, 3] -- for...of también funciona sobre rangoManual`,
          },
          { type: 'heading', text: 'Por qué un generador es la forma más simple de implementarlo' },
          {
            type: 'p',
            text: 'Un objeto generador (el que devuelve una función `function*` al llamarla) ya cumple el protocolo iterable por sí solo: tiene `.next()`, y además su propio `[Symbol.iterator]` devuelve el generador mismo. Eso significa que, en vez de escribir a mano un objeto con `next()` que rastrea estado manualmente (como arriba), basta con poner una función generadora directamente en la clave `Symbol.iterator`.',
          },
          {
            type: 'code',
            lang: 'js',
            filename:
              'ejemplo autocontenido -- el mismo rango, con generador en vez de iterador manual',
            code: `const rangoConGenerador = {
  desde: 1,
  hasta: 3,
  *[Symbol.iterator]() {
    for (let actual = this.desde; actual <= this.hasta; actual += 1) {
      yield actual;
    }
  },
};

[...rangoConGenerador]; // [1, 2, 3] -- mismo resultado, mucho menos código que el objeto manual`,
          },
          {
            type: 'note',
            text: 'Una trampa real: un generador ya iniciado se agota -- si recorres `rangoConGenerador` con `for...of` y después lo recorres de nuevo, funciona porque `[Symbol.iterator]` se vuelve a llamar y crea un generador nuevo cada vez. Pero si guardas el resultado de llamar al generador una sola vez (`const g = rangoConGenerador[Symbol.iterator]()`) y lo recorres dos veces, la segunda vuelta no devuelve nada: ese generador en particular ya llegó a `done: true` y no se reinicia.',
          },
        ],
        checkpoint:
          'Puedes escribir desde cero un generador que produzca los primeros N números pares, y explicar con tus palabras por qué ese generador, puesto en `[Symbol.iterator]`, ya hace iterable a cualquier objeto sin escribir un `.next()` a mano.',
      },
      {
        id: 'js-avanzado-05-tagged-template-literals',
        title: '5. Tagged template literals: la base real de html`` y css`` de Lit',
        estimatedMinutes: 50,
        objective:
          'Entender qué es una función tag, verificar con código real del catálogo que html`` y css`` de Lit son exactamente eso, y escribir una versión mínima que reconstruya el mecanismo.',
        content: [
          { type: 'heading', text: 'Qué es una función tag' },
          {
            type: 'p',
            text: 'Cuando el nombre de una función va pegado justo antes de un template literal (sin paréntesis, sin punto), eso no produce un string ya armado -- llama a esa función con dos tipos de argumentos separados: primero un array con los fragmentos de texto literal (todo lo que no está dentro de `${...}`), y después, uno por uno, los valores que se interpolaron. Esa función se llama "función tag".',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'ejemplo autocontenido',
            code: `function etiqueta(strings, ...values) {
  console.log(strings); // ['<div>', '</div>']
  console.log(values); // [42]
}

const x = 42;
etiqueta\\\`<div>\${x}</div>\\\`;`,
          },
          {
            type: 'note',
            text: 'El array `strings` siempre tiene exactamente un elemento más que `values`: un fragmento de texto antes de cada valor interpolado, más uno final después del último. En el ejemplo de arriba, con un solo valor interpolado, `strings` tiene 2 elementos y `values` tiene 1.',
          },
          {
            type: 'heading',
            text: 'Cómo exactamente esto es lo que hace funcionar a html`` de Lit',
          },
          {
            type: 'p',
            text: '`html` y `css`, las funciones que importas de `lit` en todos los componentes de este catálogo, son funciones tag -- ni más ni menos que el mismo mecanismo de arriba. Este es el `render()` real de `ac-amount-basic`.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/components/ac-amount-basic/src/amount-basic.js',
            code: `  render() {
    // El texto ya formateado se pasa como contenido del slot por defecto
    // (luz, no shadow) de \\\`ac-text-basic\\\` — NUNCA vía su propiedad \\\`text\\\`,
    // que trata el valor como clave de traducción (this.t(key)).
    return html\\\`<ac-text-basic part="root" size=\${this.size} tag=\${this.tag} ambient=\${this.ambient}
      >\${this._formattedAmount}</ac-text-basic
    >\\\`;
  }`,
          },
          {
            type: 'p',
            text: "Esa llamada a `html` recibe internamente `strings` (los fragmentos fijos: `'<ac-text-basic part=\"root\" size=\"'`, `'\" tag=\"'`, `'\" ambient=\"'`, `'>'`, `'</ac-text-basic>'`...) y, por separado, `values` (`[this.size, this.tag, this.ambient, this._formattedAmount]`). Lit nunca recibe un string de HTML ya armado con esos valores metidos adentro -- recibe las dos partes separadas, igual que la función `etiqueta` del ejemplo anterior.",
          },
          { type: 'heading', text: 'Una versión mínima para desmitificar el mecanismo' },
          {
            type: 'p',
            text: 'El `html` real de Lit no concatena un string nuevo en cada render -- parsea los fragmentos fijos una sola vez en un `<template>`, y en cada actualización posterior solo toca los valores interpolados que cambiaron, sin volver a tocar el HTML fijo. Pero para entender qué son `strings` y `values`, sirve ver una versión mínima (y deliberadamente ingenua) que sí concatena, solo para desmitificar la idea central.',
          },
          {
            type: 'code',
            lang: 'js',
            filename:
              'ejemplo autocontenido -- NO es cómo funciona Lit por dentro, solo el concepto',
            code: `function htmlSimplificado(strings, ...values) {
  return strings.reduce((acumulado, fragmento, i) => {
    const valor = i < values.length ? String(values[i]) : '';
    return acumulado + fragmento + valor;
  }, '');
}

const nombre = 'Ana';
htmlSimplificado\\\`<span>Hola \${nombre}</span>\\\`;
// "<span>Hola Ana</span>" -- reconstruido a mano desde strings + values`,
          },
          {
            type: 'note',
            text: 'No pierdas de vista la diferencia: `htmlSimplificado` de arriba reconstruye un string nuevo cada vez que se llama, que es exactamente lo que Lit evita (por eso es más rápido que armar HTML a mano con concatenación de strings en cada render). La función de arriba solo existe para mostrar, de forma mínima, qué datos recibe una función tag -- no para mostrar cómo Lit los usa por dentro.',
          },
          { type: 'heading', text: 'css`` usa exactamente el mismo mecanismo' },
          {
            type: 'p',
            text: '`css` es la otra función tag que ya usas en cada componente, sobre los estilos en vez del markup. Este es un fragmento real del mixin base que comparten todos los componentes del catálogo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'packages/base/ac-component-mixin/src/component-mixin.js',
            code: `export const componentBaseStyles = css\\\`
  :host {
    font-family: var(
      --font-family,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Arial,
      sans-serif
    );
  }
\\\`;`,
          },
          {
            type: 'note',
            text: 'Como no hay ningún `${...}` dentro de ese template literal en particular, `values` llega vacío y `strings` tiene un solo elemento con todo el CSS -- pero sigue siendo, por definición, una llamada a una función tag. La diferencia con `html` no está en el mecanismo (es idéntico), sino en qué hace cada función con el resultado: una construye un fragmento de DOM, la otra una hoja de estilos.',
          },
        ],
        checkpoint:
          'Puedes tomar cualquier uso real de `html` o `css` como función tag en un componente del catálogo y decir, sin ejecutarlo, qué contendría su array `strings` y qué contendría su array `values` si esa función imprimiera ambos como hace `etiqueta` en el primer ejemplo.',
      },
    ],
  },
  {
    id: 'guia-apps',
    title: 'Capítulo 1 — Construcción de una aplicación completa',
    summary:
      'Guía paso a paso para crear una app real con aclit app:create: su estructura de carpetas, archivos importantes, el enrutador y los canales de comunicación entre páginas.',
    estimatedMinutes: 160,
    outcomes: [
      'Generar una aplicación nueva con aclit app:create y explicar para qué sirve cada archivo de su estructura.',
      'Declarar rutas, incluidas rutas con parámetros, y navegar entre páginas con un enlace o de forma programática.',
      'Usar PageMixin para publicarse y suscribirse a canales de comunicación entre páginas, incluida la diferencia entre un canal retenido y uno que no lo es.',
      'Agregar una página nueva a una app existente: archivo, ruta, entrada en la navegación.',
    ],
    labs: [
      {
        id: 'guia-apps-01-generar-app-y-estructura',
        title: '1. Generar la app y su estructura',
        estimatedMinutes: 40,
        objective:
          'Generar una aplicación nueva con aclit app:create y explicar para qué sirve cada archivo y cada carpeta de la estructura que deja lista.',
        content: [
          { type: 'heading', text: 'Un comando, una app completa' },
          {
            type: 'p',
            text: 'Toda aplicación nueva con este framework arranca con un solo comando: aclit app:create, seguido del nombre que quieras darle. Ese nombre se usa para derivar el nombre de la carpeta, el nombre del paquete dentro de package.json y el título que aparece en la cabecera de la página.',
          },
          { type: 'code', lang: 'bash', code: 'aclit app:create mi-tienda' },
          {
            type: 'p',
            text: 'El comando no hace ninguna pregunta adicional: crea la carpeta mi-tienda dentro del directorio donde lo ejecutas, copia ahí la plantilla completa y reemplaza el nombre en los lugares donde corresponde. Si ya existe una carpeta con ese nombre, el comando se detiene con un error en vez de sobrescribir nada.',
          },
          {
            type: 'note',
            text: 'A diferencia de un componente del catálogo (aclit component:create), lo que genera app:create no es un paquete publicable: es tu propia aplicación, pensada para que la edites libremente y la despliegues como quieras.',
          },
          { type: 'heading', text: 'La estructura generada' },
          {
            type: 'p',
            text: 'Dentro de la carpeta nueva encuentras un proyecto completo y listo para correr. La pieza más importante es src/, donde vive todo el código propio de la aplicación: el punto de entrada, cada página y un archivo de utilidades compartidas.',
          },
          {
            type: 'image-placeholder',
            caption:
              'Árbol de carpetas de una app generada con aclit app:create. Mostrar la jerarquía completa: index.html en la raíz, la carpeta src/ con app.js y app.css al mismo nivel, y dentro de src/ dos subcarpetas: utils/ (con page-mixin.js) y pages/ (con home-page.js, users-table-page.js, user-detail-page.js y selected-user-badge-page.js). A un lado, vite.config.js y package.json en la raíz. Usar íconos distintos para carpetas y archivos, y una etiqueta que diga "generado por aclit app:create".',
          },
          {
            type: 'code',
            lang: 'text',
            filename: 'estructura de la app generada',
            code: `mi-tienda/
├── index.html
├── src/
│   ├── app.js
│   ├── app.css
│   ├── utils/
│   │   └── page-mixin.js
│   └── pages/
│       ├── home-page.js
│       ├── users-table-page.js
│       ├── user-detail-page.js
│       └── selected-user-badge-page.js
├── vite.config.js
└── package.json`,
          },
          { type: 'heading', text: 'Qué hace cada archivo' },
          {
            type: 'p',
            text: 'index.html es el esqueleto de toda la aplicación: la cabecera, la navegación por hash y las cuatro páginas, cada una como su propia etiqueta personalizada dentro de main. Todas las páginas salvo la primera arrancan con el atributo hidden.',
          },
          {
            type: 'p',
            text: 'src/app.js es el shell de la aplicación: crea una única instancia del canal de comunicación con createCCP(), crea el enrutador con createRouter() y decide qué página mostrar según la ruta activa. Es el único archivo que conoce a todas las páginas a la vez.',
          },
          {
            type: 'p',
            text: 'src/app.css contiene el layout propio del shell: la cabecera, la navegación y la regla que oculta las páginas marcadas con el atributo hidden. No tiene nada que ver con los estilos internos de cada página, esos viven encapsulados dentro de cada componente.',
          },
          {
            type: 'p',
            text: 'src/utils/page-mixin.js resuelve la parte repetitiva de conectar una página al canal de comunicación: declarar la property ccp, esperar a que esté disponible y simplificar publicar y suscribirse. Vas a verlo de cerca en el tercer laboratorio de este capítulo.',
          },
          {
            type: 'p',
            text: 'src/pages/ tiene una página por archivo, y cada una se registra como un custom element independiente: home-page.js es la portada, users-table-page.js lista usuarios y publica al seleccionar uno, user-detail-page.js muestra el usuario de la ruta activa, y selected-user-badge-page.js muestra el último usuario seleccionado.',
          },
          {
            type: 'note',
            text: 'El propio index.html que te genera aclit app:create no es el único lugar con documentación: la carpeta también incluye un README.md con la misma explicación de la estructura, las rutas y los canales que vas a recorrer en este capítulo, pensado para que lo consultes directamente desde tu proyecto.',
          },
        ],
        checkpoint:
          'Puedes generar una app nueva con aclit app:create y, sin mirar la plantilla, explicar con tus propias palabras para qué sirve cada archivo de primer nivel y cada archivo dentro de src/pages/.',
      },
      {
        id: 'guia-apps-02-rutas-con-ac-router',
        title: '2. Rutas con @ac-base/ac-router',
        estimatedMinutes: 40,
        objective:
          'Declarar rutas (incluida una con parámetro), entender cómo se decide qué página se muestra, y navegar entre páginas con un enlace plano y de forma programática.',
        content: [
          { type: 'heading', text: 'Rutas declaradas en un solo lugar' },
          {
            type: 'p',
            text: 'El enrutador de la aplicación es vanilla: un enrutador por hash con soporte para parámetros de ruta, sin ninguna librería externa. Se crea una sola vez, en src/app.js, con createRouter() y un arreglo de rutas. Cada ruta tiene un path (el patrón de la URL) y un name (el identificador interno que vas a usar para decidir qué mostrar y para navegar programáticamente).',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/app.js (de la app generada)',
            code: `const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/usuarios', name: 'usuarios' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
  { path: '/seleccionado', name: 'seleccionado' },
]);`,
          },
          {
            type: 'p',
            text: 'La tercera ruta tiene un segmento dinámico: :id. Cualquier valor que aparezca ahí en la URL (por ejemplo, el 2 en #/usuarios/2) queda disponible como parámetro de ruta, con esa misma clave, id.',
          },
          { type: 'heading', text: 'Cómo se decide qué página se muestra' },
          {
            type: 'p',
            text: 'El shell mantiene un mapa views, con la misma clave name de cada ruta apuntando al elemento de esa página. Cuando el enrutador avisa que la ruta activa cambió, applyRoute recorre ese mapa: oculta todas las páginas salvo la que coincide con el nombre de la ruta activa, y le asigna los parámetros de la ruta solo a esa página.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/app.js (de la app generada)',
            code: `function applyRoute(route) {
  const name = route.matched ? route.name : 'home';
  for (const [key, view] of Object.entries(views)) {
    view.hidden = key !== name;
  }
  views[name].routeParams = route.params;
}

applyRoute(router.current);
router.subscribe(applyRoute);`,
          },
          {
            type: 'image-placeholder',
            caption:
              'Diagrama que muestre una barra de dirección con el hash #/usuarios/2 a la izquierda, una flecha hacia el centro con el enrutador identificando name: "usuario-detalle" y params: { id: "2" }, y a la derecha las 4 páginas en una columna, con "Detalle" resaltada (visible) y las otras 3 en gris/atenuadas (ocultas con el atributo hidden).',
          },
          {
            type: 'p',
            text: 'Si la URL no coincide con ninguna ruta declarada, route.matched es falso y applyRoute cae de vuelta a home. Por eso siempre hay una página visible, nunca una pantalla en blanco.',
          },
          { type: 'heading', text: 'Navegar con un enlace plano' },
          {
            type: 'p',
            text: 'Como el enrutador trabaja sobre el hash de la URL, un enlace común ya alcanza para navegar, sin ningún manejador de clics propio: el navegador cambia el hash, y el enrutador reacciona solo.',
          },
          { type: 'code', lang: 'html', code: `<a href="#/usuarios/2">Ver detalle</a>` },
          { type: 'heading', text: 'Navegar de forma programática' },
          {
            type: 'p',
            text: 'Cuando la navegación depende de código (por ejemplo, después de guardar algo), usas router.navigate() con el name de la ruta y, si la ruta lo pide, sus params.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `router.navigate({ name: 'usuario-detalle', params: { id: 2 } });`,
          },
          { type: 'heading', text: 'Leer un parámetro de ruta desde la página' },
          {
            type: 'p',
            text: 'La página activa recibe sus parámetros de ruta como la property routeParams, asignada por applyRoute. Dentro de la página, simplemente los lees con this.routeParams.id.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/pages/user-detail-page.js (de la app generada)',
            code: `render() {
  const user = USERS.find(candidate => String(candidate.id) === this.routeParams.id);
  // ...
}`,
          },
          {
            type: 'note',
            text: 'applyRoute solo asigna routeParams a la página que coincide con la ruta activa (views[name].routeParams = route.params), no a las cuatro páginas a la vez. Si mañana una página oculta necesitara conocer parámetros de otra ruta, routeParams no te sirve para eso: para comunicación entre páginas que no depende de la URL existe un mecanismo distinto, que ves en el siguiente laboratorio.',
          },
        ],
        checkpoint:
          'Puedes declarar una ruta nueva con un parámetro, explicar cómo applyRoute decide qué página mostrar y cuál oculta, y navegar hacia esa ruta tanto con un enlace plano como con router.navigate().',
      },
      {
        id: 'guia-apps-03-canales-comunicacion',
        title: '3. Canales de comunicación con @ac-base/ac-ccp y PageMixin',
        estimatedMinutes: 45,
        objective:
          'Entender qué problema resuelve el Channel Communication Pattern, usar PageMixin para publicar y suscribirse a canales, y distinguir un canal retenido de uno que no lo es.',
        content: [
          { type: 'heading', text: 'Un problema que las rutas no resuelven' },
          {
            type: 'p',
            text: 'Las rutas sirven para decidir qué página se muestra, pero no para que dos páginas intercambien datos entre ellas. Piensa en la página Usuarios: cuando seleccionas uno, la página Seleccionado necesita enterarse, pero esa relación no tiene nada que ver con ninguna URL. Forzarla dentro de la ruta sería artificial.',
          },
          {
            type: 'p',
            text: 'Para esto existe @ac-base/ac-ccp (Channel Communication Pattern): un mecanismo separado del enrutador, pensado para publicar y suscribirse a canales con nombre, sin que una página necesite conocer a la otra.',
          },
          { type: 'heading', text: 'PageMixin: connectionOut y connectionIn' },
          {
            type: 'p',
            text: 'Conectar una página al canal de comunicación a mano implica declarar la property ccp, esperar a que esté disponible y crear un controlador de canal. PageMixin resuelve toda esa parte repetitiva: una página que necesita canales solo extiende PageMixin(LitElement) y sobreescribe setupChannels(), un método que se llama una sola vez, desde firstUpdated().',
          },
          {
            type: 'code',
            lang: 'js',
            code: `class MiPagina extends PageMixin(LitElement) {
  setupChannels() {
    this.publicarAlgo = this.connectionOut('mi.canal', { retain: true });
    this.connectionIn('otro.canal', payload => {
      this._valor = payload;
    });
  }
  // ...
}`,
          },
          {
            type: 'p',
            text: 'connectionOut(nombre, { retain }) crea el canal de salida y devuelve una función lista para publicar: la llamas con el valor que quieras enviar. connectionIn(nombre, onPayload, { replay }) se suscribe a un canal; onPayload recibe el payload ya desenvuelto, no el mensaje completo.',
          },
          { type: 'heading', text: 'La diferencia real entre retener y no retener' },
          {
            type: 'p',
            text: 'retain: true hace que el canal guarde el último mensaje publicado. Cuando una página nueva se suscribe a ese canal, recibe ese último mensaje de inmediato, aunque se haya publicado antes de que esa página existiera. Sin retain (el valor por defecto es false), el canal no guarda nada: solo las páginas que ya estaban suscritas en el momento exacto de la publicación la reciben: una suscripción posterior se queda sin ese mensaje hasta la próxima publicación.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/pages/users-table-page.js (de la app generada)',
            code: `setupChannels() {
  this.publishSelected = this.connectionOut('users.selected', { retain: true });
  // ...
}

_onSelectClick(user) {
  this.publishSelected(user);
  this._selected = user;
}`,
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/pages/selected-user-badge-page.js (de la app generada)',
            code: `setupChannels() {
  this.connectionIn('users.selected', user => {
    this._lastMessage = user;
  });
  // ...
}`,
          },
          {
            type: 'p',
            text: 'Con este par de páginas, el orden de navegación no importa: si seleccionas un usuario en Usuarios y luego entras a Seleccionado, la ves con el usuario correcto, porque retain: true hizo que el canal retuviera ese último mensaje para ella.',
          },
          {
            type: 'image-placeholder',
            caption:
              'Diagrama de dos páginas (Usuarios a la izquierda, Seleccionado a la derecha) conectadas por una caja central etiquetada "canal: users.selected (retain: true)". Una flecha de Usuarios hacia el canal marcada "publica al hacer clic", y otra flecha del canal hacia Seleccionado marcada "recibe el último mensaje retenido, aunque se haya publicado antes de entrar a esta página". Incluir una línea de tiempo pequeña debajo mostrando: 1) Usuarios publica, 2) el usuario navega a Seleccionado, 3) Seleccionado se suscribe y recibe igual el mensaje.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `// Sin retain (el valor por defecto): un suscriptor que llega después
// de la publicación no recibe nada hasta la próxima vez que se publique.
this.connectionOut('canal.sin.retener');`,
          },
          {
            type: 'note',
            text: 'En la app generada, home-page.js también publica con retain: true, pero no como reacción a un clic, sino al montarse la página: apenas se conecta, publica un usuario de ejemplo en el canal global global.user.data. Es el mismo mecanismo de retención, disparado por un motivo distinto: el montaje de una página, no una acción de quien la usa.',
          },
        ],
        checkpoint:
          'Puedes explicar con tus propias palabras qué resuelve un canal frente al enrutador, usar connectionOut y connectionIn a través de PageMixin, y decir con precisión qué cambia en el comportamiento cuando un canal usa retain: true frente a cuando no lo usa.',
      },
      {
        id: 'guia-apps-04-agregar-pagina-nueva',
        title: '4. Agregar una página nueva',
        estimatedMinutes: 35,
        objective:
          'Sumar una página nueva a una app ya generada, siguiendo los 4 pasos reales: el archivo de la página, su import, su entrada en las rutas y en la navegación.',
        content: [
          { type: 'heading', text: 'Los 4 pasos' },
          {
            type: 'p',
            text: 'Agregar una página a una app que ya existe siempre sigue el mismo orden: primero el archivo de la página, después conectarla al shell (import, ruta y vista), y por último el enlace para llegar a ella. Ningún paso es opcional: si omites uno, la página queda a medias.',
          },
          { type: 'heading', text: '1. Crea el archivo en src/pages/' },
          {
            type: 'p',
            text: 'Por convención, un archivo por página, con un custom element propio. Si no necesita canales de comunicación, le basta con pageBaseStyles; si los necesita, extiende PageMixin como viste en el laboratorio anterior.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/pages/mi-pagina.js',
            code: `import { LitElement, html } from 'lit';
import { pageBaseStyles } from '../utils/page-mixin.js';

class AppMiPagina extends LitElement {
  static get styles() {
    return [pageBaseStyles];
  }

  render() {
    return html\`
      <div class="page">
        <h2>Mi página</h2>
      </div>
    \`;
  }
}

customElements.define('app-mi-pagina', AppMiPagina);`,
          },
          { type: 'heading', text: '2. Importa el archivo en src/app.js' },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/app.js',
            code: `import './pages/mi-pagina.js';`,
          },
          { type: 'heading', text: '3. Agrega la ruta y la vista' },
          {
            type: 'p',
            text: 'Una entrada nueva en el arreglo de createRouter([...]), con el path que quieras (con :param si necesita un parámetro) y un name propio, y esa misma clave en el mapa views, apuntando al elemento recién creado.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/app.js',
            code: `const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/usuarios', name: 'usuarios' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
  { path: '/seleccionado', name: 'seleccionado' },
  { path: '/mi-ruta', name: 'mi-pagina' },
]);

const views = {
  home: document.querySelector('app-home-page'),
  usuarios: document.querySelector('app-users-table-page'),
  'usuario-detalle': document.querySelector('app-user-detail-page'),
  seleccionado: document.querySelector('app-selected-user-badge-page'),
  'mi-pagina': document.querySelector('app-mi-pagina'),
};`,
          },
          { type: 'heading', text: '4. Agrega un enlace en index.html' },
          {
            type: 'p',
            text: 'Un enlace nuevo en la navegación, y el elemento de la página dentro de main, con el atributo hidden: applyRoute se encarga de mostrarlo u ocultarlo según la ruta activa.',
          },
          {
            type: 'code',
            lang: 'html',
            filename: 'index.html',
            code: `<nav class="app-nav">
  <a href="#/">Home</a>
  <a href="#/usuarios">Usuarios</a>
  <a href="#/seleccionado">Seleccionado</a>
  <a href="#/mi-ruta">Mi página</a>
</nav>

<main>
  <app-home-page></app-home-page>
  <app-users-table-page hidden></app-users-table-page>
  <app-user-detail-page hidden></app-user-detail-page>
  <app-selected-user-badge-page hidden></app-selected-user-badge-page>
  <app-mi-pagina hidden></app-mi-pagina>
</main>`,
          },
          {
            type: 'note',
            text: 'La clave que usas en createRouter([...]) (name), en el mapa views y en el atributo hidden de index.html tiene que coincidir exactamente entre los tres lugares. applyRoute recorre views con Object.entries(views), así que una clave distinta entre el enrutador y el mapa deja tu página nueva siempre oculta, sin ningún error visible que lo delate.',
          },
        ],
        checkpoint:
          'Puedes agregar una página nueva a una app ya generada siguiendo los 4 pasos, y explicar qué pasaría (y por qué no se notaría con un error) si el name de la ruta nueva no coincide exactamente con su clave en el mapa views.',
      },
    ],
  },
];

// Íconos propios de las 3 tarjetas de nivel y de sus features -- mismo estilo
// stroke-based del resto del sitio (viewBox 24x24), sin depender del catálogo
// de componentes.
const CODE_ICON = '<path d="M8 9l-3 3 3 3M16 9l3 3-3 3"/>';
const LAYERS_ICON = '<path d="M12 3L3 8l9 5 9-5-9-5z"/><path d="M3 13l9 5 9-5"/>';
const TROPHY_ICON =
  '<path d="M8 3h8v4a4 4 0 0 1-8 0V3z"/><path d="M8 4H5a2 2 0 0 0 2 4M16 4h3a2 2 0 0 1-2 4"/><path d="M12 11v4"/><path d="M9 19h6"/>';
const PLAY_FEATURE_ICON = '<path d="M7 5l10 7-10 7V5z" fill="currentColor" stroke="none"/>';
const DOC_FEATURE_ICON =
  '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>';
const CHECK_FEATURE_ICON = '<path d="M5 12.5l4.5 4.5L15 7.5" stroke-width="2.5"/>';
const FLASK_FEATURE_ICON =
  '<path d="M9 2v6.5L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3L15 8.5V2"/><path d="M8 2h8"/>';
const BOLT_FEATURE_ICON =
  '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" stroke="none"/>';
const CHART_FEATURE_ICON = '<path d="M4 20V10M12 20V4M20 20v-6"/>';
const ROCKET_FEATURE_ICON =
  '<path d="M12 2c3 2 4 6 4 10 0 2-1 4-2 5l-2 2-2-2c-1-1-2-3-2-5 0-4 1-8 4-10z"/><path d="M9 15l-3 3 1 1M15 15l3 3-1 1"/>';
const STAR_FEATURE_ICON =
  '<path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16l-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 3z" fill="currentColor" stroke="none"/>';

export const LAB_LEVELS = [
  {
    id: 'basico',
    title: 'Básico',
    levelLabel: 'Nivel 1',
    description:
      'Construye tu primer componente guiado paso a paso, con código de referencia en cada laboratorio.',
    icon: CODE_ICON,
    ctaLabel: 'Comenzar',
    features: [
      { icon: PLAY_FEATURE_ICON, text: 'Laboratorios prácticos' },
      { icon: DOC_FEATURE_ICON, text: 'Código de ejemplo' },
      { icon: CHECK_FEATURE_ICON, text: 'Validación inmediata' },
    ],
    chapters: BASICO_CHAPTERS,
  },
  {
    id: 'intermedio',
    title: 'Intermedio',
    levelLabel: 'Nivel 2',
    description: 'Profundiza en testing y accesibilidad sobre lo que ya construiste.',
    icon: LAYERS_ICON,
    ctaLabel: 'Continuar',
    features: [
      { icon: FLASK_FEATURE_ICON, text: 'Casos avanzados' },
      { icon: CHECK_FEATURE_ICON, text: 'Buenas prácticas' },
      { icon: BOLT_FEATURE_ICON, text: 'Desafíos reales' },
    ],
    chapters: INTERMEDIO_CHAPTERS,
  },
  {
    id: 'avanzado',
    title: 'Avanzado',
    levelLabel: 'Nivel 3',
    description:
      'Un repaso profundo de JavaScript y la guía real para construir una aplicación completa con ac-lit.',
    icon: TROPHY_ICON,
    ctaLabel: 'Explorar',
    features: [
      { icon: CHART_FEATURE_ICON, text: 'Proyectos completos' },
      { icon: ROCKET_FEATURE_ICON, text: 'Casos de uso reales' },
      { icon: STAR_FEATURE_ICON, text: 'Optimización y performance' },
    ],
    chapters: AVANZADO_CHAPTERS,
  },
];
