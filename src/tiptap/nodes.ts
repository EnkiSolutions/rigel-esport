import { Node, mergeAttributes } from '@tiptap/core';

export const Div = Node.create({
  name: 'div',
  defaultOptions: {
    HTMLAttributes: {},
  },
  content: 'block*',
  group: 'block',
  defining: true,
  parseHTML() {
    return [
      { tag: 'div' },
    ];
  },
  addAttributes() {
    return { class: { parseHTML: element => element.className } }
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

export default Div;