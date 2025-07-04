import { visit } from 'unist-util-visit';


const DIRECTIVES = {
  NOTE: {
    className: 'note-block',
    label: 'Note',
    icon: '🛈',
  },
  TIP: {
    className: 'tip-block',
    label: 'Tip',
    icon: '🛈',
  },
  CAUTION: {
    className: 'caution-block',
    label: 'Caution',
    icon: '⚠️',
  },
  WARNING: {
    className: 'warning-block',
    label: 'Warning',
    icon: '⚠️',
  }
};

/** @type {import('unified').Plugin} */
export default function remarkRestyleDirective() {
  return function transformer(tree) {
    visit(tree, 'blockquote', (node) => {
      const para = node.children?.[0];
      const textNode = para?.children?.[0];

      if (!textNode || textNode.type !== 'text') return;

      const match = textNode.value.match(/^\[!(\w+)]/);
      if (!match) return;

      const directiveKey = match[1].toUpperCase();
      const directive = DIRECTIVES[directiveKey];
      if (!directive) return; 

      textNode.value = textNode.value.replace(`[!${directiveKey}]`, '').trim();

      node.type = 'parent';
      node.data = {
        hName: 'div',
        hProperties: { className: directive.className },
      };

      node.children = [
        {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: { className: 'directive-header' },
          },
          children: [
            {
              type: 'text',
              value: `${directive.icon} `,
            },
            {
              type: 'strong',
              data: {
                hName: 'span',
                hProperties: { className: 'directive-label' },
              },
              children: [{ type: 'text', value: directive.label }],
            },
          ],
        },
        {
          type: 'paragraph',
          data: {
            hName: 'div',
            hProperties: { className: 'directive-content' },
          },
          children: para.children,
        },
      ];
    });
  };
}
