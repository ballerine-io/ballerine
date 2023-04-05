import { EditorThemeDefinition } from '../types';

const theme: EditorThemeDefinition = {
  base: 'vs-dark',
  inherit: true,
  name: 'Martian Night',
  rules: [
    {
      foreground: '9faeca',
      token: 'punctuation.definition.delayed.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.list.begin.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.list.end.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.ability.begin.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.ability.end.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.operator.assignment.as.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.separator.pipe.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.separator.delimiter.unison',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.hash.unison',
    },
    {
      foreground: 'cc6be9',
      token: 'variable.other.generic-type.haskell',
    },
    {
      foreground: 'e09956',
      token: 'storage.type.haskell',
    },
    {
      foreground: '9faeca',
      token: 'support.variable.magic.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.period.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.element.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.parenthesis.begin.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.parenthesis.end.python',
    },
    {
      foreground: 'e5c07b',
      token: 'variable.parameter.function.language.special.self.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'storage.modifier.lifetime.rust',
    },
    {
      foreground: '61afef',
      token: 'support.function.std.rust',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.lifetime.rust',
    },
    {
      foreground: '9faeca',
      token: 'variable.language.rust',
    },
    {
      foreground: 'cc6be9',
      token: 'support.constant.edge',
    },
    {
      foreground: '9faeca',
      token: 'constant.other.character-class.regexp',
    },
    {
      foreground: 'e09956',
      token: 'keyword.operator.quantifier.regexp',
    },
    {
      foreground: '98c379',
      token: 'punctuation.definition.string.begin',
    },
    {
      foreground: '98c379',
      token: 'punctuation.definition.string.end',
    },
    {
      foreground: 'd4d4d4',
      token: 'variable.parameter.function',
    },
    {
      foreground: '7f848e',
      token: 'comment markup.link',
    },
    {
      foreground: 'e5c07b',
      token: 'markup.changed.diff',
    },
    {
      foreground: '61afef',
      token: 'meta.diff.header.from-file',
    },
    {
      foreground: '61afef',
      token: 'meta.diff.header.to-file',
    },
    {
      foreground: '61afef',
      token: 'punctuation.definition.from-file.diff',
    },
    {
      foreground: '61afef',
      token: 'punctuation.definition.to-file.diff',
    },
    {
      foreground: '98c379',
      token: 'markup.inserted.diff',
    },
    {
      foreground: '9faeca',
      token: 'markup.deleted.diff',
    },
    {
      foreground: '9faeca',
      token: 'meta.function.c',
    },
    {
      foreground: '9faeca',
      token: 'meta.function.cpp',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.block.begin.bracket.curly.cpp',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.block.end.bracket.curly.cpp',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.terminator.statement.c',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.block.begin.bracket.curly.c',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.block.end.bracket.curly.c',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.parens.begin.bracket.round.c',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.parens.end.bracket.round.c',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.parameters.begin.bracket.round.c',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.parameters.end.bracket.round.c',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.key-value',
    },
    {
      foreground: '61afef',
      token: 'keyword.operator.expression.import',
    },
    {
      foreground: 'e5c07b',
      token: 'support.constant.math',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.property.math',
    },
    {
      foreground: 'e5c07b',
      token: 'variable.other.constant',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.annotation.java',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.object.array.java',
    },
    {
      foreground: '9faeca',
      token: 'source.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.block.begin.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.block.end.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.method-parameters.begin.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.method-parameters.end.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'meta.method.identifier.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.method.begin.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.method.end.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.terminator.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.class.begin.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.class.end.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.inner-class.begin.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.inner-class.end.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'meta.method-call.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.class.begin.bracket.curly.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.class.end.bracket.curly.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.method.begin.bracket.curly.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.method.end.bracket.curly.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.period.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.bracket.angle.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.annotation.java',
    },
    {
      foreground: 'd4d4d4',
      token: 'meta.method.body.java',
    },
    {
      foreground: '61afef',
      token: 'meta.method.java',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.modifier.import.java',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.java',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.generic.java',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.instanceof.java',
    },
    {
      foreground: '9faeca',
      token: 'meta.definition.variable.name.java',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.logical',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.bitwise',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.channel',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.property-value.scss',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.property-value.css',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.css',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.scss',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.less',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.color.w3c-standard-color-name.css',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.color.w3c-standard-color-name.scss',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.list.comma.css',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.color.w3c-standard-color-name.css',
    },
    {
      foreground: '56b6c2',
      token: 'support.type.vendored.property-name.css',
    },
    {
      foreground: 'e5c07b',
      token: 'support.module.node',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.object.module',
    },
    {
      foreground: 'e5c07b',
      token: 'support.module.node',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.type.module',
    },
    {
      foreground: 'ffffff',
      token: 'variable.other.readwrite',
    },
    {
      foreground: 'ffffff',
      token: 'meta.object-literal.key',
    },
    {
      foreground: 'ffffff',
      token: 'support.variable.property',
    },
    {
      foreground: 'ffffff',
      token: 'support.variable.object.process',
    },
    {
      foreground: 'ffffff',
      token: 'support.variable.object.node',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.json',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.instanceof',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.new',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.ternary',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.optional',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.keyof',
    },
    {
      foreground: '9faeca',
      token: 'support.type.object.console',
    },
    {
      foreground: 'e09956',
      token: 'support.variable.property.process',
    },
    {
      foreground: '61afef',
      token: 'entity.name.function',
    },
    {
      foreground: '61afef',
      token: 'support.function.console',
    },
    {
      foreground: 'd4d4d4',
      token: 'keyword.operator.misc.rust',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.sigil.rust',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.delete',
    },
    {
      foreground: '56b6c2',
      token: 'support.type.object.dom',
    },
    {
      foreground: '9faeca',
      token: 'support.variable.dom',
    },
    {
      foreground: '9faeca',
      token: 'support.variable.property.dom',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.arithmetic',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.comparison',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.decrement',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.increment',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.relational',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.assignment.c',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.comparison.c',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.c',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.increment.c',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.decrement.c',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.bitwise.shift.c',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.assignment.cpp',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.comparison.cpp',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.cpp',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.increment.cpp',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.decrement.cpp',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.bitwise.shift.cpp',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.delimiter',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.separator.c',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.separator.cpp',
    },
    {
      foreground: '56b6c2',
      token: 'support.type.posix-reserved.c',
    },
    {
      foreground: '56b6c2',
      token: 'support.type.posix-reserved.cpp',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.sizeof.c',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.sizeof.cpp',
    },
    {
      foreground: 'e09956',
      token: 'variable.parameter.function.language.python',
    },
    {
      foreground: '56b6c2',
      token: 'support.type.python',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.logical.python',
    },
    {
      foreground: 'e09956',
      token: 'variable.parameter.function.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.arguments.begin.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.arguments.end.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.arguments.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.list.begin.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.list.end.python',
    },
    {
      foreground: '61afef',
      token: 'meta.function-call.generic.python',
    },
    {
      foreground: 'e09956',
      token: 'constant.character.format.placeholder.other.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'keyword.operator',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.assignment.compound',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.assignment.compound.js',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.assignment.compound.ts',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.namespace',
    },
    {
      foreground: 'd3d9e6',
      token: 'variable',
    },
    {
      foreground: 'd4d4d4',
      token: 'variable.c',
    },
    {
      foreground: 'e5c07b',
      token: 'variable.language',
    },
    {
      foreground: 'd4d4d4',
      token: 'token.variable.parameter.java',
    },
    {
      foreground: 'e5c07b',
      token: 'import.storage.java',
    },
    {
      foreground: 'cc6be9',
      token: 'token.package.keyword',
    },
    {
      foreground: 'd4d4d4',
      token: 'token.package',
    },
    {
      foreground: '61afef',
      token: 'entity.name.function',
    },
    {
      foreground: '61afef',
      token: 'meta.require',
    },
    {
      foreground: '61afef',
      token: 'support.function.any-method',
    },
    {
      foreground: '61afef',
      token: 'variable.function',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.type.namespace',
    },
    {
      foreground: 'e5c07b',
      token: 'support.class',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.type.class',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.class.identifier.namespace.type',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.class',
    },
    {
      foreground: 'e5c07b',
      token: 'variable.other.class.js',
    },
    {
      foreground: 'e5c07b',
      token: 'variable.other.class.ts',
    },
    {
      foreground: '9faeca',
      token: 'variable.other.class.php',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.type',
    },
    {
      foreground: 'fa909e',
      token: 'keyword.control',
    },
    {
      foreground: 'e09956',
      token: 'control.elements',
    },
    {
      foreground: 'e09956',
      token: 'keyword.operator.less',
    },
    {
      foreground: '61afef',
      token: 'keyword.other.special-method',
    },
    {
      foreground: 'cc6be9',
      token: 'storage',
    },
    {
      foreground: 'cc6be9',
      token: 'token.storage',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.delete',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.in',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.of',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.instanceof',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.new',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.typeof',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.expression.void',
    },
    {
      foreground: 'e5c07b',
      token: 'token.storage.type.java',
    },
    {
      foreground: '56b6c2',
      token: 'support.function',
    },
    {
      foreground: 'd4d4d4',
      token: 'support.type.property-name',
    },
    {
      foreground: 'd4d4d4',
      token: 'support.constant.property-value',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.font-name',
    },
    {
      foreground: 'd4d4d4',
      token: 'meta.tag',
    },
    {
      foreground: 'a5ff90',
      token: 'string',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.other.inherited-class',
    },
    {
      foreground: '56b6c2',
      token: 'constant.other.symbol',
    },
    {
      foreground: 'e09956',
      token: 'constant.numeric',
    },
    {
      foreground: 'e09956',
      token: 'constant',
    },
    {
      foreground: 'e09956',
      token: 'punctuation.definition.constant',
    },
    {
      foreground: 'ff6196',
      token: 'entity.name.tag',
    },
    {
      foreground: 'e09956',
      token: 'entity.other.attribute-name',
    },
    {
      foreground: '92faba',
      token: 'entity.other.attribute-name.id',
    },
    {
      foreground: 'fdfb88',
      token: 'entity.other.attribute-name.class.css',
    },
    {
      foreground: 'cc6be9',
      token: 'meta.selector',
    },
    {
      foreground: '9faeca',
      token: 'markup.heading',
    },
    {
      foreground: '61afef',
      token: 'markup.heading punctuation.definition.heading',
    },
    {
      foreground: '61afef',
      token: 'entity.name.section',
    },
    {
      foreground: '9faeca',
      token: 'keyword.other.unit',
    },
    {
      foreground: 'e09956',
      token: 'markup.bold',
    },
    {
      foreground: 'e09956',
      token: 'todo.bold',
    },
    {
      foreground: 'e5c07b',
      token: 'punctuation.definition.bold',
    },
    {
      foreground: 'cc6be9',
      token: 'markup.italic',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.definition.italic',
    },
    {
      foreground: 'cc6be9',
      token: 'todo.emphasis',
    },
    {
      foreground: 'cc6be9',
      token: 'emphasis md',
    },
    {
      foreground: '9faeca',
      token: 'entity.name.section.markdown',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.heading.markdown',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.list.begin.markdown',
    },
    {
      foreground: 'd4d4d4',
      token: 'markup.heading.setext',
    },
    {
      foreground: 'e09956',
      token: 'punctuation.definition.bold.markdown',
    },
    {
      foreground: '98c379',
      token: 'markup.inline.raw.markdown',
    },
    {
      foreground: '98c379',
      token: 'markup.inline.raw.string.markdown',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.list.markdown',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.string.begin.markdown',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.string.end.markdown',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.metadata.markdown',
    },
    {
      foreground: '9faeca',
      token: 'beginning.punctuation.definition.list.markdown',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.definition.metadata.markdown',
    },
    {
      foreground: 'cc6be9',
      token: 'markup.underline.link.markdown',
    },
    {
      foreground: 'cc6be9',
      token: 'markup.underline.link.image.markdown',
    },
    {
      foreground: '61afef',
      token: 'string.other.link.title.markdown',
    },
    {
      foreground: '61afef',
      token: 'string.other.link.description.markdown',
    },
    {
      foreground: '56b6c2',
      token: 'string.regexp',
    },
    {
      foreground: '56b6c2',
      token: 'constant.character.escape',
    },
    {
      foreground: '9faeca',
      token: 'punctuation.section.embedded',
    },
    {
      foreground: '9faeca',
      token: 'variable.interpolation',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.section.embedded.begin',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.section.embedded.end',
    },
    {
      foreground: 'ffffff',
      token: 'invalid.illegal',
    },
    {
      foreground: 'd4d4d4',
      token: 'invalid.illegal.bad-ampersand.html',
    },
    {
      foreground: 'ffffff',
      token: 'invalid.broken',
    },
    {
      foreground: 'ffffff',
      token: 'invalid.deprecated',
    },
    {
      foreground: 'ffffff',
      token: 'invalid.unimplemented',
    },
    {
      foreground: '9faeca',
      token: 'source.json meta.structure.dictionary.json > string.quoted.json',
    },
    {
      foreground: '9faeca',
      token:
        'source.json meta.structure.dictionary.json > string.quoted.json > punctuation.string',
    },
    {
      foreground: '98c379',
      token:
        'source.json meta.structure.dictionary.json > value.json > string.quoted.json',
    },
    {
      foreground: '98c379',
      token:
        'source.json meta.structure.array.json > value.json > string.quoted.json',
    },
    {
      foreground: '98c379',
      token:
        'source.json meta.structure.dictionary.json > value.json > string.quoted.json > punctuation',
    },
    {
      foreground: '98c379',
      token:
        'source.json meta.structure.array.json > value.json > string.quoted.json > punctuation',
    },
    {
      foreground: '56b6c2',
      token:
        'source.json meta.structure.dictionary.json > constant.language.json',
    },
    {
      foreground: '56b6c2',
      token: 'source.json meta.structure.array.json > constant.language.json',
    },
    {
      foreground: '9faeca',
      token: 'support.type.property-name.json',
    },
    {
      foreground: '9faeca',
      token: 'support.type.property-name.json punctuation',
    },
    {
      foreground: 'cc6be9',
      token:
        'text.html.laravel-blade source.php.embedded.line.html entity.name.tag.laravel-blade',
    },
    {
      foreground: 'cc6be9',
      token:
        'text.html.laravel-blade source.php.embedded.line.html support.constant.laravel-blade',
    },
    {
      foreground: 'e5c07b',
      token: 'support.other.namespace.use.php',
    },
    {
      foreground: 'e5c07b',
      token: 'support.other.namespace.use-as.php',
    },
    {
      foreground: 'e5c07b',
      token: 'support.other.namespace.php',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.other.alias.php',
    },
    {
      foreground: 'e5c07b',
      token: 'meta.interface.php',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.error-control.php',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.type.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.array.begin.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.array.end.php',
    },
    {
      foreground: 'f44747',
      token: 'invalid.illegal.non-null-typehinted.php',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.php',
    },
    {
      foreground: 'e5c07b',
      token: 'meta.other.type.phpdoc.php',
    },
    {
      foreground: 'e5c07b',
      token: 'keyword.other.type.php',
    },
    {
      foreground: 'e5c07b',
      token: 'keyword.other.array.phpdoc.php',
    },
    {
      foreground: '61afef',
      token: 'meta.function-call.php',
    },
    {
      foreground: '61afef',
      token: 'meta.function-call.object.php',
    },
    {
      foreground: '61afef',
      token: 'meta.function-call.static.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.parameters.begin.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.parameters.end.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.separator.delimiter.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.scope.begin.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.section.scope.end.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.terminator.expression.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.arguments.begin.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.arguments.end.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.storage-type.begin.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.storage-type.end.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.array.begin.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.array.end.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.begin.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.end.bracket.round.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.begin.bracket.curly.php',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.end.bracket.curly.php',
    },
    {
      foreground: 'd4d4d4',
      token:
        'punctuation.definition.section.switch-block.end.bracket.curly.php',
    },
    {
      foreground: 'd4d4d4',
      token:
        'punctuation.definition.section.switch-block.start.bracket.curly.php',
    },
    {
      foreground: 'd4d4d4',
      token:
        'punctuation.definition.section.switch-block.begin.bracket.curly.php',
    },
    {
      foreground: 'd4d4d4',
      token:
        'punctuation.definition.section.switch-block.end.bracket.curly.php',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.core.rust',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.ext.php',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.std.php',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.core.php',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.parser-token.php',
    },
    {
      foreground: '61afef',
      token: 'entity.name.goto-label.php',
    },
    {
      foreground: '61afef',
      token: 'support.other.php',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.logical.php',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.bitwise.php',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.arithmetic.php',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.regexp.php',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.comparison.php',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.heredoc.php',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.nowdoc.php',
    },
    {
      foreground: '61afef',
      token: 'meta.function.decorator.python',
    },
    {
      foreground: '56b6c2',
      token: 'support.token.decorator.python',
    },
    {
      foreground: '56b6c2',
      token: 'meta.function.decorator.identifier.python',
    },
    {
      foreground: 'd4d4d4',
      token: 'function.parameter',
    },
    {
      foreground: 'd4d4d4',
      token: 'function.brace',
    },
    {
      foreground: 'd4d4d4',
      token: 'function.parameter.ruby',
    },
    {
      foreground: 'd4d4d4',
      token: 'function.parameter.cs',
    },
    {
      foreground: '56b6c2',
      token: 'constant.language.symbol.ruby',
    },
    {
      foreground: '56b6c2',
      token: 'rgb-value',
    },
    {
      foreground: 'e09956',
      token: 'inline-color-decoration rgb-value',
    },
    {
      foreground: 'e09956',
      token: 'less rgb-value',
    },
    {
      foreground: '9faeca',
      token: 'selector.sass',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.primitive.ts',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.builtin.ts',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.primitive.tsx',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.builtin.tsx',
    },
    {
      foreground: 'd4d4d4',
      token: 'block.scope.end',
    },
    {
      foreground: 'd4d4d4',
      token: 'block.scope.begin',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.cs',
    },
    {
      foreground: '9faeca',
      token: 'entity.name.variable.local.cs',
    },
    {
      foreground: '61afef',
      token: 'token.info-token',
    },
    {
      foreground: 'e09956',
      token: 'token.warn-token',
    },
    {
      foreground: 'f44747',
      token: 'token.error-token',
    },
    {
      foreground: 'cc6be9',
      token: 'token.debug-token',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.definition.template-expression.begin',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.definition.template-expression.end',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.section.embedded',
    },
    {
      foreground: 'd4d4d4',
      token: 'meta.template.expression',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.module',
    },
    {
      foreground: '61afef',
      token: 'support.type.type.flowtype',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.primitive',
    },
    {
      foreground: '9faeca',
      token: 'meta.property.object',
    },
    {
      foreground: '9faeca',
      token: 'variable.parameter.function.js',
    },
    {
      foreground: '98c379',
      token: 'keyword.other.template.begin',
    },
    {
      foreground: '98c379',
      token: 'keyword.other.template.end',
    },
    {
      foreground: '98c379',
      token: 'keyword.other.substitution.begin',
    },
    {
      foreground: '98c379',
      token: 'keyword.other.substitution.end',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.operator.assignment',
    },
    {
      foreground: 'e5c07b',
      token: 'keyword.operator.assignment.go',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.arithmetic.go',
    },
    {
      foreground: 'cc6be9',
      token: 'keyword.operator.address.go',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.package.go',
    },
    {
      foreground: '56b6c2',
      token: 'support.type.prelude.elm',
    },
    {
      foreground: 'e09956',
      token: 'support.constant.elm',
    },
    {
      foreground: 'cc6be9',
      token: 'punctuation.quasi.element',
    },
    {
      foreground: '9faeca',
      token: 'constant.character.entity',
    },
    {
      foreground: '56b6c2',
      token: 'entity.other.attribute-name.pseudo-element',
    },
    {
      foreground: '56b6c2',
      token: 'entity.other.attribute-name.pseudo-class',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.global.clojure',
    },
    {
      foreground: '9faeca',
      token: 'meta.symbol.clojure',
    },
    {
      foreground: '56b6c2',
      token: 'constant.keyword.clojure',
    },
    {
      foreground: '9faeca',
      token: 'meta.arguments.coffee',
    },
    {
      foreground: '9faeca',
      token: 'variable.parameter.function.coffee',
    },
    {
      foreground: '98c379',
      token: 'source.ini',
    },
    {
      foreground: '9faeca',
      token: 'meta.scope.prerequisites.makefile',
    },
    {
      foreground: 'e5c07b',
      token: 'source.makefile',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.modifier.import.groovy',
    },
    {
      foreground: '61afef',
      token: 'meta.method.groovy',
    },
    {
      foreground: '9faeca',
      token: 'meta.definition.variable.name.groovy',
    },
    {
      foreground: '98c379',
      token: 'meta.definition.class.inherited.classes.groovy',
    },
    {
      foreground: 'e5c07b',
      token: 'support.variable.semantic.hlsl',
    },
    {
      foreground: 'cc6be9',
      token: 'support.type.texture.hlsl',
    },
    {
      foreground: 'cc6be9',
      token: 'support.type.sampler.hlsl',
    },
    {
      foreground: 'cc6be9',
      token: 'support.type.object.hlsl',
    },
    {
      foreground: 'cc6be9',
      token: 'support.type.object.rw.hlsl',
    },
    {
      foreground: 'cc6be9',
      token: 'support.type.fx.hlsl',
    },
    {
      foreground: 'cc6be9',
      token: 'support.type.object.hlsl',
    },
    {
      foreground: '9faeca',
      token: 'text.variable',
    },
    {
      foreground: '9faeca',
      token: 'text.bracketed',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.swift',
    },
    {
      foreground: 'e5c07b',
      token: 'support.type.vb.asp',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.function.xi',
    },
    {
      foreground: '56b6c2',
      token: 'entity.name.class.xi',
    },
    {
      foreground: '9faeca',
      token: 'constant.character.character-class.regexp.xi',
    },
    {
      foreground: 'cc6be9',
      token: 'constant.regexp.xi',
    },
    {
      foreground: '56b6c2',
      token: 'keyword.control.xi',
    },
    {
      foreground: 'd4d4d4',
      token: 'invalid.xi',
    },
    {
      foreground: '98c379',
      token: 'beginning.punctuation.definition.quote.markdown.xi',
    },
    {
      foreground: '7f848e',
      token: 'beginning.punctuation.definition.list.markdown.xi',
    },
    {
      foreground: '61afef',
      token: 'constant.character.xi',
    },
    {
      foreground: '61afef',
      token: 'accent.xi',
    },
    {
      foreground: 'e09956',
      token: 'wikiword.xi',
    },
    {
      foreground: 'ffffff',
      token: 'constant.other.color.rgb-value.xi',
    },
    {
      foreground: '7f848e',
      token: 'punctuation.definition.tag.xi',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.label.cs',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.scope-resolution.function.call',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.scope-resolution.function.definition',
    },
    {
      foreground: '9faeca',
      token: 'entity.name.label.cs',
    },
    {
      foreground: '9faeca',
      token: 'markup.heading.setext.1.markdown',
    },
    {
      foreground: '9faeca',
      token: 'markup.heading.setext.2.markdown',
    },
    {
      foreground: 'd4d4d4',
      token: 'meta.brace.square',
    },
    {
      foreground: '7f848e',
      token: 'comment',
    },
    {
      foreground: '7f848e',
      token: 'punctuation.definition.comment',
    },
    {
      foreground: '7f848e',
      token: 'markup.quote.markdown',
    },
    {
      foreground: 'd4d4d4',
      token: 'punctuation.definition.block.sequence.item.yaml',
    },
    {
      foreground: '56b6c2',
      token: 'constant.language.symbol.elixir',
    },
  ],
  colors: {
    'editor.foreground': '#d4d4d4',
    'editor.background': '#181822',
    'editor.selectionBackground': '#264f78',
    'editor.lineHighlightBackground': '#ffffff0A',
    'editorCursor.foreground': '#ff3f7e',
    'editorWhitespace.foreground': '#e3e4e229',
  },
};

export default theme;
