@e2e @accessibility
Feature: ac-toast-basic - accesibilidad

  Como desarrollador del catálogo ac-lit
  Quiero que ac-toast-basic no introduzca violaciones WCAG
  Para mantener el componente accesible

  Background:
    Given el usuario está en el demo de "ac-toast-basic"

  @smoke
  Scenario: El demo de ac-toast-basic no tiene violaciones de accesibilidad
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El demo de ac-toast-basic no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    Then el demo no tiene violaciones de accesibilidad WCAG

  Scenario Outline: El toast <botón> visible no tiene violaciones de accesibilidad
    When el usuario pulsa el botón "<botón>"
    Then el toast "<toast>" está visible
    And el demo no tiene violaciones de accesibilidad WCAG

    Examples:
      | botón        | toast         |
      | show-neutral | toast-neutral |
      | show-success | toast-success |
      | show-warning | toast-warning |
      | show-danger  | toast-danger  |

  Scenario: El toast visible no tiene violaciones de accesibilidad en modo oscuro
    When el usuario activa el modo oscuro
    And el usuario pulsa el botón "show-danger"
    Then el toast "toast-danger" está visible
    And el demo no tiene violaciones de accesibilidad WCAG

  Scenario: El toast con acción, arriba y apilado no tiene violaciones de accesibilidad
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-action"
    And el usuario pulsa el botón "show-stack"
    Then el toast "toast-stack-2" está visible
    And el demo no tiene violaciones de accesibilidad WCAG
