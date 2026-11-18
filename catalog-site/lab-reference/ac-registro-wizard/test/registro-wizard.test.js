import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing';
import '../index.js';

function fastApi(el) {
  const api = el.shadowRoot.querySelector('ac-api-users');
  api.timeout = 1;
  return api;
}

async function fillStep1(el, { nombre = 'Juan Perez', email = 'juan@test.com' } = {}) {
  const [nombreInput, emailInput] = el.shadowRoot.querySelectorAll('ac-input-basic');
  const nombreField = nombreInput.shadowRoot.querySelector('input');
  nombreField.value = nombre;
  nombreField.dispatchEvent(new Event('input'));
  const emailField = emailInput.shadowRoot.querySelector('input');
  emailField.value = email;
  emailField.dispatchEvent(new Event('input'));
  await el.updateComplete;
}

function clickActionButton(el, index) {
  const button = el.shadowRoot.querySelectorAll('.registro-wizard__actions ac-button-basic')[index];
  button.shadowRoot.querySelector('button').click();
}

function acceptTerminos(el) {
  const checkbox = el.shadowRoot.querySelector('ac-checkbox-basic');
  const input = checkbox.shadowRoot.querySelector('input');
  input.checked = true;
  input.dispatchEvent(new Event('change'));
}

function steps(el) {
  return el.shadowRoot.querySelectorAll('ac-expandable-step');
}

async function advanceToStep3(el) {
  await fillStep1(el);
  clickActionButton(el, 0);
  await aTimeout(30);
  acceptTerminos(el);
  await el.updateComplete;
  clickActionButton(el, 1);
  await aTimeout(30);
}

suite('ac-registro-wizard', () => {
  test('contained por defecto es false', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    expect(el.contained).to.be.false;
  });

  test('_open es true al conectarse', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    expect(el._open).to.be.true;
  });

  test('init() invoca obtenerDatosUsuario sobre el ac-api-users interno', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    fastApi(el);
    const successEvent = oneEvent(el, 'ac-api-users-get-user-success');
    el.init();
    const event = await successEvent;
    expect(event.detail.method).to.equal('obtenerDatosUsuario');
  });

  test('init() termina mostrando el saludo con el nombre del usuario', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    fastApi(el);
    const successEvent = oneEvent(el, 'ac-api-users-get-user-success');
    el.init();
    await successEvent;
    await el.updateComplete;
    expect(el._welcomeUser.nombre).to.equal('Ana Torres');
  });

  test('completar el paso 1 y hacer click en Siguiente activa el paso 2', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    await fillStep1(el);
    clickActionButton(el, 0);
    await aTimeout(30);
    expect(steps(el)[1].active).to.be.true;
  });

  test('sin nombre ni correo, click en Siguiente no avanza al paso 2', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    clickActionButton(el, 0);
    await aTimeout(30);
    expect(steps(el)[1].active).to.be.false;
  });

  test('sin nombre ni correo, click en Siguiente muestra el error de validación', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    clickActionButton(el, 0);
    await el.updateComplete;
    expect(el._nombreError).to.equal('Completa tu nombre y correo para continuar.');
  });

  test('confirmar con éxito dispara ac-registro-wizard-register-success', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    fastApi(el);
    await advanceToStep3(el);
    const successEvent = oneEvent(el, 'ac-registro-wizard-register-success');
    clickActionButton(el, 2);
    const event = await successEvent;
    expect(event.detail.data.nombre).to.equal('Juan Perez');
  });

  test('confirmar con éxito abre el modal de confirmación', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    fastApi(el);
    await advanceToStep3(el);
    const successEvent = oneEvent(el, 'ac-registro-wizard-register-success');
    clickActionButton(el, 2);
    await successEvent;
    await el.updateComplete;
    expect(el._modalOpen).to.be.true;
  });

  test('confirmar con éxito cierra la transición del wizard', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    fastApi(el);
    await advanceToStep3(el);
    const successEvent = oneEvent(el, 'ac-registro-wizard-register-success');
    clickActionButton(el, 2);
    await successEvent;
    await el.updateComplete;
    expect(el._open).to.be.false;
  });

  test('el error de registro dispara ac-registro-wizard-register-error', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    const api = fastApi(el);
    await advanceToStep3(el);
    api.simulateError = true;
    const errorEvent = oneEvent(el, 'ac-registro-wizard-register-error');
    clickActionButton(el, 2);
    const event = await errorEvent;
    expect(event.detail.error).to.exist;
  });

  test('el error de registro muestra la notificación sin cerrar la transición', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    const api = fastApi(el);
    await advanceToStep3(el);
    api.simulateError = true;
    const errorEvent = oneEvent(el, 'ac-registro-wizard-register-error');
    clickActionButton(el, 2);
    await errorEvent;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('ac-notification-basic')).to.exist;
  });

  test('el error de registro no cierra la transición del wizard', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    const api = fastApi(el);
    await advanceToStep3(el);
    api.simulateError = true;
    const errorEvent = oneEvent(el, 'ac-registro-wizard-register-error');
    clickActionButton(el, 2);
    await errorEvent;
    await el.updateComplete;
    expect(el._open).to.be.true;
  });

  test('reset() dispara ac-registro-wizard-reset', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    const resetEvent = oneEvent(el, 'ac-registro-wizard-reset');
    el.reset();
    const event = await resetEvent;
    expect(event.type).to.equal('ac-registro-wizard-reset');
  });

  test('reset() vuelve _nombre a una cadena vacía', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    await fillStep1(el);
    el.reset();
    expect(el._nombre).to.equal('');
  });

  test('reset() vuelve a activar el paso 1', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    await fillStep1(el);
    clickActionButton(el, 0);
    await aTimeout(30);
    el.reset();
    expect(steps(el)[0].active).to.be.true;
  });

  test('avanzar de paso dispara ac-registro-wizard-step-change', async () => {
    const el = await fixture(html`<ac-registro-wizard></ac-registro-wizard>`);
    await fillStep1(el);
    const stepChangeEvent = oneEvent(el, 'ac-registro-wizard-step-change');
    clickActionButton(el, 0);
    const event = await stepChangeEvent;
    expect(event.detail).to.deep.equal({ step: 2, totalSteps: 3 });
  });
});
