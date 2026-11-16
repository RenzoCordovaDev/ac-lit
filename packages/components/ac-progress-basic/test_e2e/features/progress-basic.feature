@e2e
Feature: ac-progress-basic - barra de progreso

  Como desarrollador del catálogo ac-lit
  Quiero que ac-progress-basic refleje su estado determinado/indeterminado
  Para asegurar que el relleno y la semántica ARIA son correctos

  Background:
    Given el usuario está en el demo de "ac-progress-basic"

  @smoke
  Scenario: El relleno refleja el valor conocido de un progreso determinado
    Then el progreso "progress-primary-50" tiene un relleno con ancho "50%"

  Scenario: Un progreso indeterminado no expone aria-valuenow
    When el usuario selecciona el caso "1"
    Then el progreso "progress-indeterminate" no tiene el atributo "aria-valuenow"
