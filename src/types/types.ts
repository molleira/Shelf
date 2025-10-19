export interface MarkdownItem {
  title: string;
  url: string;
  description?: string;
  category?: string;
}


export interface Marcador extends MarkdownItem {}
export interface Canal extends MarkdownItem {}

export interface Article {
  id: string;
  titol: string;
  arxiu: string;
}
