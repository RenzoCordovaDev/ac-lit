@e2e
Feature: ac-button-basic - interacción básica

  Como desarrollador del catálogo ac-lit
  Quiero que ac-button-basic dispare su evento de click solo cuando está habilitado
  Para asegurar que el contrato de interacción del componente no se rompa

  Background:
    Given el usuario está en el demo de "ac-button-basic"

  @smoke
  Scenario: Un click en el botón habilitado dispara el evento de click
    When el usuario hace click en el botón "enabled"
    Then el evento "ac-button-basic-click" se registra en el log

  Scenario Outline: Un click en un botón <estado> no dispara el evento de click
    When el usuario hace click en el botón "<estado>"
    Then el evento "ac-button-basic-click" no se registra en el log

    Examples:
      | estado   |
      | disabled |
      | loading  |
