@e2e
Feature: ac-amount-basic - contenido básico

  Como desarrollador del catálogo ac-lit
  Quiero verificar que ac-amount-basic renderiza su contenido
  Para asegurar que el componente funciona como se espera

  Background:
    Given el usuario está en el demo de "ac-amount-basic"

  @smoke
  Scenario: El componente muestra el monto por defecto formateado
    Then el componente contiene el texto "S/ 0.00"
