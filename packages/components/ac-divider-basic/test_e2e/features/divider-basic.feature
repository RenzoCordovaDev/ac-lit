@e2e
Feature: ac-divider-basic - layout según contenido del label

  Como desarrollador del catálogo ac-lit
  Quiero que ac-divider-basic adapte su layout según si el slot tiene contenido
  Para asegurar que el label centrado solo aparece cuando corresponde

  Background:
    Given el usuario está en el demo de "ac-divider-basic"

  @smoke
  Scenario: Un divisor sin contenido en el slot no muestra el label
    Then el divisor "sin-label" no muestra el label

  Scenario: Un divisor con contenido en el slot muestra el label
    Then el divisor "con-label" muestra el label
