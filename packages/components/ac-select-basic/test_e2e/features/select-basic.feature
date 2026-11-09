@e2e
Feature: ac-select-basic - lista desplegable

  Como desarrollador del catálogo ac-lit
  Quiero que ac-select-basic se comporte como un select real
  Para asegurar selección, opciones por propiedad o slot, traducción y estados

  Background:
    Given el usuario está en el demo de "ac-select-basic"

  @smoke
  Scenario: Elegir una opción dispara el evento de cambio con el valor
    When el usuario elige la opción "annual" en el selector "select-plan"
    Then el evento "ac-select-basic-change" con valor "annual" se registra en el log

  Scenario: Elegir una opción actualiza el valor del componente
    When el usuario elige la opción "annual" en el selector "select-plan"
    Then el selector "select-plan" tiene el valor "annual"

  Scenario: Las opciones por slot respetan la opción preseleccionada
    Then el selector "select-slot" muestra la opción "Colombia"

  Scenario: Las opciones por slot se pueden cambiar
    When el usuario elige la opción "cl" en el selector "select-slot"
    Then el selector "select-slot" tiene el valor "cl"

  Scenario: Un selector con error muestra su mensaje
    When el usuario selecciona el caso "1"
    Then el selector "select-error" muestra el mensaje "Selecciona un plan para continuar."

  Scenario: Un selector deshabilitado no se puede usar
    When el usuario selecciona el caso "1"
    Then el selector "select-disabled" está deshabilitado

  Scenario: Las opciones con clave de traducción se muestran en español
    When el usuario selecciona el caso "2"
    And el usuario elige la opción "annual" en el selector "select-i18n"
    Then el selector "select-i18n" muestra la opción "Anual"

  Scenario: Cambiar el idioma traduce la opción seleccionada
    When el usuario selecciona el caso "2"
    And el usuario elige la opción "annual" en el selector "select-i18n"
    And el usuario selecciona el idioma "1"
    Then el selector "select-i18n" muestra la opción "Annual"
