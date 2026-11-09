@e2e
Feature: ac-switch-basic - interruptor

  Como desarrollador del catálogo ac-lit
  Quiero que ac-switch-basic se comporte como un interruptor real
  Para asegurar encendido, apagado y bloqueo

  Background:
    Given el usuario está en el demo de "ac-switch-basic"

  @smoke
  Scenario: Encender el interruptor dispara el evento de cambio
    When el usuario hace click en el interruptor "switch-wifi"
    Then el evento "ac-switch-basic-change" con checked "true" se registra en el log

  Scenario: Apagar un interruptor encendido dispara el evento con checked false
    When el usuario hace click en el interruptor "switch-on"
    Then el evento "ac-switch-basic-change" con checked "false" se registra en el log

  Scenario: Hacer click en el interruptor lo enciende
    When el usuario hace click en el interruptor "switch-wifi"
    Then el interruptor "switch-wifi" tiene checked igual a "true"

  Scenario: Un click en el interruptor deshabilitado no dispara el evento
    When el usuario selecciona el caso "1"
    And el usuario hace click en el interruptor "switch-disabled"
    Then el evento "ac-switch-basic-change" no se registra en el log
