@e2e @accessibility
Feature: ac-expandable-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-expandable-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-expandable-basic"

  @smoke
  Scenario: El demo de ac-expandable-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-expandable-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El panel con ambient secondary no tiene violaciones de accesibilidad
    When el usuario selecciona el ambient "secondary"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: Con todos los paneles cerrados no hay violaciones de accesibilidad
    When el usuario hace click en la cabecera de "expandable-details"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: Los grupos y estados no tienen violaciones de accesibilidad
    When el usuario selecciona el caso "1"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: Los grupos y estados no tienen violaciones de accesibilidad en modo oscuro
    When el usuario selecciona el caso "1"
    And el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG
