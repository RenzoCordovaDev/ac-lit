/**
 * Resuelve los endpoints IN compatibles con un nombre lógico de canal. La
 * coincidencia es exacta (sin wildcards): solo matchean endpoints `in` con el
 * mismo `name` exacto. Devuelve un snapshot (array nuevo, no una referencia a
 * la colección interna del Registry) para que una desuscripción disparada
 * durante la distribución de un mensaje no mute la lista que el Dispatcher
 * está iterando en ese momento.
 * @param {import('./channel-registry.js').ChannelRegistry} registry
 * @param {string} name - Nombre lógico del canal.
 * @returns {Array<import('./channel-registry.js').ChannelEndpoint>}
 */
export function resolveSubscribers(registry, name) {
  return registry.listByNameAndDirection(name, 'in');
}
