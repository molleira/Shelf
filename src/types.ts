export interface MarkdownItem {
  title: string;
  url: string;
  description?: string;
  category?: string;
}


export interface Bookmark extends MarkdownItem {}
export interface Feed extends MarkdownItem {}
