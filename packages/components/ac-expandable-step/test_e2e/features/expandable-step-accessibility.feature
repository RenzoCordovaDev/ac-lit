@e2e @accessibility
Feature: ac-expandable-step - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-expandable-step no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-expandable-step"

  @smoke
  Scenario: El demo de ac-expandable-step no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-expandable-step no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El paso activo no tiene violaciones de accesibilidad
    When el usuario selecciona el caso "1"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El paso activo no tiene violaciones de accesibilidad en modo oscuro
    When el usuario selecciona el caso "1"
    And el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El ambient secondary no tiene violaciones de accesibilidad
    When el usuario selecciona el ambient "secondary"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El ambient secondary no tiene violaciones de accesibilidad en modo oscuro
    When el usuario selecciona el ambient "secondary"
    And el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG
