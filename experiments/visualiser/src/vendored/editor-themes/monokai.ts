import { EditorThemeDefinition } from '../types';

const theme: EditorThemeDefinition = {
  base: 'vs-dark',
  inherit: true,
  name: 'Monokai',
  rules: [
    {
      foreground: 'ababab',
      token: 'comment',
    },
    {
      foreground: '19d1e5',
      token: 'storage.type.class.jsdoc',
    },
    {
      foreground: 'ffffff',
      token: 'variable.other.jsdoc',
    },
    {
      foreground: 'ff3f4f',
      token: 'keyword.operator',
    },
    {
      foreground: 'ff3f4f',
      token: 'storage.modifier',
    },
    {
      foreground: '19d1e5',
      token: 'storage.type',
    },
    {
      foreground: '81f900',
      token: 'entity.name.function',
    },
    {
      foreground: '81f900',
      token: 'meta.function-call.generic',
    },
    {
      foreground: '45a1ed',
      token: 'entity.name.type',
    },
    {
      foreground: '81f900',
      token: 'entity.other.inherited-class',
    },
    {
      foreground: 'ff3f4f',
      token: 'entity.name.tag',
    },
    {
      foreground: 'ff3f4f',
      token: 'entity.name.section',
    },
    {
      foreground: '81f900',
      token: 'entity.other.attribute-name',
    },
    {
      foreground: 'ff3f4f',
      token: 'variable.language',
    },
    {
      foreground: '19d1e5',
      token: 'constant.language',
    },
    {
      foreground: 'ff9700',
      token: 'variable.parameter',
    },
    {
      foreground: 'ffd945',
      token: 'string',
    },
    {
      foreground: 'ff4dff',
      token: 'constant.numeric',
    },
    {
      foreground: 'ff4dff',
      token: 'constant.language.boolean',
    },
    {
      foreground: 'ff4dff',
      token: 'constant.language.json',
    },
    {
      foreground: 'ffffff',
      token: 'variable.other.property',
    },
    {
      foreground: '45a1ed',
      token: 'variable.other.object',
    },
    {
      foreground: 'ff3f4f',
      token: 'punctuation.definition.template-expression.begin',
    },
    {
      foreground: 'ff3f4f',
      token: 'punctuation.definition.template-expression.end',
    },
    {
      foreground: 'ff3f4f',
      token: 'punctuation.definition.interpolation.begin.bracket.curly',
    },
    {
      foreground: 'ff3f4f',
      token: 'punctuation.definition.interpolation.end.bracket.curly',
    },
    {
      foreground: 'ffffff',
      token: 'punctuation.accessor',
    },
    {
      foreground: 'ffffff',
      token: 'punctuation.definition.entity',
    },
    {
      foreground: 'ff3f4f',
      token: 'punctuation.separator.key-value',
    },
    {
      foreground: 'ffffff',
      token: 'punctuation.separator.key-value.mapping',
    },
    {
      foreground: 'ababab',
      token: 'punctuation.definition.heading',
    },
    {
      foreground: 'ff3f4f',
      token: 'keyword',
    },
    {
      foreground: '19d1e5',
      token: 'keyword.type',
    },
    {
      foreground: '19d1e5',
      token: 'support',
    },
    {
      foreground: '81f900',
      token: 'support.function',
    },
    {
      foreground: '45a1ed',
      token: 'support.class',
    },
    {
      foreground: 'ff3f4f',
      token: 'support.class.component',
    },
    {
      foreground: '45a1ed',
      token: 'support.class.builtin',
    },
    {
      foreground: '19d1e5',
      token: 'markup.underline',
    },
  ],
  colors: {
    'editor.foreground': '#f8f8f0',
    'editor.background': '#16171D',
    'editor.selectionBackground': '#3E4451',
    'editor.lineHighlightBackground': '#1F2328',
    'editorCursor.foreground': '#f8f8f0',
    'editorWhitespace.foreground': '#484a50',
  },
};

export default theme;
