@e2e
Feature: ac-demo-content - contenedor de demos

  Como desarrollador del catálogo ac-lit
  Quiero que ac-demo-content centralice casos, idioma, ambient, tema y eventos
  Para no reimplementar esto en cada demo de componente

  Background:
    Given el usuario está en el demo de "ac-demo-content"

  @smoke
  Scenario: El primer caso está activo por defecto
    Then el elemento "case-basic-button" es visible

  Scenario: Cambiar de caso carga el contenido del nuevo caso
    When el usuario selecciona el caso "1"
    Then el elemento "case-states-disabled" es visible

  Scenario: Un evento escuchado se registra en el panel
    When el usuario hace click en el elemento "case-basic-button"
    Then el evento "ac-button-basic-click" se registra en el panel

  Scenario: El toggle de tema cambia a modo claro
    When el usuario activa el toggle de tema
    Then el documento queda en data-theme "light"

  Scenario: Cambiar el tamaño ajusta el ancho del viewport
    When el usuario selecciona el tamaño "480"
    Then el viewport tiene max-width "480px"
