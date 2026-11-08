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
    When el usuario activa el toggle de tema
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El modal de eventos no tiene violaciones de accesibilidad
    When el usuario abre el modal de eventos
    Then el demo no tiene violaciones de accesibilidad WCAG
