@e2e @accessibility
Feature: ac-demo-content - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-demo-content no introduzca violaciones WCAG
  Para mantener el contenedor de demos accesible

  Background:
    Given el usuario está en el demo de "ac-demo-content"

  @smoke
  Scenario: El demo de ac-demo-content no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-demo-content no tiene violaciones de accesibilidad en modo oscuro
    When el usuario selecciona el tema "dark"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El panel de eventos no tiene violaciones de accesibilidad
    When el usuario abre el panel de eventos
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: La vista de código no tiene violaciones de accesibilidad
    When el usuario selecciona la vista "code"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: La vista de código no tiene violaciones de accesibilidad en modo oscuro
    When el usuario selecciona el tema "dark"
    And el usuario selecciona la vista "code"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: La lista desplegable de casos abierta no tiene violaciones de accesibilidad
    When el usuario abre la lista de casos
    Then la fila del selector de casos no tiene violaciones de accesibilidad WCAG

  Scenario: El método de instalación copiado no tiene violaciones de accesibilidad
    When el usuario hace click en el método de instalación "pnpm"
    Then el demo no tiene violaciones de accesibilidad WCAG
