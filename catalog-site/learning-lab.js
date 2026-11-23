// Niveles, capítulos y laboratorios del Laboratorio de aprendizaje -- al entrar se elige un
// nivel (Básico/Intermedio/Avanzado); dentro de cada nivel la ruta es progresiva y
// estrictamente secuencial (un laboratorio se desbloquea solo cuando el anterior de su
// capítulo está completo, y un capítulo solo cuando el anterior está 100% completo). Igual
// que catalog-meta.js/catalog-api.js: data hand-authored, sin generación automática.
//
// Niveles: Intermedio/Avanzado NO son "lo mismo pero más difícil" -- cada uno suma temas
// nuevos que Básico no cubre (testing, accesibilidad, e2e, analítica...). Por eso hoy solo
// Básico tiene contenido real; Intermedio/Avanzado existen como estructura (su propia
// página, su propio progreso) con `chapters: []`, a escribir en otra sesión.
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
    summary: 'Cubre con tests el componente que construiste en el Capítulo 1.',
    estimatedMinutes: 150,
    outcomes: [
      'Escribir tests unitarios (suite/test) que cubran el componente construido en el Capítulo 1.',
    ],
    labs: [],
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
    summary: 'Audita y corrige la accesibilidad de tu componente con axe-core.',
    estimatedMinutes: 90,
    outcomes: [
      'Auditar con axe-core e interpretar/corregir violaciones reales sin romper el diseño.',
    ],
    labs: [],
  },
  {
    id: 'e2e',
    title: 'Capítulo 2 — Testing E2E',
    summary: 'Escribe un escenario Gherkin de punta a punta para tu flujo completo.',
    estimatedMinutes: 150,
    outcomes: [
      'Escribir un escenario Gherkin/WebdriverIO de punta a punta sobre el flujo completo propio.',
    ],
    labs: [],
  },
  {
    id: 'contribucion',
    title: 'Capítulo 3 — Flujo de contribución (bonus)',
    summary: 'Changesets, abrir una PR y leer los checks de CI -- sobre tu propio fork.',
    estimatedMinutes: 60,
    outcomes: [
      'Generar un changeset, abrir una PR propia, y leer/interpretar los checks de CI antes de mergear.',
    ],
    labs: [],
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
    description: 'Testing E2E, analítica y los temas de producción que básico no cubre.',
    icon: TROPHY_ICON,
    ctaLabel: 'Explorar',
    features: [
      { icon: CHART_FEATURE_ICON, text: 'Proyectos completos' },
      { icon: ROCKET_FEATURE_ICON, text: 'Casos de uso reales' },
      { icon: STAR_FEATURE_ICON, text: 'Optimización y performance' },
    ],
    chapters: [],
  },
];
