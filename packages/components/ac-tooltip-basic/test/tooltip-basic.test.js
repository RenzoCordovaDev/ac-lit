import { fixture, expect, html, aTimeout } from '@open-wc/testing';
import '../index.js';

const bubbleOf = el => el.shadowRoot.querySelector('[part="bubble"]');

suite('ac-tooltip-basic', () => {
  test('defaults to position="top"', async () => {
    const el = await fixture(html`<ac-tooltip-basic><button>Trigger</button></ac-tooltip-basic>`);
    expect(el.position).to.equal('top');
  });

  test('falls back to "top" with an invalid position', async () => {
    const el = await fixture(
      html`<ac-tooltip-basic position="diagonal"><button>Trigger</button></ac-tooltip-basic>`,
    );
    expect(el._position).to.equal('top');
  });

  test('renders a bubble with role="tooltip"', async () => {
    const el = await fixture(html`<ac-tooltip-basic><button>Trigger</button></ac-tooltip-basic>`);
    expect(bubbleOf(el).getAttribute('role')).to.equal('tooltip');
  });

  test('mouseenter on the trigger shows the bubble', async () => {
    const el = await fixture(
      html`<ac-tooltip-basic text="Ayuda"><button>Trigger</button></ac-tooltip-basic>`,
    );
    await aTimeout(0);
    const trigger = el.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await el.updateComplete;
    expect(bubbleOf(el).classList.contains('ac-tooltip-basic__bubble--visible')).to.be.true;
  });

  test('mouseleave on the trigger hides the bubble', async () => {
    const el = await fixture(
      html`<ac-tooltip-basic text="Ayuda"><button>Trigger</button></ac-tooltip-basic>`,
    );
    await aTimeout(0);
    const trigger = el.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await el.updateComplete;
    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    await el.updateComplete;
    expect(bubbleOf(el).classList.contains('ac-tooltip-basic__bubble--visible')).to.be.false;
  });

  test('disabled prevents the bubble from showing', async () => {
    const el = await fixture(
      html`<ac-tooltip-basic text="Ayuda" disabled><button>Trigger</button></ac-tooltip-basic>`,
    );
    await aTimeout(0);
    const trigger = el.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    await el.updateComplete;
    expect(bubbleOf(el).classList.contains('ac-tooltip-basic__bubble--visible')).to.be.false;
  });

  test('the assigned trigger receives aria-describedby pointing to the bubble id', async () => {
    const el = await fixture(html`<ac-tooltip-basic><button>Trigger</button></ac-tooltip-basic>`);
    await aTimeout(0);
    const trigger = el.querySelector('button');
    expect(trigger.getAttribute('aria-describedby')).to.equal(bubbleOf(el).id);
  });
});
