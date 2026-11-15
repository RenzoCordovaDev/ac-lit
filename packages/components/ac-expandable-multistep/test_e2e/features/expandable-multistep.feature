@e2e
Feature: ac-expandable-multistep - flujo completo

  Como desarrollador del catálogo ac-lit
  Quiero que ac-expandable-multistep coordine a sus ac-expandable-step hijos
  Para que el consumidor pueda construir un flujo multi-paso sin wiring propio

  Background:
    Given el usuario está en el demo de "ac-expandable-multistep"

  @smoke
  Scenario: Completar el primer paso activa el segundo
    When el usuario completa el paso "1"
    Then el paso "2" está activo

  @smoke
  Scenario: Completar los 3 pasos muestra la confirmación final
    When el usuario completa el paso "1"
    And el usuario completa el paso "2"
    And el usuario completa el paso "3"
    Then el usuario ve la confirmación final

  Scenario: Editar un paso ya completado resetea los posteriores a pendiente
    Given el usuario completó los pasos "1", "2" y "3"
    When el usuario edita el paso "2"
    Then el paso "3" vuelve a estar pendiente
    And la confirmación final ya no es visible
