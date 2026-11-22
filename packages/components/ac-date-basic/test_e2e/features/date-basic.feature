@e2e
Feature: ac-date-basic - fecha corta

  Como desarrollador del catálogo ac-lit
  Quiero verificar que ac-date-basic formatea una fecha corta con Intl.DateTimeFormat
  Para asegurar que el componente funciona como se espera

  Background:
    Given el usuario está en el demo de "ac-date-basic"

  @smoke
  Scenario: El componente muestra la fecha corta en el idioma por defecto (es-PE)
    Then el componente contiene el texto "22/11/26"
