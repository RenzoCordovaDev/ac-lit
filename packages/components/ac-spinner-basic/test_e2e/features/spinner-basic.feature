@e2e
Feature: ac-spinner-basic - indicador de carga

  Como desarrollador del catálogo ac-lit
  Quiero que ac-spinner-basic anuncie su estado a lectores de pantalla
  Para comunicar un estado de carga indeterminado de forma accesible

  Background:
    Given el usuario está en el demo de "ac-spinner-basic"

  @smoke
  Scenario: El spinner se anuncia con role="status"
    Then el spinner "spinner-md" tiene role "status"

  Scenario: El spinner muestra la etiqueta traducida por defecto
    Then el spinner "spinner-md" tiene la etiqueta "Cargando…"

  Scenario: Una etiqueta personalizada también se traduce
    Then el spinner "spinner-custom-label" tiene la etiqueta "Guardando cambios…"
