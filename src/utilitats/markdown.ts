import type { MarkdownItem } from "../types";

export const parseMarkdownItems = (markdown: string): MarkdownItem[] => {
  const items: MarkdownItem[] = [];
  let currentCategory = "Other";

  markdown
    .split("\n")
    .map((line) => line.trim())
    .forEach((line) => {
      if (line.startsWith("#")) {
        currentCategory = line.replace(/^#+\s*/, "");
      } else if (line.startsWith("- [")) {
        const match = line.match(/\[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?/);
        if (match) {
          const [, title, url, description] = match;
          items.push({
            title: title.trim(),
            url: url.trim(),
            description: description?.trim() || "",
            category: currentCategory,
          });
        }
      }
    });

  return items;
};

export const groupItemsByCategory = <T extends MarkdownItem>(items: T[]) => {
  return items.reduce((acc, item) => {
    const category = item.category || "Other";
    acc[category] ??= [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};
