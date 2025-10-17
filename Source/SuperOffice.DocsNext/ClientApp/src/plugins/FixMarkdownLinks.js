import { visit } from 'unist-util-visit';

/**
 * Fix Markdown links and definitions that end with `.md` or `/index.md`
 */
export default function remarkFixMarkdownLinks() {
  return (tree) => {
    // Handle both inline links and reference definitions
    visit(tree, ['link', 'definition'], (node) => {
      if (!node.url || typeof node.url !== 'string') return;

      let url = node.url.trim();

      // Skip external and anchor links
      if (url.startsWith('http') || url.startsWith('#')) return;

      // Remove trailing /index.md
      url = url.replace(/\/index\.md(?=$|[?#])/i, '/');

      // Remove trailing .md
      url = url.replace(/\.md$/i, '');

      node.url = url;
    });
  };
}
