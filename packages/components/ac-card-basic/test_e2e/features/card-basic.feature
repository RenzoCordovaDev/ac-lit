@e2e
Feature: ac-card-basic - contenedor de contenido

  Como desarrollador del catálogo ac-lit
  Quiero que ac-card-basic muestre su título y pie solo cuando corresponde
  Para usarlo como contenedor genérico de contenido

  Background:
    Given el usuario está en el demo de "ac-card-basic"

  @smoke
  Scenario: La variante surface se muestra con título y pie
    Then el contenedor "card-surface" muestra su título
    And el contenedor "card-surface" muestra su pie

  Scenario: La variante outlined se muestra sin título ni pie
    Then el contenedor "card-outlined" no muestra título
    And el contenedor "card-outlined" no muestra su pie
