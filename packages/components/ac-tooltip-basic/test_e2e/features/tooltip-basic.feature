@e2e
Feature: ac-tooltip-basic - mostrar y ocultar el globo

  Como desarrollador del catálogo ac-lit
  Quiero que ac-tooltip-basic muestre su globo con hover/foco y lo oculte con Escape
  Para asegurar que el tooltip funciona con mouse y con teclado

  Background:
    Given el usuario está en el demo de "ac-tooltip-basic"

  @smoke
  Scenario: Pasar el mouse sobre el trigger muestra el globo
    When el usuario pasa el mouse sobre el trigger de "tooltip-top"
    Then el globo de "tooltip-top" es visible

  Scenario: Quitar el mouse del trigger oculta el globo
    When el usuario pasa el mouse sobre el trigger de "tooltip-top"
    And el usuario quita el mouse del trigger de "tooltip-top"
    Then el globo de "tooltip-top" está oculto

  Scenario: Presionar Escape oculta el globo mostrado
    When el usuario pasa el mouse sobre el trigger de "tooltip-top"
    And el usuario presiona Escape
    Then el globo de "tooltip-top" está oculto

  Scenario: Enfocar el trigger con teclado muestra el globo
    When el usuario selecciona el caso "2"
    And el usuario enfoca con teclado el trigger de "tooltip-keyboard"
    Then el globo de "tooltip-keyboard" es visible

  Scenario: Quitar el foco del trigger oculta el globo
    When el usuario selecciona el caso "2"
    And el usuario enfoca con teclado el trigger de "tooltip-keyboard"
    And el usuario quita el foco del trigger de "tooltip-keyboard"
    Then el globo de "tooltip-keyboard" está oculto

  Scenario: Un trigger deshabilitado nunca muestra el globo
    When el usuario selecciona el caso "1"
    And el usuario pasa el mouse sobre el trigger de "tooltip-disabled"
    Then el globo de "tooltip-disabled" está oculto
