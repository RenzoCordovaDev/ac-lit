@e2e
Feature: ac-registro-wizard - flujo completo

  Como desarrollador del catálogo ac-lit
  Quiero que ac-registro-wizard avance por sus 3 pasos y registre un usuario
  Para asegurar que el wizard de referencia funciona de punta a punta

  Background:
    Given el usuario está en el demo de "ac-registro-wizard"

  @smoke
  Scenario: Completar el wizard de registro muestra el modal con los datos reales
    When el usuario completa el paso 1 con nombre "Juan Pérez" y correo "juan@test.com"
    And el usuario avanza al paso 2
    And el usuario acepta los términos y avanza al paso 3
    And el usuario confirma el registro
    Then el modal de registro exitoso se muestra
    And el usuario registrado es "Juan Pérez"

  Scenario: La página no tiene scroll horizontal durante el flujo
    When el usuario completa el paso 1 con nombre "Juan Pérez" y correo "juan@test.com"
    And el usuario avanza al paso 2
    Then la página no tiene scroll horizontal
