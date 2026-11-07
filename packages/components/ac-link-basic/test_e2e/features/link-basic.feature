@e2e
Feature: ac-link-basic - interacción básica

  Como desarrollador del catálogo ac-lit
  Quiero que ac-link-basic dispare su evento de click solo cuando está habilitado
  Para asegurar que el contrato de interacción del componente no se rompa

  Background:
    Given el usuario está en el demo de "ac-link-basic"

  @smoke
  Scenario: Un click en el link habilitado dispara el evento de click
    When el usuario hace click en el link "enabled"
    Then el evento "ac-link-basic-click" se registra en el log

  Scenario: Un click en el link disabled no dispara el evento de click
    When el usuario hace click en el link "disabled"
    Then el evento "ac-link-basic-click" no se registra en el log
