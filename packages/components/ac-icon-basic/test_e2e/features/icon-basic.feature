@e2e
Feature: ac-icon-basic - set de íconos por nombre

  Como desarrollador del catálogo ac-lit
  Quiero que ac-icon-basic renderice el ícono correcto según su `name`
  Para mostrar el set de íconos propio del catálogo de forma consistente

  Background:
    Given el usuario está en el demo de "ac-icon-basic"

  @smoke
  Scenario: Un nombre válido renderiza su ícono correspondiente
    Then el ícono "icon-check" renderiza el path "M5 13l4 4L19 7"

  Scenario: Un nombre inválido cae al ícono de fallback
    Then el ícono "icon-fallback" cae al ícono de fallback
