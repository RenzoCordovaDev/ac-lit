@e2e
Feature: ac-text-basic - texto traducible

  Como desarrollador del catálogo ac-lit
  Quiero que ac-text-basic muestre su contenido y traduzca literales con this.t()
  Para no repetir la lógica de i18n en cada pantalla

  Background:
    Given el usuario está en el demo de "ac-text-basic"

  @smoke
  Scenario: El componente muestra el contenido del slot
    Then el texto "text-slot" muestra "Texto sin traducir"

  Scenario: La etiqueta indicada en tag se renderiza
    Then el texto "text-heading" se renderiza como "h3"

  Scenario: Una clave de locales.json se traduce al idioma activo
    When el usuario selecciona el caso "1"
    Then el texto "text-builtin" muestra "Hola"

  Scenario: Cambiar el idioma traduce las claves de la aplicación
    When el usuario selecciona el caso "1"
    And el usuario selecciona el idioma "1"
    Then el texto "text-app" muestra "Welcome to ac-lit"

  Scenario: Los parámetros se interpolan en la traducción
    When el usuario selecciona el caso "1"
    And el usuario selecciona el idioma "1"
    Then el texto "text-params" muestra "Hello, Renzo. You have 3 messages."

  Scenario: Sin traducción se muestra el literal
    When el usuario selecciona el caso "1"
    Then el texto "text-literal" muestra "Texto sin traducción"
