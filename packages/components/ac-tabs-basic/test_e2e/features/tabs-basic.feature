@e2e
Feature: ac-tabs-basic - pestañas

  Como desarrollador del catálogo ac-lit
  Quiero que ac-tabs-basic muestre el panel de la pestaña activa
  Para asegurar selección con ratón y teclado, pestañas deshabilitadas y traducción

  Background:
    Given el usuario está en el demo de "ac-tabs-basic"

  @smoke
  Scenario: La primera pestaña está activa por defecto y muestra su panel
    Then la pestaña activa de "tabs-basic" es "general"
    And el panel "panel-general" es visible

  Scenario: Hacer click en una pestaña muestra su panel y oculta el anterior
    When el usuario hace click en la pestaña "notifications" de "tabs-basic"
    Then el panel "panel-notifications" es visible
    And el panel "panel-general" está oculto

  Scenario: Hacer click en una pestaña dispara el evento de cambio
    When el usuario hace click en la pestaña "about" de "tabs-basic"
    Then el evento "ac-tabs-basic-change" con id "about" se registra en el log

  Scenario: La flecha derecha pasa a la siguiente pestaña
    When el usuario hace click en la pestaña "general" de "tabs-basic"
    And el usuario pulsa la tecla "ArrowRight"
    Then la pestaña activa de "tabs-basic" es "notifications"
    And la pestaña "notifications" de "tabs-basic" tiene el foco

  Scenario: La flecha derecha se salta la pestaña deshabilitada
    When el usuario hace click en la pestaña "notifications" de "tabs-basic"
    And el usuario pulsa la tecla "ArrowRight"
    Then la pestaña activa de "tabs-basic" es "about"

  Scenario: End lleva a la última pestaña
    When el usuario hace click en la pestaña "general" de "tabs-basic"
    And el usuario pulsa la tecla "End"
    Then la pestaña activa de "tabs-basic" es "about"

  Scenario: Home vuelve a la primera pestaña
    When el usuario hace click en la pestaña "about" de "tabs-basic"
    And el usuario pulsa la tecla "Home"
    Then la pestaña activa de "tabs-basic" es "general"

  Scenario: Una pestaña deshabilitada no se puede activar
    Then la pestaña "advanced" de "tabs-basic" está deshabilitada

  Scenario: La pestaña inicial respeta la propiedad selected
    Then la pestaña activa de "tabs-selected" es "two"
    And el panel "panel-two" es visible

  Scenario: Las etiquetas se traducen al cambiar de idioma
    When el usuario selecciona el caso "1"
    And el usuario selecciona el idioma "1"
    Then la pestaña "profile" de "tabs-i18n" muestra el texto "Profile"
