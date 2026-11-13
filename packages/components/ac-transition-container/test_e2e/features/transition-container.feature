@e2e
Feature: ac-transition-container - navegación de pantalla completa

  Como desarrollador del catálogo ac-lit
  Quiero que ac-transition-container se abra y cierre con su animación y dispare sus eventos
  Para asegurar la navegación tipo "entrar a una sub-pantalla" y el modo persistente

  Background:
    Given el usuario está en el demo de "ac-transition-container"

  @smoke
  Scenario: El botón abre el contenedor
    When el usuario abre el contenedor con el botón "open-initial"
    Then el contenedor "transition-initial" está visible

  Scenario: Sin header-text se muestra el título por defecto
    When el usuario abre el contenedor con el botón "open-default-title"
    Then el título del contenedor "transition-default-title" es "Título"

  Scenario: El título por defecto se traduce al cambiar de idioma
    When el usuario selecciona el idioma "1"
    And el usuario abre el contenedor con el botón "open-default-title"
    Then el título del contenedor "transition-default-title" es "Title"

  Scenario: Abrir el contenedor dispara el evento de apertura
    When el usuario abre el contenedor con el botón "open-initial"
    And el usuario pulsa Escape
    Then el evento "ac-transition-container-open" se registra en el log

  Scenario: Escape cierra el contenedor
    When el usuario abre el contenedor con el botón "open-initial"
    And el usuario pulsa Escape
    Then el contenedor "transition-initial" está cerrado
    And el evento "ac-transition-container-close" con motivo "escape" se registra en el log

  Scenario: Un contenedor persistente no se cierra con Escape
    When el usuario selecciona el caso "1"
    And el usuario abre el contenedor con el botón "open-sequential-persistent"
    And el usuario pulsa Escape
    Then el contenedor "transition-sequential-persistent" está visible

  Scenario: La flecha de volver no cierra por sí sola un contenedor persistente
    When el usuario selecciona el caso "1"
    And el usuario abre el contenedor con el botón "open-sequential-persistent"
    And el usuario pulsa la flecha de volver del contenedor "transition-sequential-persistent"
    Then el contenedor "transition-sequential-persistent" está visible

  Scenario: La flecha de volver cierra el contenedor y dispara su evento cuando la demo lo escucha
    When el usuario selecciona el caso "1"
    And el usuario abre el contenedor con el botón "open-sequential"
    And el usuario pulsa la flecha de volver del contenedor "transition-sequential"
    Then el contenedor "transition-sequential" está cerrado
    And el evento "ac-transition-container-header-back-icon-click" se registra en el log

  Scenario: El ícono de menú no cierra el contenedor y dispara su propio evento
    When el usuario abre el contenedor con el botón "open-initial"
    And el usuario pulsa el ícono de menú del contenedor "transition-initial"
    Then el contenedor "transition-initial" está visible
    When el usuario pulsa Escape
    Then el evento "ac-transition-container-header-menu-icon-click" se registra en el log
