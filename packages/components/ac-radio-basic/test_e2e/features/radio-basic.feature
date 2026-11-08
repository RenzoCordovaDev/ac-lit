@e2e
Feature: ac-radio-basic - grupo de opciones

  Como desarrollador del catálogo ac-lit
  Quiero que ac-radio-basic se comporte como un grupo de radio real
  Para asegurar que solo una opción quede marcada a la vez

  Background:
    Given el usuario está en el demo de "ac-radio-basic"

  @smoke
  Scenario: Seleccionar una opción dispara el evento de cambio
    When el usuario selecciona la opción "annual"
    Then el evento "ac-radio-basic-change" con valor "annual" se registra en el log

  Scenario: Seleccionar una opción desmarca la opción previamente marcada
    When el usuario selecciona la opción "annual"
    Then la opción "monthly" queda desmarcada

  Scenario: Un click en la opción disabled no dispara el evento de cambio
    When el usuario hace click en la opción "disabled"
    Then el evento "ac-radio-basic-change" no se registra en el log
