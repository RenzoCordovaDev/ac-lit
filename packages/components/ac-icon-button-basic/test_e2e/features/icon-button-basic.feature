@e2e
Feature: ac-icon-button-basic - interacción por click

  Como desarrollador del catálogo ac-lit
  Quiero que ac-icon-button-basic dispare un click nativo solo cuando está habilitado
  Para usarlo como acción compacta en una toolbar/barra de acciones

  Background:
    Given el usuario está en el demo de "ac-icon-button-basic"

  @smoke
  Scenario: Un click en el botón habilitado incrementa el contador de clicks del demo
    When el usuario hace click en el botón "icon-button-click-target"
    Then el contador de clicks muestra "1"

  Scenario: Un click en un botón deshabilitado no incrementa el contador de clicks
    When el usuario hace click en el botón "icon-button-disabled"
    Then el contador de clicks muestra "0"
