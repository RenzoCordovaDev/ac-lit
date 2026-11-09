@e2e
Feature: ac-input-basic - campo de texto

  Como desarrollador del catálogo ac-lit
  Quiero que ac-input-basic se comporte como un campo de texto real
  Para asegurar escritura, etiquetas, mensajes y estados

  Background:
    Given el usuario está en el demo de "ac-input-basic"

  @smoke
  Scenario: Escribir en el campo dispara el evento de input con el valor
    When el usuario escribe "Renzo" en el campo "input-name"
    Then el evento "ac-input-basic-input" con valor "Renzo" se registra en el log

  Scenario: El valor del componente refleja lo escrito
    When el usuario escribe "Ana" en el campo "input-name"
    Then el campo "input-name" tiene el valor "Ana"

  Scenario: Hacer click en la etiqueta lleva el foco al campo
    When el usuario hace click en la etiqueta del campo "input-name"
    Then el campo "input-name" tiene el foco

  Scenario: La ayuda se muestra debajo del campo
    Then el campo "input-name" muestra el mensaje "Como aparece en tu documento."

  Scenario: El error reemplaza a la ayuda y se traduce
    When el usuario selecciona el caso "1"
    Then el campo "input-error" muestra el mensaje "Ingresa un correo válido."

  Scenario: Un campo deshabilitado no se puede editar
    When el usuario selecciona el caso "1"
    Then el campo "input-disabled" está deshabilitado
