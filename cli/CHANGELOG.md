# @ac-base/cli

## 0.1.1

### Patch Changes

- 9006810: `ac component:create` ya no genera dependencias `"workspace:^"` rotas cuando corre fuera del workspace de `ac-lit` — detecta el contexto y usa la versión real publicada de cada paquete `@ac-base/*` en ese caso.
