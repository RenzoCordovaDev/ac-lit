@e2e @accessibility
Feature: ac-tabs-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-tabs-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-tabs-basic"

  @smoke
  Scenario: El demo de ac-tabs-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-tabs-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: Las pestañas con ambient secondary no tienen violaciones de accesibilidad
    When el usuario selecciona el ambient "secondary"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: Con otra pestaña activa no hay violaciones de accesibilidad
    When el usuario hace click en la pestaña "notifications" de "tabs-basic"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El caso de traducción y scroll no tiene violaciones de accesibilidad
    When el usuario selecciona el caso "1"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El caso de traducción y scroll no tiene violaciones en modo oscuro
    When el usuario selecciona el caso "1"
    And el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG
