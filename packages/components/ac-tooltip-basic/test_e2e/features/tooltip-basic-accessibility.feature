@e2e @accessibility
Feature: ac-tooltip-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-tooltip-basic no introduzca violaciones WCAG
  Para mantener el componente accesible, incluso con el globo visible

  Background:
    Given el usuario está en el demo de "ac-tooltip-basic"

  @smoke
  Scenario: El demo de ac-tooltip-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-tooltip-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-tooltip-basic no tiene violaciones de accesibilidad con el globo visible
    When el usuario pasa el mouse sobre el trigger de "tooltip-top"
    Then el demo no tiene violaciones de accesibilidad WCAG
