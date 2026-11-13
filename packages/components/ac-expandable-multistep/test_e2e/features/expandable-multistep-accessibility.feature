@e2e @accessibility
Feature: ac-expandable-multistep - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-expandable-multistep no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-expandable-multistep"

  @smoke
  Scenario: El demo de ac-expandable-multistep no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-expandable-multistep no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-expandable-multistep no tiene violaciones de accesibilidad con la confirmación visible
    When el usuario completa el paso "1"
    And el usuario completa el paso "2"
    And el usuario completa el paso "3"
    Then el demo no tiene violaciones de accesibilidad WCAG
