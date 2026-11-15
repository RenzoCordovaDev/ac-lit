import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing';
import '../index.js';

const rootOf = el => el.shadowRoot.querySelector('[part="root"]');
const headerOf = el => el.shadowRoot.querySelector('[part="header"]');
const editOf = el => el.shadowRoot.querySelector('[part="edit"]');
const counterOf = el => el.shadowRoot.querySelector('[part="counter"]');

suite('ac-expandable-step', () => {
  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-expandable-step></ac-expandable-step>`);
    expect(el.ambient).to.equal('primary');
  });

  test('defaults to active false', async () => {
    const el = await fixture(html`<ac-expandable-step></ac-expandable-step>`);
    expect(el.active).to.be.false;
  });

  test('defaults to completed false', async () => {
    const el = await fixture(html`<ac-expandable-step></ac-expandable-step>`);
    expect(el.completed).to.be.false;
  });

  test('defaults to disabled false', async () => {
    const el = await fixture(html`<ac-expandable-step></ac-expandable-step>`);
    expect(el.disabled).to.be.false;
  });

  test('pending (not active, not completed) renders nothing', async () => {
    const el = await fixture(html`<ac-expandable-step header="Título"></ac-expandable-step>`);
    expect(rootOf(el)).to.be.null;
  });
});

suite('ac-expandable-step: active', () => {
  test('renders the header text', async () => {
    const el = await fixture(html`<ac-expandable-step active header="Datos"></ac-expandable-step>`);
    expect(headerOf(el).textContent.trim()).to.equal('Datos');
  });

  test('translates the header when it is a locale key', async () => {
    const el = await fixture(
      html`<ac-expandable-step active header="expandable-step-edit-label"></ac-expandable-step>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(headerOf(el).textContent.trim()).to.equal('Edit');
  });

  test('renders the translated step counter', async () => {
    const el = await fixture(
      html`<ac-expandable-step active step-number="2" total-steps="4"></ac-expandable-step>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(counterOf(el).textContent.trim()).to.equal('Step 2 of 4');
  });

  test('renders the default slot content', async () => {
    const el = await fixture(
      html`<ac-expandable-step active><p>Contenido real</p></ac-expandable-step>`,
    );
    expect(el.querySelector('p').assignedSlot).to.exist;
  });

  test('does not render the collapsed bar', async () => {
    const el = await fixture(html`<ac-expandable-step active completed></ac-expandable-step>`);
    expect(el.shadowRoot.querySelector('[part="bar"]')).to.be.null;
  });
});

suite('ac-expandable-step: completed', () => {
  test('renders the header text in the collapsed bar', async () => {
    const el = await fixture(
      html`<ac-expandable-step completed header="Datos"></ac-expandable-step>`,
    );
    expect(headerOf(el).textContent.trim()).to.equal('Datos');
  });

  test('shows the "Modificar" link by default', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    expect(editOf(el)).to.exist;
  });

  test('hides the edit link when disabled', async () => {
    const el = await fixture(html`<ac-expandable-step completed disabled></ac-expandable-step>`);
    expect(editOf(el)).to.be.null;
  });

  test('uses the default translated edit label', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(editOf(el).textContent.trim()).to.equal('Edit');
  });

  test('translates a custom editLabel key', async () => {
    const el = await fixture(
      html`<ac-expandable-step
        completed
        edit-label="expandable-step-edit-label"
      ></ac-expandable-step>`,
    );
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(editOf(el).textContent.trim()).to.equal('Edit');
  });

  test('renders a custom editLabel literal as-is', async () => {
    const el = await fixture(
      html`<ac-expandable-step completed edit-label="Cambiar"></ac-expandable-step>`,
    );
    expect(editOf(el).textContent.trim()).to.equal('Cambiar');
  });

  test('renders slotted summary content', async () => {
    const el = await fixture(html`
      <ac-expandable-step completed><span slot="summary">Resumen</span></ac-expandable-step>
    `);
    expect(el.querySelector('[slot="summary"]').assignedSlot).to.exist;
  });

  test('does not render the active card', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    expect(el.shadowRoot.querySelector('[part="content"]')).to.be.null;
  });
});

suite('ac-expandable-step: events', () => {
  test('clicking "Modificar" dispatches ac-expandable-step-edit', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    setTimeout(() => editOf(el).click());
    const event = await oneEvent(el, 'ac-expandable-step-edit');
    expect(event).to.exist;
  });

  test('ac-expandable-step-edit bubbles and is composed', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    setTimeout(() => editOf(el).click());
    const event = await oneEvent(el, 'ac-expandable-step-edit');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('clicking "Modificar" does not change completed by itself', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    editOf(el).click();
    await el.updateComplete;
    expect(el.completed).to.be.true;
  });

  test('clicking "Modificar" does not change active by itself', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    editOf(el).click();
    await el.updateComplete;
    expect(el.active).to.be.false;
  });

  test('dispatches ac-expandable-step-complete when completed becomes true', async () => {
    const el = await fixture(html`<ac-expandable-step active></ac-expandable-step>`);
    setTimeout(() => {
      el.completed = true;
    });
    const event = await oneEvent(el, 'ac-expandable-step-complete');
    expect(event).to.exist;
  });

  test('ac-expandable-step-complete bubbles and is composed', async () => {
    const el = await fixture(html`<ac-expandable-step active></ac-expandable-step>`);
    setTimeout(() => {
      el.completed = true;
    });
    const event = await oneEvent(el, 'ac-expandable-step-complete');
    expect([event.bubbles, event.composed]).to.deep.equal([true, true]);
  });

  test('does not dispatch complete for its initial completed state', async () => {
    let dispatched = false;
    const wrapper = await fixture(html`<div></div>`);
    wrapper.addEventListener('ac-expandable-step-complete', () => {
      dispatched = true;
    });
    const el = document.createElement('ac-expandable-step');
    el.setAttribute('completed', '');
    wrapper.appendChild(el);
    await el.updateComplete;
    await aTimeout(0);
    expect(dispatched).to.be.false;
  });
});

suite('ac-expandable-step: public methods', () => {
  test('complete() sets completed to true', async () => {
    const el = await fixture(html`<ac-expandable-step active></ac-expandable-step>`);
    el.complete();
    await el.updateComplete;
    expect(el.completed).to.be.true;
  });

  test('complete() sets active to false', async () => {
    const el = await fixture(html`<ac-expandable-step active></ac-expandable-step>`);
    el.complete();
    await el.updateComplete;
    expect(el.active).to.be.false;
  });

  test('edit() sets active to true', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    el.edit();
    await el.updateComplete;
    expect(el.active).to.be.true;
  });

  test('edit() sets completed to false', async () => {
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    el.edit();
    await el.updateComplete;
    expect(el.completed).to.be.false;
  });

  test('edit() does not dispatch ac-expandable-step-edit', async () => {
    let dispatched = false;
    const el = await fixture(html`<ac-expandable-step completed></ac-expandable-step>`);
    el.addEventListener('ac-expandable-step-edit', () => {
      dispatched = true;
    });
    el.edit();
    await el.updateComplete;
    expect(dispatched).to.be.false;
  });
});
