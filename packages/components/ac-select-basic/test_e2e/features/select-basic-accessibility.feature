@e2e @accessibility
Feature: ac-select-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-select-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-select-basic"

  @smoke
  Scenario: El demo de ac-select-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-select-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El selector con ambient secondary no tiene violaciones de accesibilidad
    When el usuario selecciona el ambient "secondary"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: Los estados (error, obligatorio, deshabilitado) no tienen violaciones de accesibilidad
    When el usuario selecciona el caso "1"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: Los estados no tienen violaciones de accesibilidad en modo oscuro
    When el usuario selecciona el caso "1"
    And el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El caso de traducción no tiene violaciones de accesibilidad
    When el usuario selecciona el caso "2"
    Then el demo no tiene violaciones de accesibilidad WCAG
