@e2e @accessibility
Feature: ac-modal-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-modal-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-modal-basic"

  @smoke
  Scenario: El demo de ac-modal-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-modal-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El modal abierto no tiene violaciones de accesibilidad
    When el usuario abre el modal con el botón "open-offset"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El modal abierto no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    And el usuario abre el modal con el botón "open-offset"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El modal de pantalla completa no tiene violaciones de accesibilidad
    When el usuario abre el modal con el botón "open-full"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El modal con pie (botones y enlace) no tiene violaciones de accesibilidad
    When el usuario selecciona el caso "1"
    And el usuario abre el modal con el botón "open-footer"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El modal con pie no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    And el usuario selecciona el caso "1"
    And el usuario abre el modal con el botón "open-footer"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El modal con contenido largo y botón deshabilitado no tiene violaciones
    When el usuario selecciona el caso "1"
    And el usuario abre el modal con el botón "open-long"
    Then el demo no tiene violaciones de accesibilidad WCAG
