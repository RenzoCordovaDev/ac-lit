/**
 * ScopedElementsMixin - lazily registers each component's dependencies as global
 * custom elements, skipping registration if the tag is already defined.
 * Avoids "already defined" collisions when the same dependency is used by
 * multiple components loaded independently.
 */

const scopedElementsRegistry = new WeakMap();

export const ScopedElementsMixin = superClass =>
  class extends superClass {
    /**
     * Override in your component to declare which elements it depends on.
     * @returns {Object} A map of tagName -> element class
     */
    static get scopedElements() {
      return {};
    }

    constructor() {
      super();
      this._initializeScopedElements();
    }

    _initializeScopedElements() {
      const scopedElements = this.constructor.scopedElements;
      if (!scopedElements || Object.keys(scopedElements).length === 0) {
        return;
      }

      const registry = {};
      Object.entries(scopedElements).forEach(([tagName, ElementClass]) => {
        this.defineScopedElement(tagName, ElementClass);
        registry[tagName] = ElementClass;
      });

      scopedElementsRegistry.set(this, registry);
    }

    defineScopedElement(tagName, ElementClass) {
      if (!customElements.get(tagName)) {
        try {
          customElements.define(tagName, ElementClass);
        } catch (error) {
          console.warn(`Failed to define scoped element ${tagName}:`, error);
        }
      }
    }

    getScopedElement(tagName) {
      const registry = scopedElementsRegistry.get(this);
      return registry ? registry[tagName] : undefined;
    }

    /**
     * Helper to turn an array of component classes (each exposing a static
     * `is` tag name) into the `{ tagName: Class }` map `scopedElements` expects.
     */
    static scopedElementsFromClasses(classes) {
      const result = {};
      classes.forEach(ElementClass => {
        if (ElementClass.is) {
          result[ElementClass.is] = ElementClass;
        } else {
          console.warn('Element class must have a static "is" property:', ElementClass);
        }
      });
      return result;
    }
  };
