@e2e
Feature: ac-demo-content - contenedor de demos

  Como desarrollador del catálogo ac-lit
  Quiero que ac-demo-content centralice casos, idioma, ambient, tema, tamaño
  de dispositivo y eventos
  Para no reimplementar esto en cada demo de componente

  Background:
    Given el usuario está en el demo de "ac-demo-content"

  @smoke
  Scenario: El primer caso está activo por defecto
    Then el elemento "case-basic-button" es visible

  Scenario: Cambiar de caso carga el contenido del nuevo caso
    When el usuario selecciona el caso "1"
    Then el elemento "case-states-disabled" es visible

  Scenario: El dispositivo por defecto es móvil
    Then el marco de dispositivo es "mobile"

  Scenario: Cambiar el dispositivo ajusta el marco del viewport
    When el usuario selecciona el dispositivo "desktop"
    Then el marco de dispositivo es "desktop"

  Scenario: El switch de idioma cambia el locale activo
    When el usuario activa el switch de idioma
    Then el switch de idioma queda en "en-EN"

  Scenario: El toggle de tema cambia a modo oscuro
    When el usuario activa el toggle de tema
    Then el documento queda en data-theme "dark"

  Scenario: Un evento escuchado se puede ver en el modal de eventos
    When el usuario hace click en el elemento "case-basic-button"
    And el usuario abre el modal de eventos
    Then el evento "ac-demo-sample-click" aparece en el modal de eventos
