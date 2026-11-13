@e2e @accessibility
Feature: ac-transition-container - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-transition-container no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-transition-container"

  @smoke
  Scenario: El demo de ac-transition-container no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-transition-container no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El contenedor inicial abierto no tiene violaciones de accesibilidad
    When el usuario abre el contenedor con el botón "open-initial"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El contenedor inicial abierto no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    And el usuario abre el contenedor con el botón "open-initial"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: La sub-pantalla con flecha de volver no tiene violaciones de accesibilidad
    When el usuario selecciona el caso "1"
    And el usuario abre el contenedor con el botón "open-sequential"
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: La sub-pantalla con flecha de volver no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    And el usuario selecciona el caso "1"
    And el usuario abre el contenedor con el botón "open-sequential"
    Then el demo no tiene violaciones de accesibilidad WCAG
