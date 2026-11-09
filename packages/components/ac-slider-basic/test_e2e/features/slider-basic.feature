@e2e
Feature: ac-slider-basic - control deslizante

  Como desarrollador del catálogo ac-lit
  Quiero que ac-slider-basic se comporte como un slider real
  Para asegurar valor, rango, paso, teclado y estados

  Background:
    Given el usuario está en el demo de "ac-slider-basic"

  @smoke
  Scenario: Llevar el slider al máximo dispara el evento de cambio
    When el usuario lleva el slider "slider-volume" al máximo
    Then el evento "ac-slider-basic-change" con valor numérico 100 se registra en el log

  Scenario: Llevar el slider al mínimo actualiza su valor
    When el usuario lleva el slider "slider-volume" al mínimo
    Then el slider "slider-volume" tiene el valor 0

  Scenario: El valor mostrado sigue al control con su sufijo
    When el usuario lleva el slider "slider-volume" al máximo
    Then el slider "slider-volume" muestra el texto "100%"

  Scenario: El slider respeta el paso configurado
    When el usuario avanza el slider "slider-temperature" un paso desde el mínimo
    Then el slider "slider-temperature" tiene el valor 18

  Scenario: Un slider con rango propio llega a su máximo
    When el usuario lleva el slider "slider-temperature" al máximo
    Then el slider "slider-temperature" tiene el valor 30

  Scenario: Un slider deshabilitado no se puede usar
    When el usuario selecciona el caso "1"
    Then el slider "slider-disabled" está deshabilitado
