@e2e
Feature: ac-checkbox-basic - casilla de verificación

  Como desarrollador del catálogo ac-lit
  Quiero que ac-checkbox-basic se comporte como una casilla real
  Para asegurar marcado, desmarcado, estado indeterminado y bloqueo

  Background:
    Given el usuario está en el demo de "ac-checkbox-basic"

  @smoke
  Scenario: Marcar la casilla dispara el evento de cambio
    When el usuario hace click en la casilla "checkbox-newsletter"
    Then el evento "ac-checkbox-basic-change" con checked "true" se registra en el log

  Scenario: Desmarcar una casilla marcada dispara el evento con checked false
    When el usuario hace click en la casilla "checkbox-checked"
    Then el evento "ac-checkbox-basic-change" con checked "false" se registra en el log

  Scenario: Hacer click en la casilla la marca
    When el usuario hace click en la casilla "checkbox-newsletter"
    Then la casilla "checkbox-newsletter" tiene checked igual a "true"

  Scenario: Una casilla indeterminada deja de serlo al hacer click
    When el usuario selecciona el caso "1"
    And el usuario hace click en la casilla "checkbox-indeterminate"
    Then la casilla "checkbox-indeterminate" tiene indeterminate igual a "false"

  Scenario: Un click en la casilla deshabilitada no dispara el evento
    When el usuario selecciona el caso "1"
    And el usuario hace click en la casilla "checkbox-disabled"
    Then el evento "ac-checkbox-basic-change" no se registra en el log
