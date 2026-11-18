/**
 * @typedef {Object} ChannelMessage
 * @property {string} id - Identificador único de este mensaje puntual.
 * @property {string} channel - Nombre lógico del canal por el que se publicó.
 * @property {string} source - Id del endpoint OUT que publicó el mensaje.
 * @property {*} payload - Contenido del mensaje, tal cual lo pasó quien publicó.
 * @property {number} timestamp - Instante de creación (`Date.now()`).
 * @property {Object} metadata - Información complementaria opcional.
 */

/**
 * Crea un ChannelMessage inmutable. El `payload` nunca se clona ni se muta --
 * se entrega por referencia, tal como lo documenta el contrato de CCP.
 * @param {Object} config
 * @param {string} config.channel
 * @param {string} config.source
 * @param {*} config.payload
 * @param {Object} [config.metadata]
 * @returns {ChannelMessage}
 */
export function createChannelMessage({ channel, source, payload, metadata = {} }) {
  return Object.freeze({
    id: crypto.randomUUID(),
    channel,
    source,
    payload,
    timestamp: Date.now(),
    metadata: Object.freeze({ ...metadata }),
  });
}
