@e2e
Feature: ac-expandable-step - paso de un flujo multi-paso

  Como desarrollador del catálogo ac-lit
  Quiero que ac-expandable-step muestre sus 3 estados (activo, completado, deshabilitado)
  Para asegurar el contenido, el link "Modificar" y sus eventos

  Background:
    Given el usuario está en el demo de "ac-expandable-step"

  @smoke
  Scenario: El paso completado muestra su título
    Then el paso "expandable-step-collapsed" muestra el título "Datos de envío"

  Scenario: El paso completado muestra el resumen por slot
    Then el paso "expandable-step-collapsed" muestra el resumen "Av. Siempre Viva 742, Lima — entrega estándar"

  @smoke
  Scenario: Click en "Modificar" dispara el evento de edición
    When el usuario hace click en el link "Modificar" de "expandable-step-collapsed"
    Then el evento "ac-expandable-step-edit" se registra en el log

  Scenario: Click en "Modificar" no cambia el estado del paso por sí solo
    When el usuario hace click en el link "Modificar" de "expandable-step-collapsed"
    Then el paso "expandable-step-collapsed" tiene completed igual a "true"

  Scenario: El paso activo muestra su contador
    When el usuario selecciona el caso "1"
    Then el paso "expandable-step-active" muestra el contador "Paso 2 de 4"

  Scenario: El paso activo muestra su contenido real
    When el usuario selecciona el caso "1"
    Then el contenido del paso "expandable-step-active" es visible

  Scenario: El paso deshabilitado no muestra el link "Modificar"
    When el usuario selecciona el caso "2"
    Then el paso "expandable-step-disabled" no muestra el link "Modificar"

  Scenario: Cambiar el idioma traduce el link "Modificar"
    When el usuario selecciona el idioma "1"
    Then el paso "expandable-step-collapsed" muestra el link "Modificar" como "Edit"
