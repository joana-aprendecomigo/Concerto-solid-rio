import React, { useEffect, useState, useRef } from "react";
import App from "./App.jsx";
import { supabaseConfigurado, verificarLigacao, diagnostico } from "./lib/supabase.js";
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
  const [aviso, setAviso] = useState(null);
  const pendente = useRef(false);

  // Confirma, no arranque, que a base de dados responde. Sem esta verificação
  // uma credencial errada passaria despercebida: a aplicação funcionaria em
  // modo local e a equipa veria listas vazias sem perceber a razão.
  useEffect(() => {
    let cancelado = false;
    (async () => {
      // As credenciais vêm de src/lib/credenciais.js, por isso existem sempre.
      // Este ramo só dispara se alguém as esvaziar por engano.
      if (!supabaseConfigurado || !diagnostico.urlValido || !diagnostico.chaveValida) {
        if (!cancelado) {
          setAviso(
            "Credenciais do Supabase em falta ou com formato inesperado " +
              `(url: ${diagnostico.urlAbreviado}, chave: ${diagnostico.chaveAbreviada}). ` +
              "Ver src/lib/credenciais.js."
          );
        }
        return;
      }
      const r = await verificarLigacao();
      if (!cancelado && !r.ok) {
        setAviso(
          "Não foi possível ligar à base de dados" +
            (r.detalhe ? ` (${r.detalhe})` : "") +
            ". As alterações podem não ficar guardadas."
        );
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  // Alguém alterou o mesmo contacto enquanto esta pessoa o editava. A gravação
  // não se perde (só se enviam os campos que cada um mexeu), mas convém avisar
  // para poder confirmar o resultado.
  useEffect(() => {
    const aoConflito = (e) => {
      const nomes = (e.detail || []).map((c) => `${c.nome} (também editado por ${c.outro})`);
      setAviso(
        `Atenção: ${nomes.join("; ")}. As tuas alterações foram guardadas, mas ` +
          "vale a pena confirmar a ficha."
      );
    };
    window.addEventListener("concerto:conflito", aoConflito);
    return () => window.removeEventListener("concerto:conflito", aoConflito);
  }, []);

  useEffect(() => {
    if (!supabaseConfigurado) return;

    // Recarregar substitui a aplicação inteira, o que apaga pesquisas, filtros
    // e posição na página. Só o fazemos quando a pessoa está mesmo parada.
    let ultimaAtividade = Date.now();
    const marcarAtividade = () => { ultimaAtividade = Date.now(); };
    ["mousedown", "keydown", "scroll", "touchstart"].forEach((ev) =>
      window.addEventListener(ev, marcarAtividade, { passive: true })
    );

    const ocupado = () => {
      const activo = document.activeElement;
      const emCampo =
        activo &&
        (activo.tagName === "INPUT" ||
          activo.tagName === "TEXTAREA" ||
          activo.tagName === "SELECT" ||
          activo.isContentEditable);
      const modalAberto = document.querySelector('[data-modal-aberto="true"]');
      // Mexeu em alguma coisa nos últimos segundos: provavelmente está a meio
      // de uma tarefa e não quer a página a saltar-lhe debaixo dos olhos.
      const acabouDeMexer = Date.now() - ultimaAtividade < 5000;
      return Boolean(emCampo || modalAberto || acabouDeMexer);
    };

    let timer = null;
    const tentarAtualizar = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (ocupado()) {
          pendente.current = true;
          tentarAtualizar(); // volta a tentar mais tarde
          return;
        }
        pendente.current = false;
        setVersao((v) => v + 1);
      }, 1500);
    };

    const cancelar = ouvirAlteracoes(() => tentarAtualizar());

    return () => {
      clearTimeout(timer);
      cancelar();
      ["mousedown", "keydown", "scroll", "touchstart"].forEach((ev) =>
        window.removeEventListener(ev, marcarAtividade)
      );
    };
  }, []);

  return (
    <>
      {aviso && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 300,
            background: "#FBF0DD",
            color: "#8A5A12",
            borderBottom: "1px solid #E8D5AE",
            padding: "8px 16px",
            fontSize: 12.5,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ flex: 1 }}>{aviso}</span>
          <button
            type="button"
            onClick={() => setAviso(null)}
            aria-label="Fechar aviso"
            style={{
              border: "none",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
      )}
      <App key={versao} />
    </>
  );
}
