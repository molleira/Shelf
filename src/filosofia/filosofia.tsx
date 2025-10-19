import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import type { Article } from "../types/types";
import "./filosofia.css";

export const Filosofia = () => {
  const [articles, establirArticles] = useState<Article[]>([]);
  const [articleSeleccionat, establirArticleSeleccionat] = useState<string | null>(null);
  const [contingutArticle, establirContingutArticle] = useState<string>("");

  useEffect(() => {
    const articlesData: Article[] = [
      { id: "artpiece", titol: "Martin Heidegger - L'Origen de l'Obra d'Art", arxiu: "artpiece.md" },
      { id: "causal", titol: "La concepció causal clàssica del coneixement", arxiu: "causal.md" },
      { id: "examencomentari", titol: "Examen i Comentari", arxiu: "examencomentari.md" },
      { id: "examencomentaridos", titol: "Comentari Filosòfic (II)", arxiu: "examencomentaridos.md" },
      { id: "executiu", titol: "El Poder Executiu", arxiu: "executiu.md" },
      { id: "inflation", titol: "Alan Guth - La inflación de Guth", arxiu: "inflation.md" },
      { id: "jwar", titol: "Gino Bianchetti - Validez de la Guerra Justa en la Actualidad", arxiu: "jwar.md" },
      { id: "judge", titol: "Comentari de textos filosòfics - Crítica de la facultat de jutjar", arxiu: "judge.md" },
      { id: "knowledge", titol: "Teoria del Coneixement", arxiu: "knowledge.md" },
      { id: "mansfield", titol: "Harvey C. Mansfield - The Case for the Strong Executive", arxiu: "mansfield.md" },
      { id: "nations", titol: "Nacions i Nacionalisme", arxiu: "nations.md" },
      { id: "schiller", titol: "Schiller - Nostàlgia de Grècia en la filosofia alemanya del segle XIX", arxiu: "schiller.md" },
      { id: "techniques", titol: "Tècniques", arxiu: "techniques.md" },
      { id: "tragedy", titol: "Friedrich Nietzsche - El Naixement de la Tragèdia", arxiu: "tragedy.md" },
      { id: "war", titol: "Marc Oller - La Guerra Justa", arxiu: "war.md" }
    ];
    establirArticles(articlesData);
  }, []);

  const gestionarClicArticle = async (article: string) => {
    const resposta = await fetch(`./articles/${article}`);
    const contingut = await resposta.text();
    establirContingutArticle(contingut);
    establirArticleSeleccionat(article);
  };

  const gestionarClicTornar = () => {
    establirArticleSeleccionat(null);
    establirContingutArticle("");
  };

  if (articleSeleccionat) {
    return (
      <>
        <button onClick={gestionarClicTornar} style={{ marginBottom: '1rem' }}>
          ← Tornar a la llista
        </button>
        <div className="article-detall">
          <ReactMarkdown>{contingutArticle}</ReactMarkdown>
        </div>
      </>
    );
  }

  return (
    <div className="articles-grid">
      {articles.map((article) => (
        <button
          key={article.id}
          onClick={() => gestionarClicArticle(article.arxiu)}
          className="article-item"
        >
          <h4 className="article-title">{article.titol}</h4>
        </button>
      ))}
    </div>
  );
};
