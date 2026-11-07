@e2e @accessibility
Feature: ac-link-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-link-basic no introduzca violaciones WCAG
  Para mantener el componente accesible en todas sus variantes

  Background:
    Given el usuario está en el demo de "ac-link-basic"

  @smoke
  Scenario: El demo de ac-link-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG
