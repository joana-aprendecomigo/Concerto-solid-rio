import React, { useEffect, useState, useRef } from "react";
import App from "./App.jsx";
import { supabaseConfigurado } from "./lib/supabase.js";
import { ouvirAlteracoes } from "./lib/realtime.js";

/**
 * Envolve a aplicação para lhe dar sincronização instantânea.
 *
 * O componente principal lê tudo uma vez no arranque e guarda em estado local.
 * Como não tem forma de saber que alguém alterou dados noutro computador,
 * remontamo-lo (mudando a `key`) quando o Realtime avisa que houve alterações
 * — o efeito de arranque volta a correr e relê tudo já atualizado.
 *
 * Duas salvaguardas para isto não ser intrusivo:
 *  · Nunca remonta enquanto houver um formulário aberto — perder o que se está
 *    a escrever a meio seria pior do que ver dados com alguns segundos.
 *  · Espera por uma pausa na atividade do próprio utilizador.
 */
export default function AppComRealtime() {
  const [versao, setVersao] = useState(0);
  const pendente = useRef(false);

  useEffect(() => {
    if (!supabaseConfigurado) return;

    // Há edição em curso? (modal aberto ou campo com foco)
    const aEditar = () => {
      const activo = document.activeElement;
      const emCampo =
        activo &&
        (activo.tagName === "INPUT" ||
          activo.tagName === "TEXTAREA" ||
          activo.tagName === "SELECT" ||
          activo.isContentEditable);
      // Os modais da plataforma são overlays com position:fixed e z-index alto.
      const modalAberto = document.querySelector('[data-modal-aberto="true"]');
      return Boolean(emCampo || modalAberto);
    };

    let timer = null;
    const tentarAtualizar = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (aEditar()) {
          pendente.current = true;
          tentarAtualizar(); // volta a tentar mais tarde
          return;
        }
        pendente.current = false;
        setVersao((v) => v + 1);
      }, 1200);
    };

    const cancelar = ouvirAlteracoes(() => tentarAtualizar());

    return () => {
      clearTimeout(timer);
      cancelar();
    };
  }, []);

  return <App key={versao} />;
}
