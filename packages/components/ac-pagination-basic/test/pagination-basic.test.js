import { fixture, expect, html } from '@open-wc/testing';
import '../index.js';

const PAGE_CHANGE = 'ac-pagination-basic-page-change';
const pageButton = (el, page) => el.shadowRoot.querySelector(`button[data-page="${page}"]`);
const arrowButton = (el, direction) =>
  el.shadowRoot.querySelector(`button[part="${direction}-button"]`);
const currentPage = el => el.shadowRoot.querySelector('[aria-current="page"]');
const pageItems = el =>
  [...el.shadowRoot.querySelectorAll('button[data-page], [part="ellipsis"]')].map(item =>
    item.textContent.trim(),
  );

suite('ac-pagination-basic', () => {
  test('defaults to page 1', async () => {
    const el = await fixture(html`<ac-pagination-basic></ac-pagination-basic>`);
    expect(el.page).to.equal(1);
  });

  test('defaults to one total page', async () => {
    const el = await fixture(html`<ac-pagination-basic></ac-pagination-basic>`);
    expect(el.totalPages).to.equal(1);
  });

  test('defaults to one sibling per side', async () => {
    const el = await fixture(html`<ac-pagination-basic></ac-pagination-basic>`);
    expect(el.siblingCount).to.equal(1);
  });

  test('is enabled by default', async () => {
    const el = await fixture(html`<ac-pagination-basic></ac-pagination-basic>`);
    expect(el.disabled).to.be.false;
  });

  test('defaults to ambient="primary"', async () => {
    const el = await fixture(html`<ac-pagination-basic></ac-pagination-basic>`);
    expect(el.ambient).to.equal('primary');
  });

  test('reflects the ambient property to its attribute', async () => {
    const el = await fixture(html`<ac-pagination-basic></ac-pagination-basic>`);
    el.ambient = 'secondary';
    await el.updateComplete;
    expect(el.getAttribute('ambient')).to.equal('secondary');
  });

  test('reflects the page property to its attribute', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    el.page = 2;
    await el.updateComplete;
    expect(el.getAttribute('page')).to.equal('2');
  });

  test('reflects the totalPages property to total-pages', async () => {
    const el = await fixture(html`<ac-pagination-basic></ac-pagination-basic>`);
    el.totalPages = 4;
    await el.updateComplete;
    expect(el.getAttribute('total-pages')).to.equal('4');
  });

  test('clamps the page when the total shrinks', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="8" total-pages="10"></ac-pagination-basic>`,
    );
    el.totalPages = 3;
    await el.updateComplete;
    expect(el.page).to.equal(3);
  });

  test('marks only the configured page as current', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="3" total-pages="5"></ac-pagination-basic>`,
    );
    expect([...el.shadowRoot.querySelectorAll('[aria-current="page"]')]).to.deep.equal([
      pageButton(el, 3),
    ]);
  });

  test('renders all pages without an ellipsis when they fit', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="7"></ac-pagination-basic>`);
    expect(pageItems(el)).to.deep.equal(['1', '2', '3', '4', '5', '6', '7']);
  });

  test('renders the endpoints and siblings with an ellipsis on each side', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="10" total-pages="20"></ac-pagination-basic>`,
    );
    expect(pageItems(el)).to.deep.equal(['1', '…', '9', '10', '11', '…', '20']);
  });

  test('respects a larger sibling-count attribute', async () => {
    const el = await fixture(
      html`<ac-pagination-basic
        page="10"
        total-pages="20"
        sibling-count="2"
      ></ac-pagination-basic>`,
    );
    expect(pageItems(el)).to.deep.equal(['1', '…', '8', '9', '10', '11', '12', '…', '20']);
  });

  test('accepts zero siblings', async () => {
    const el = await fixture(
      html`<ac-pagination-basic
        page="10"
        total-pages="20"
        sibling-count="0"
      ></ac-pagination-basic>`,
    );
    expect(pageItems(el)).to.deep.equal(['1', '…', '10', '…', '20']);
  });

  test('shows a single missing page in place of an ellipsis', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="4" total-pages="10"></ac-pagination-basic>`,
    );
    expect(pageItems(el)).to.deep.equal(['1', '2', '3', '4', '5', '…', '10']);
  });

  test('keeps the ellipsis outside the tab order', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="10"></ac-pagination-basic>`);
    expect(
      el.shadowRoot.querySelector('span[part="ellipsis"][aria-hidden="true"]').tabIndex,
    ).to.equal(-1);
  });

  test('disables the previous button on the first page', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    expect(arrowButton(el, 'previous').disabled).to.be.true;
  });

  test('disables the next button on the last page', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="4" total-pages="4"></ac-pagination-basic>`,
    );
    expect(arrowButton(el, 'next').disabled).to.be.true;
  });

  test('disables every button when disabled is set', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="2" total-pages="4" disabled></ac-pagination-basic>`,
    );
    expect(el.shadowRoot.querySelectorAll('button:enabled')).to.have.lengthOf(0);
  });
});

suite('ac-pagination-basic: accessibility', () => {
  test('names the navigation landmark in Spanish', async () => {
    const el = await fixture(html`<ac-pagination-basic locale="es-PE"></ac-pagination-basic>`);
    expect(el.shadowRoot.querySelector('nav').getAttribute('aria-label')).to.equal('Paginación');
  });

  test('uses the visible page number as a standalone word in the label', async () => {
    const el = await fixture(
      html`<ac-pagination-basic total-pages="4" locale="es-PE"></ac-pagination-basic>`,
    );
    expect(pageButton(el, 3).getAttribute('aria-label')).to.equal('Ir a la página 3');
  });

  test('updates the accessible page label when the locale changes', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    el.locale = 'en-EN';
    await el.updateComplete;
    expect(pageButton(el, 3).getAttribute('aria-label')).to.equal('Go to page 3');
  });

  test('labels the previous and next buttons in Portuguese', async () => {
    const el = await fixture(html`<ac-pagination-basic locale="pt-BR"></ac-pagination-basic>`);
    expect(
      ['previous', 'next'].map(direction => arrowButton(el, direction).getAttribute('aria-label')),
    ).to.deep.equal(['Página anterior', 'Próxima página']);
  });

  test('keeps focus on a page button when its sibling window changes', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="10" total-pages="20"></ac-pagination-basic>`,
    );
    const button = pageButton(el, 11);
    button.focus();
    button.click();
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(button);
  });

  test('moves focus to the page button when the focused next arrow becomes disabled', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="3" total-pages="4"></ac-pagination-basic>`,
    );
    const next = arrowButton(el, 'next');
    next.focus();
    next.click();
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(pageButton(el, 4));
  });
});

suite('ac-pagination-basic: interaction', () => {
  test('marks the page clicked by the user as current', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    const button = pageButton(el, 3);
    button.click();
    await el.updateComplete;
    expect(currentPage(el)).to.equal(button);
  });

  test('emits page-change once with the page number clicked by the user', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    const changes = [];
    el.addEventListener(PAGE_CHANGE, event => changes.push(event.detail));
    pageButton(el, 3).click();
    await el.updateComplete;
    expect(changes).to.deep.equal([{ page: 3 }]);
  });

  test('emits page-change with the preceding page when the previous button is clicked', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="3" total-pages="4"></ac-pagination-basic>`,
    );
    const changes = [];
    el.addEventListener(PAGE_CHANGE, event => changes.push(event.detail));
    arrowButton(el, 'previous').click();
    await el.updateComplete;
    expect(changes).to.deep.equal([{ page: 2 }]);
  });

  test('emits page-change with the following page when the next button is clicked', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    const changes = [];
    el.addEventListener(PAGE_CHANGE, event => changes.push(event.detail));
    arrowButton(el, 'next').click();
    await el.updateComplete;
    expect(changes).to.deep.equal([{ page: 2 }]);
  });

  test('emits a bubbling and composed page-change', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    let change;
    el.parentElement.addEventListener(PAGE_CHANGE, event => {
      change = event;
    });
    pageButton(el, 3).click();
    await el.updateComplete;
    expect(change).to.include({ bubbles: true, composed: true });
  });

  test('stays on the first page when the disabled previous button is clicked', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    arrowButton(el, 'previous').click();
    await el.updateComplete;
    expect(el.page).to.equal(1);
  });

  test('stays on the last page when the disabled next button is clicked', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="4" total-pages="4"></ac-pagination-basic>`,
    );
    arrowButton(el, 'next').click();
    await el.updateComplete;
    expect(el.page).to.equal(4);
  });

  test('does not emit page-change when the current page is clicked', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    const changes = [];
    el.addEventListener(PAGE_CHANGE, event => changes.push(event.detail));
    pageButton(el, 1).click();
    await el.updateComplete;
    expect(changes).to.be.empty;
  });

  test('does not emit page-change while disabled', async () => {
    const el = await fixture(
      html`<ac-pagination-basic page="2" total-pages="4" disabled></ac-pagination-basic>`,
    );
    const changes = [];
    el.addEventListener(PAGE_CHANGE, event => changes.push(event.detail));
    el.shadowRoot.querySelectorAll('button').forEach(button => button.click());
    await el.updateComplete;
    expect(changes).to.be.empty;
  });

  test('does not emit page-change on the first render', async () => {
    const changes = [];
    await fixture(
      html`<ac-pagination-basic
        page="2"
        total-pages="4"
        @ac-pagination-basic-page-change=${event => changes.push(event.detail)}
      ></ac-pagination-basic>`,
    );
    expect(changes).to.be.empty;
  });

  test('does not emit page-change when page is assigned from outside', async () => {
    const el = await fixture(html`<ac-pagination-basic total-pages="4"></ac-pagination-basic>`);
    const changes = [];
    el.addEventListener(PAGE_CHANGE, event => changes.push(event.detail));
    el.page = 3;
    await el.updateComplete;
    expect(changes).to.be.empty;
  });
});
