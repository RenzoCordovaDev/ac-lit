@e2e
Feature: ac-notification-basic - feed de notificaciones

  Como desarrollador del catálogo ac-lit
  Quiero que ac-notification-basic muestre su mensaje e ícono según el ambient
  Y que su botón de cerrar dispare un evento sin removerse a sí mismo
  Para usarlo como ítem de una lista de notificaciones que decide la app

  Background:
    Given el usuario está en el demo de "ac-notification-basic"

  @smoke
  Scenario Outline: La notificación <ambient> muestra su mensaje
    Then la notificación "<testId>" está visible

    Examples:
      | testId                  | ambient |
      | notification-neutral    | neutral |
      | notification-success    | success |
      | notification-warning    | warning |
      | notification-danger     | danger  |

  Scenario: El botón de cerrar dispara el evento de la notificación
    When el usuario pulsa el botón de cerrar de la notificación "notification-warning"
    Then el evento "ac-notification-basic-dismiss-click" se registra en el log

  Scenario: Esta demo saca del DOM la notificación cuando se la cierra
    When el usuario pulsa el botón de cerrar de la notificación "notification-warning"
    Then la notificación "notification-warning" ya no existe en el DOM
