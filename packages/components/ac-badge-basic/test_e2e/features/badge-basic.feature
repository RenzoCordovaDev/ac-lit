@e2e
Feature: ac-badge-basic - contenido por variante

  Como desarrollador del catálogo ac-lit
  Quiero verificar que cada variante de ac-badge-basic renderiza su texto
  Para asegurar que el badge comunica el estado correcto

  Background:
    Given el usuario está en el demo de "ac-badge-basic"

  @smoke
  Scenario Outline: El badge <variante> muestra su texto

    Then el badge "<variante>" contiene el texto "<texto>"

    Examples:
      | variante | texto   |
      | neutral  | Neutral |
      | success  | Success |
      | warning  | Warning |
      | danger   | Danger  |
