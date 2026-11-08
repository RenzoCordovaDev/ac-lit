@e2e @accessibility
Feature: ac-radio-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-radio-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-radio-basic"

  @smoke
  Scenario: El demo de ac-radio-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG
