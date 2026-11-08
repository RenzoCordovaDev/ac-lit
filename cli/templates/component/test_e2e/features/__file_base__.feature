@e2e
Feature: __tag__ - contenido básico

  Como desarrollador del catálogo ac-lit
  Quiero verificar que __tag__ renderiza su contenido
  Para asegurar que el componente funciona como se espera

  Background:
    Given el usuario está en el demo de "__tag__"

  @smoke
  Scenario: El componente muestra su contenido
    Then el componente contiene el texto "Hola"
