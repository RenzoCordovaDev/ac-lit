// Capítulos y laboratorios del Laboratorio de aprendizaje -- ruta progresiva y estrictamente
// secuencial (un laboratorio se desbloquea solo cuando el anterior de su capítulo está
// completo, y un capítulo solo cuando el anterior está 100% completo). Igual que
// catalog-meta.js/catalog-api.js: data hand-authored, sin generación automática.
//
// Forma de cada laboratorio: { id, title, objective, context, steps: [...], hint, selfCheck }

export const LAB_CHAPTERS = [
  {
    id: 'fundamentos',
    title: 'Capítulo 0 — Fundamentos y estándares',
    summary:
      'Tokens de diseño, naming de scripts component:*, y Conventional Commits -- las reglas que vas a aplicar en todo lo que sigue.',
    labs: [],
  },
  {
    id: 'construccion',
    title: 'Capítulo 1 — Construcción',
    summary:
      'Construye un componente propio de punta a punta: desde `aclit component:create` hasta un flujo completo con API pública/privada, eventos, estilos, modal, transición interna y multipasos.',
    labs: [],
  },
  {
    id: 'testing-unitario',
    title: 'Capítulo 2 — Testing unitario',
    summary: 'Cubre con tests el componente que construiste en el Capítulo 1.',
    labs: [],
  },
  {
    id: 'accesibilidad',
    title: 'Capítulo 3 — Accesibilidad',
    summary: 'Audita y corrige la accesibilidad de tu componente con axe-core.',
    labs: [],
  },
  {
    id: 'e2e',
    title: 'Capítulo 4 — Testing E2E',
    summary: 'Escribe un escenario Gherkin de punta a punta para tu flujo completo.',
    labs: [],
  },
  {
    id: 'contribucion',
    title: 'Capítulo 5 — Flujo de contribución (bonus)',
    summary: 'Changesets, abrir una PR y leer los checks de CI -- sobre tu propio fork.',
    labs: [],
  },
];
