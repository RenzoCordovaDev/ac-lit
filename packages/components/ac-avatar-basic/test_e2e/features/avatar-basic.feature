@e2e
Feature: ac-avatar-basic - representación de usuario

  Como desarrollador del catálogo ac-lit
  Quiero que ac-avatar-basic muestre una imagen o caiga a iniciales accesibles
  Para representar a una persona incluso sin foto o con una foto rota

  Background:
    Given el usuario está en el demo de "ac-avatar-basic"

  @smoke
  Scenario: Con una imagen válida se muestra la imagen
    Then el avatar "avatar-image" muestra una imagen con alt "Grace Hopper"

  Scenario: Con una imagen rota cae al fallback de iniciales
    Then el avatar "avatar-broken" muestra el fallback de iniciales

  Scenario: Sin imagen, un nombre de dos palabras muestra dos iniciales
    Then el avatar "avatar-two-words" muestra las iniciales "AL"

  Scenario: Sin imagen, un nombre de una palabra muestra una sola inicial
    Then el avatar "avatar-one-word" muestra las iniciales "P"

  Scenario: El fallback de iniciales tiene role="img" y aria-label con el nombre
    Then el avatar "avatar-two-words" tiene role "img" y aria-label "Ada Lovelace"

  Scenario: Sin nombre, el aria-label cae al texto traducido por defecto
    Then el avatar "avatar-unknown" tiene aria-label "Usuario"
