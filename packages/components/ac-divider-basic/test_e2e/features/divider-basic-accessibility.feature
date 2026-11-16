@e2e @accessibility
Feature: ac-divider-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-divider-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-divider-basic"

  @smoke
  Scenario: El demo de ac-divider-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-divider-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG
