@e2e
Feature: ac-demo-content - contenedor de demos

  Como desarrollador del catálogo ac-lit
  Quiero que ac-demo-content centralice casos, idioma, ambient, tema, tamaño
  de dispositivo, vista visual/código y eventos
  Para no reimplementar esto en cada demo de componente

  Background:
    Given el usuario está en el demo de "ac-demo-content"

  @smoke
  Scenario: El primer caso está activo por defecto
    Then el elemento "case-basic-button" es visible

  Scenario: Cambiar de caso carga el contenido del nuevo caso
    When el usuario selecciona el caso "1"
    Then el elemento "case-states-disabled" es visible

  Scenario: Un caso con encabezado largo se puede seleccionar
    When el usuario selecciona el caso "2"
    Then el elemento "case-long-name-secondary" es visible

  Scenario: El selector de casos ocupa su propia fila
    When el usuario selecciona el caso "2"
    Then el selector de casos está en una fila separada de los demás controles

  Scenario: El dispositivo por defecto es móvil
    Then el marco de dispositivo es "mobile"

  Scenario: Cambiar el dispositivo ajusta el marco del viewport
    When el usuario selecciona el dispositivo "desktop"
    Then el marco de dispositivo es "desktop"

  Scenario: El switch de idioma cambia el locale activo
    When el usuario selecciona el idioma "1"
    Then el idioma activo es "1"

  Scenario: El switch de tema cambia a modo oscuro
    When el usuario selecciona el tema "dark"
    Then el documento queda en data-theme "dark"

  Scenario: Cambiar a la vista de código muestra el HTML del caso activo
    When el usuario selecciona la vista "code"
    Then la vista de código contiene "ac-demo-sample-button"

  Scenario: La vista de código numera las líneas desde 1
    When el usuario selecciona la vista "code"
    Then la primera línea de la vista de código tiene el número "1"

  Scenario Outline: Hacer click en un método de instalación copia el comando
    When el usuario hace click en el método de instalación "<gestor>"
    Then el método de instalación "<gestor>" queda marcado como copiado
    And el portapapeles contiene "<comando>"

    Examples:
      | gestor | comando                                 |
      | pnpm   | pnpm add @ac-base/ac-demo-content       |
      | npm    | npm i @ac-base/ac-demo-content          |

  Scenario: Un evento escuchado se puede ver en el panel lateral de eventos
    When el usuario hace click en el elemento "case-basic-button"
    And el usuario abre el panel de eventos
    Then el evento "ac-demo-sample-click" aparece en el panel de eventos con su etiqueta
