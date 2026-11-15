@e2e
Feature: ac-profile-card-basic - composición de 4 componentes del catálogo

  Como desarrollador del catálogo ac-lit
  Quiero que ac-profile-card-basic combine ac-avatar-basic, ac-text-basic,
  ac-badge-basic y ac-button-basic como un único componente
  Para asegurar que la composición funciona de punta a punta

  Background:
    Given el usuario está en el demo de "ac-profile-card-basic"

  @smoke
  Scenario: La tarjeta muestra el nombre y el estado
    Then la tarjeta "profile-card-basic-default" muestra el nombre "Ana Torres"
    And la tarjeta "profile-card-basic-default" muestra el estado "Activo"

  Scenario: Una tarjeta sin estado ni acción no los renderiza
    Then la tarjeta "profile-card-basic-minimal" no muestra estado
    And la tarjeta "profile-card-basic-minimal" no muestra botón de acción

  Scenario: El botón de acción dispara su evento
    When el usuario pulsa el botón de acción de la tarjeta "profile-card-basic-default"
    Then el evento "ac-profile-card-basic-action-click" se registra en el log
