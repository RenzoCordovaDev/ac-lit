@e2e
Feature: ac-modal-basic - modal

  Como desarrollador del catálogo ac-lit
  Quiero que ac-modal-basic se abra y cierre con su animación y dispare sus eventos
  Para asegurar tamaños, cierre por botón/Escape/fondo, pie con acciones y modo persistente

  Background:
    Given el usuario está en el demo de "ac-modal-basic"

  @smoke
  Scenario: El botón abre el modal
    When el usuario abre el modal con el botón "open-offset"
    Then el modal "modal-offset" está abierto

  Scenario: El modal deja un espacio arriba con el tamaño por defecto
    When el usuario abre el modal con el botón "open-offset"
    Then el modal "modal-offset" deja un espacio arriba

  Scenario: El tamaño half ocupa la mitad de la pantalla
    When el usuario abre el modal con el botón "open-half"
    Then el modal "modal-half" ocupa la mitad de la altura de la pantalla

  Scenario: El tamaño full ocupa toda la pantalla
    When el usuario abre el modal con el botón "open-full"
    Then el modal "modal-full" ocupa toda la altura de la pantalla

  Scenario: Sin header se muestra el título por defecto
    When el usuario abre el modal con el botón "open-default-title"
    Then el título del modal "modal-default-title" es "Título"

  Scenario: El título por defecto se traduce al cambiar de idioma
    When el usuario selecciona el idioma "1"
    And el usuario abre el modal con el botón "open-default-title"
    Then el título del modal "modal-default-title" es "Title"

  Scenario: El botón de cerrar cierra el modal y dispara sus eventos
    When el usuario abre el modal con el botón "open-offset"
    And el usuario cierra el modal "modal-offset" con su botón de cerrar
    Then el modal "modal-offset" está cerrado
    And el evento "ac-modal-basic-close-click" se registra en el log
    And el evento "ac-modal-basic-close" con motivo "close-button" se registra en el log

  Scenario: Escape cierra el modal
    When el usuario abre el modal con el botón "open-offset"
    And el usuario pulsa Escape
    Then el modal "modal-offset" está cerrado
    And el evento "ac-modal-basic-close" con motivo "escape" se registra en el log

  Scenario: Hacer click fuera cierra el modal
    When el usuario abre el modal con el botón "open-offset"
    And el usuario hace click fuera del modal
    Then el modal "modal-offset" está cerrado
    And el evento "ac-modal-basic-close" con motivo "backdrop" se registra en el log

  Scenario: Abrir el modal dispara el evento de apertura
    When el usuario abre el modal con el botón "open-offset"
    And el usuario pulsa Escape
    Then el evento "ac-modal-basic-open" se registra en el log

  Scenario: El botón principal del pie dispara su evento y cierra el modal
    When el usuario selecciona el caso "1"
    And el usuario abre el modal con el botón "open-footer"
    And el usuario pulsa el botón principal del modal "modal-footer"
    Then el modal "modal-footer" está cerrado
    And el evento "ac-modal-basic-primary-click" se registra en el log

  Scenario: El botón secundario del pie dispara su evento
    When el usuario selecciona el caso "1"
    And el usuario abre el modal con el botón "open-footer"
    And el usuario pulsa el botón secundario del modal "modal-footer"
    Then el evento "ac-modal-basic-secondary-click" se registra en el log

  Scenario: El enlace del pie dispara su evento
    When el usuario selecciona el caso "1"
    And el usuario abre el modal con el botón "open-footer"
    And el usuario pulsa el enlace del modal "modal-footer"
    And el usuario pulsa Escape
    Then el evento "ac-modal-basic-link-click" se registra en el log

  Scenario: Un modal persistente no se cierra con Escape
    When el usuario selecciona el caso "1"
    And el usuario abre el modal con el botón "open-persistent"
    And el usuario pulsa Escape
    Then el modal "modal-persistent" está abierto
