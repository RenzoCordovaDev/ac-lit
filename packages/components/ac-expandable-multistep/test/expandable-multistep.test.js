import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing';
import '../index.js';
import '@ac-components/ac-expandable-step';

async function threeSteps() {
  const el = await fixture(html`
    <ac-expandable-multistep>
      <ac-expandable-step header="Uno"><p>Contenido 1</p></ac-expandable-step>
      <ac-expandable-step header="Dos"><p>Contenido 2</p></ac-expandable-step>
      <ac-expandable-step header="Tres"><p>Contenido 3</p></ac-expandable-step>
      <div slot="confirmation">Listo</div>
    </ac-expandable-multistep>
  `);
  await aTimeout(0);
  return el;
}

function stepsOf(el) {
  return Array.from(el.querySelectorAll('ac-expandable-step'));
}

suite('ac-expandable-multistep', () => {
  test('defaults to completed false', async () => {
    const el = await fixture(html`<ac-expandable-multistep></ac-expandable-multistep>`);
    expect(el.completed).to.be.false;
  });
});

suite('ac-expandable-multistep: numeración de steps', () => {
  test('asigna stepNumber según la posición', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    expect(steps.map(step => step.stepNumber)).to.deep.equal([1, 2, 3]);
  });

  test('asigna totalSteps con la cantidad total de steps', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    expect(steps.every(step => step.totalSteps === 3)).to.be.true;
  });
});

suite('ac-expandable-multistep: auto-activación inicial', () => {
  test('activa el primer step cuando el consumidor no precargó estado', async () => {
    const el = await threeSteps();
    expect(stepsOf(el)[0].active).to.be.true;
  });

  test('no activa el segundo ni el tercer step al auto-activar', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    expect([steps[1].active, steps[2].active]).to.deep.equal([false, false]);
  });

  test('no pisa el estado si el consumidor ya precargó un step activo', async () => {
    const el = await fixture(html`
      <ac-expandable-multistep>
        <ac-expandable-step header="Uno" completed></ac-expandable-step>
        <ac-expandable-step header="Dos" active></ac-expandable-step>
        <ac-expandable-step header="Tres"></ac-expandable-step>
      </ac-expandable-multistep>
    `);
    await aTimeout(0);
    const steps = stepsOf(el);
    expect([steps[0].completed, steps[1].active, steps[2].active]).to.deep.equal([
      true,
      true,
      false,
    ]);
  });

  test('emite ac-expandable-multistep-active-step-change al auto-activar el primero', async () => {
    const wrapper = await fixture(html`<div></div>`);
    const el = document.createElement('ac-expandable-multistep');
    const eventPromise = oneEvent(el, 'ac-expandable-multistep-active-step-change');
    el.innerHTML = '<ac-expandable-step header="Uno"></ac-expandable-step>';
    wrapper.appendChild(el);
    const event = await eventPromise;
    expect(event.detail).to.deep.equal({ stepNumber: 1, totalSteps: 1 });
  });
});

suite('ac-expandable-multistep: avanzar al completar un step intermedio', () => {
  test('activa el siguiente step cuando se completa uno intermedio', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    steps[0].complete();
    await aTimeout(0);
    expect(steps[1].active).to.be.true;
  });

  test('emite ac-expandable-multistep-active-step-change con el detail del siguiente step', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    setTimeout(() => steps[0].complete());
    const event = await oneEvent(el, 'ac-expandable-multistep-active-step-change');
    expect(event.detail).to.deep.equal({ stepNumber: 2, totalSteps: 3 });
  });

  test('no marca completed en el host al completar un step intermedio', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    steps[0].complete();
    await aTimeout(0);
    expect(el.completed).to.be.false;
  });
});

suite('ac-expandable-multistep: completar el último step', () => {
  test('marca completed=true en el host', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    steps[0].complete();
    steps[1].complete();
    steps[2].complete();
    await aTimeout(0);
    expect(el.completed).to.be.true;
  });

  test('emite ac-expandable-multistep-all-complete', async () => {
    const el = await threeSteps();
    const steps = stepsOf(el);
    steps[0].complete();
    steps[1].complete();
    await aTimeout(0);
    setTimeout(() => steps[2].complete());
    const event = await oneEvent(el, 'ac-expandable-multistep-all-complete');
    expect(event).to.exist;
  });
});

suite('ac-expandable-multistep: editar un step intermedio', () => {
  async function completedFlow() {
    const el = await threeSteps();
    const steps = stepsOf(el);
    steps[0].complete();
    steps[1].complete();
    steps[2].complete();
    await aTimeout(0);
    return { el, steps };
  }

  test('reactiva el step editado', async () => {
    const { steps } = await completedFlow();
    // `ac-expandable-step-edit` real se dispara desde el propio step (su `target`
    // debe ser el elemento step, no el host), así que se dispara directo sobre él.
    steps[0].dispatchEvent(
      new CustomEvent('ac-expandable-step-edit', { bubbles: true, composed: true }),
    );
    await aTimeout(0);
    expect(steps[0].active).to.be.true;
  });

  test('resetea a pendiente los steps posteriores', async () => {
    const { steps } = await completedFlow();
    steps[1].dispatchEvent(
      new CustomEvent('ac-expandable-step-edit', { bubbles: true, composed: true }),
    );
    await aTimeout(0);
    expect([steps[2].completed, steps[2].active]).to.deep.equal([false, false]);
  });

  test('des-completa el host si ya estaba en completed', async () => {
    const { el, steps } = await completedFlow();
    steps[1].dispatchEvent(
      new CustomEvent('ac-expandable-step-edit', { bubbles: true, composed: true }),
    );
    await aTimeout(0);
    expect(el.completed).to.be.false;
  });

  test('emite ac-expandable-multistep-active-step-change con el step editado', async () => {
    const { el, steps } = await completedFlow();
    setTimeout(() =>
      steps[1].dispatchEvent(
        new CustomEvent('ac-expandable-step-edit', { bubbles: true, composed: true }),
      ),
    );
    const event = await oneEvent(el, 'ac-expandable-multistep-active-step-change');
    expect(event.detail).to.deep.equal({ stepNumber: 2, totalSteps: 3 });
  });
});
