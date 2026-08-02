// Implementação de `window.storage` sobre o localStorage do browser.
//
// Usada quando não há credenciais do Supabase: a plataforma funciona, mas os
// dados ficam só neste computador e não são partilhados com a equipa.

export function instalarStorageLocal() {
  window.storage = {
    async get(chave) {
      return { value: window.localStorage.getItem(chave) };
    },
    async set(chave, valor) {
      window.localStorage.setItem(chave, valor);
      return true;
    },
  };
}
