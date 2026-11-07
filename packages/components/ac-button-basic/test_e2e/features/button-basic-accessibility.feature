@e2e @accessibility
Feature: ac-button-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-button-basic no introduzca violaciones WCAG
  Para mantener el componente accesible en todas sus variantes

  Background:
    Given el usuario está en el demo de "ac-button-basic"

  @smoke
  Scenario: El demo de ac-button-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG
