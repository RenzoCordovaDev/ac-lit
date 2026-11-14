@e2e
Feature: ac-textarea-basic - campo de texto multilínea

  Como desarrollador del catálogo ac-lit
  Quiero que ac-textarea-basic se comporte como un campo de texto multilínea real
  Para asegurar escritura, etiquetas, mensajes y estados

  Background:
    Given el usuario está en el demo de "ac-textarea-basic"

  @smoke
  Scenario: Escribir en el campo dispara el evento de input con el valor
    When el usuario escribe "Todo salió bien" en el campo "textarea-comment"
    Then el evento "ac-textarea-basic-input" con valor "Todo salió bien" se registra en el log

  Scenario: El valor del componente refleja lo escrito
    When el usuario escribe "Ana" en el campo "textarea-comment"
    Then el campo "textarea-comment" tiene el valor "Ana"

  Scenario: Hacer click en la etiqueta lleva el foco al campo
    When el usuario hace click en la etiqueta del campo "textarea-comment"
    Then el campo "textarea-comment" tiene el foco

  Scenario: La ayuda se muestra debajo del campo
    Then el campo "textarea-comment" muestra el mensaje "Máximo 500 caracteres."

  Scenario: El campo admite un alto personalizado con rows
    Then el campo "textarea-rows" tiene 8 filas

  Scenario: El error reemplaza a la ayuda
    When el usuario selecciona el caso "1"
    Then el campo "textarea-error" muestra el mensaje "Completá el comentario."

  Scenario: Un campo deshabilitado no se puede editar
    When el usuario selecciona el caso "1"
    Then el campo "textarea-disabled" está deshabilitado
