@e2e @accessibility
Feature: ac-card-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-card-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-card-basic"

  @smoke
  Scenario: El demo de ac-card-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-card-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG
