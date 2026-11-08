@e2e @accessibility
Feature: __tag__ - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que __tag__ no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "__tag__"

  @smoke
  Scenario: El demo de __tag__ no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de __tag__ no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG
