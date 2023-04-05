import { EditorThemeDefinition } from '../types';

const theme: EditorThemeDefinition = {
  base: 'vs-dark',
  inherit: true,
  name: 'Atom One Dark',
  rules: [
    {
      foreground: '5c6370',
      fontStyle: 'italic',
      token: 'comment',
    },
    {
      foreground: '5c6370',
      token: 'comment markup.link',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.type',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.other.inherited-class',
    },
    {
      foreground: 'c678dd',
      token: 'keyword',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.control',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator',
    },
    {
      foreground: '61afef',
      token: 'keyword.other.special-method',
    },
    {
      foreground: 'd19a66',
      token: 'keyword.other.unit',
    },
    {
      foreground: 'c678dd',
      token: 'storage',
    },
    {
      foreground: 'c678dd',
      token: 'storage.type.annotation',
    },
    {
      foreground: 'c678dd',
      token: 'storage.type.primitive',
    },
    {
      foreground: 'abb2bf',
      token: 'storage.modifier.package',
    },
    {
      foreground: 'abb2bf',
      token: 'storage.modifier.import',
    },
    {
      foreground: 'd19a66',
      token: 'constant',
    },
    {
      foreground: 'd19a66',
      token: 'constant.variable',
    },
    {
      foreground: '56b6c2',
      token: 'constant.character.escape',
    },
    {
      foreground: 'd19a66',
      token: 'constant.numeric',
    },
    {
      foreground: '56b6c2',
      token: 'constant.other.color',
    },
    {
      foreground: '56b6c2',
      token: 'constant.other.symbol',
    },
    {
      foreground: 'e06c75',
      token: 'variable',
    },
    {
      foreground: 'be5046',
      token: 'variable.interpolation',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.parameter',
    },
    {
      foreground: '98c379',
      token: 'string',
    },
    {
      foreground: 'abb2bf',
      token: 'string > source',
    },
    {
      foreground: 'abb2bf',
      token: 'string embedded',
    },
    {
      foreground: '56b6c2',
      token: 'string.regexp',
    },
    {
      foreground: 'e5c07b',
      token: 'string.regexp source.ruby.embedded',
    },
    {
      foreground: 'e06c75',
      token: 'string.other.link',
    },
    {
      foreground: '5c6370',
      token: 'punctuation.definition.comment',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.method-parameters',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.function-parameters',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.parameters',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.separator',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.seperator',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.array',
    },
    {
      foreground: '61afef',
      token: 'punctuation.definition.heading',
    },
    {
      foreground: '61afef',
      token: 'punctuation.definition.identity',
    },
    {
      foreground: 'e5c07b',
      fontStyle: 'bold',
      token: 'punctuation.definition.bold',
    },
    {
      foreground: 'c678dd',
      fontStyle: 'italic',
      token: 'punctuation.definition.italic',
    },
    {
      foreground: 'be5046',
      token: 'punctuation.section.embedded',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.section.method',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.section.class',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.section.inner-class',
    },
    {
      foreground: 'e5c07b',
      token: 'support.class',
    },
    {
      foreground: '56b6c2',
      token: 'support.type',
    },
    {
      foreground: '56b6c2',
      token: 'support.function',
    },
    {
      foreground: '61afef',
      token: 'support.function.any-method',
    },
    {
      foreground: '61afef',
      token: 'entity.name.function',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.class',
    },
    {
      foreground: 'e5c07b',
      token: 'entity.name.type.class',
    },
    {
      foreground: '61afef',
      token: 'entity.name.section',
    },
    {
      foreground: 'e06c75',
      token: 'entity.name.tag',
    },
    {
      foreground: 'd19a66',
      token: 'entity.other.attribute-name',
    },
    {
      foreground: '61afef',
      token: 'entity.other.attribute-name.id',
    },
    {
      foreground: 'e5c07b',
      token: 'meta.class',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.class.body',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.method-call',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.method',
    },
    {
      foreground: 'e06c75',
      token: 'meta.definition.variable',
    },
    {
      foreground: 'd19a66',
      token: 'meta.link',
    },
    {
      foreground: '61afef',
      token: 'meta.require',
    },
    {
      foreground: 'c678dd',
      token: 'meta.selector',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.separator',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.tag',
    },
    {
      foreground: 'abb2bf',
      token: 'none',
    },
    {
      foreground: '523d14',
      background: 'e0c285',
      token: 'invalid.deprecated',
    },
    {
      foreground: 'ffffff',
      background: 'e05252',
      token: 'invalid.illegal',
    },
    {
      foreground: 'd19a66',
      fontStyle: 'bold',
      token: 'markup.bold',
    },
    {
      foreground: 'c678dd',
      token: 'markup.changed',
    },
    {
      foreground: 'e06c75',
      token: 'markup.deleted',
    },
    {
      foreground: 'c678dd',
      fontStyle: 'italic',
      token: 'markup.italic',
    },
    {
      foreground: 'e06c75',
      token: 'markup.heading',
    },
    {
      foreground: '61afef',
      token: 'markup.heading punctuation.definition.heading',
    },
    {
      foreground: '56b6c2',
      token: 'markup.link',
    },
    {
      foreground: '98c379',
      token: 'markup.inserted',
    },
    {
      foreground: 'd19a66',
      token: 'markup.quote',
    },
    {
      foreground: '98c379',
      token: 'markup.raw',
    },
    {
      foreground: 'c678dd',
      token: 'source.c keyword.operator',
    },
    {
      foreground: 'c678dd',
      token: 'source.cpp keyword.operator',
    },
    {
      foreground: 'c678dd',
      token: 'source.cs keyword.operator',
    },
    {
      foreground: '828997',
      token: 'source.css property-name',
    },
    {
      foreground: '828997',
      token: 'source.css property-value',
    },
    {
      foreground: 'abb2bf',
      token: 'source.css property-name.support',
    },
    {
      foreground: 'abb2bf',
      token: 'source.css property-value.support',
    },
    {
      foreground: 'abb2bf',
      token: 'source.elixir source.embedded.source',
    },
    {
      foreground: '61afef',
      token: 'source.elixir constant.language',
    },
    {
      foreground: '61afef',
      token: 'source.elixir constant.numeric',
    },
    {
      foreground: '61afef',
      token: 'source.elixir constant.definition',
    },
    {
      foreground: 'c678dd',
      token: 'source.elixir variable.definition',
    },
    {
      foreground: 'c678dd',
      token: 'source.elixir variable.anonymous',
    },
    {
      foreground: 'd19a66',
      fontStyle: 'italic',
      token: 'source.elixir parameter.variable.function',
    },
    {
      foreground: '98c379',
      token: 'source.elixir quoted',
    },
    {
      foreground: 'e06c75',
      token: 'source.elixir keyword.special-method',
    },
    {
      foreground: 'e06c75',
      token: 'source.elixir embedded.section',
    },
    {
      foreground: 'e06c75',
      token: 'source.elixir embedded.source.empty',
    },
    {
      foreground: 'e06c75',
      token: 'source.elixir readwrite.module punctuation',
    },
    {
      foreground: 'be5046',
      token: 'source.elixir regexp.section',
    },
    {
      foreground: 'be5046',
      token: 'source.elixir regexp.string',
    },
    {
      foreground: 'd19a66',
      token: 'source.elixir separator',
    },
    {
      foreground: 'd19a66',
      token: 'source.elixir keyword.operator',
    },
    {
      foreground: 'e5c07b',
      token: 'source.elixir variable.constant',
    },
    {
      foreground: '828997',
      token: 'source.elixir array',
    },
    {
      foreground: '828997',
      token: 'source.elixir scope',
    },
    {
      foreground: '828997',
      token: 'source.elixir section',
    },
    {
      foreground: '61afef',
      token: 'source.gfm link entity',
    },
    {
      foreground: 'c678dd',
      token: 'source.go storage.type.string',
    },
    {
      foreground: 'e06c75',
      token: 'source.ini keyword.other.definition.ini',
    },
    {
      foreground: 'e5c07b',
      token: 'source.java storage.modifier.import',
    },
    {
      foreground: 'e5c07b',
      token: 'source.java storage.type',
    },
    {
      foreground: 'c678dd',
      token: 'source.java keyword.operator.instanceof',
    },
    {
      foreground: 'e06c75',
      token: 'source.java-properties meta.key-pair',
    },
    {
      foreground: 'abb2bf',
      token: 'source.java-properties meta.key-pair > punctuation',
    },
    {
      foreground: '56b6c2',
      token: 'source.js keyword.operator',
    },
    {
      foreground: 'c678dd',
      token: 'source.js keyword.operator.delete',
    },
    {
      foreground: 'c678dd',
      token: 'source.js keyword.operator.in',
    },
    {
      foreground: 'c678dd',
      token: 'source.js keyword.operator.of',
    },
    {
      foreground: 'c678dd',
      token: 'source.js keyword.operator.instanceof',
    },
    {
      foreground: 'c678dd',
      token: 'source.js keyword.operator.new',
    },
    {
      foreground: 'c678dd',
      token: 'source.js keyword.operator.typeof',
    },
    {
      foreground: 'c678dd',
      token: 'source.js keyword.operator.void',
    },
    {
      foreground: '56b6c2',
      token: 'source.ts keyword.operator',
    },
    {
      foreground: '56b6c2',
      token: 'source.flow keyword.operator',
    },
    {
      foreground: 'e06c75',
      token: 'source.json meta.structure.dictionary.json > string.quoted.json',
    },
    {
      foreground: 'e06c75',
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
      foreground: 'e06c75',
      token: 'ng.interpolation',
    },
    {
      foreground: '61afef',
      token: 'ng.interpolation.begin',
    },
    {
      foreground: '61afef',
      token: 'ng.interpolation.end',
    },
    {
      foreground: 'e06c75',
      token: 'ng.interpolation function',
    },
    {
      foreground: '61afef',
      token: 'ng.interpolation function.begin',
    },
    {
      foreground: '61afef',
      token: 'ng.interpolation function.end',
    },
    {
      foreground: 'd19a66',
      token: 'ng.interpolation bool',
    },
    {
      foreground: 'abb2bf',
      token: 'ng.interpolation bracket',
    },
    {
      foreground: 'abb2bf',
      token: 'ng.pipe',
    },
    {
      foreground: 'abb2bf',
      token: 'ng.operator',
    },
    {
      foreground: '56b6c2',
      token: 'ng.tag',
    },
    {
      foreground: 'e5c07b',
      token: 'ng.attribute-with-value attribute-name',
    },
    {
      foreground: 'c678dd',
      token: 'ng.attribute-with-value string',
    },
    {
      foreground: 'abb2bf',
      token: 'ng.attribute-with-value string.begin',
    },
    {
      foreground: 'abb2bf',
      token: 'ng.attribute-with-value string.end',
    },
    {
      foreground: '000000',
      token: 'source.ruby constant.other.symbol > punctuation',
    },
    {
      foreground: 'abb2bf',
      token: 'source.php class.bracket',
    },
    {
      foreground: 'c678dd',
      token: 'source.python keyword.operator.logical.python',
    },
    {
      foreground: 'd19a66',
      token: 'source.python variable.parameter',
    },
    {
      foreground: 'abb2bf',
      token: 'customrule',
    },
    {
      foreground: 'abb2bf',
      token: 'support.type.property-name',
    },
    {
      foreground: '98c379',
      token: 'string.quoted.double punctuation',
    },
    {
      foreground: 'd19a66',
      token: 'support.constant',
    },
    {
      foreground: 'e06c75',
      token: 'support.type.property-name.json',
    },
    {
      foreground: 'e06c75',
      token: 'support.type.property-name.json punctuation',
    },
    {
      foreground: '56b6c2',
      token: 'punctuation.separator.key-value.ts',
    },
    {
      foreground: '56b6c2',
      token: 'punctuation.separator.key-value.js',
    },
    {
      foreground: '56b6c2',
      token: 'punctuation.separator.key-value.tsx',
    },
    {
      foreground: '56b6c2',
      token: 'source.js.embedded.html keyword.operator',
    },
    {
      foreground: '56b6c2',
      token: 'source.ts.embedded.html keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.readwrite.js',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.readwrite.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.readwrite.tsx',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.dom.js',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.dom.ts',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.property.dom.js',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.property.dom.ts',
    },
    {
      foreground: 'be5046',
      token: 'meta.template.expression.js punctuation.definition',
    },
    {
      foreground: 'be5046',
      token: 'meta.template.expression.ts punctuation.definition',
    },
    {
      foreground: 'abb2bf',
      token: 'source.ts punctuation.definition.typeparameters',
    },
    {
      foreground: 'abb2bf',
      token: 'source.js punctuation.definition.typeparameters',
    },
    {
      foreground: 'abb2bf',
      token: 'source.tsx punctuation.definition.typeparameters',
    },
    {
      foreground: 'abb2bf',
      token: 'source.ts punctuation.definition.block',
    },
    {
      foreground: 'abb2bf',
      token: 'source.js punctuation.definition.block',
    },
    {
      foreground: 'abb2bf',
      token: 'source.tsx punctuation.definition.block',
    },
    {
      foreground: 'abb2bf',
      token: 'source.ts punctuation.separator.comma',
    },
    {
      foreground: 'abb2bf',
      token: 'source.js punctuation.separator.comma',
    },
    {
      foreground: 'abb2bf',
      token: 'source.tsx punctuation.separator.comma',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.property.js',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.property.ts',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.property.tsx',
    },
    {
      foreground: 'e06c75',
      token: 'keyword.control.default.js',
    },
    {
      foreground: 'e06c75',
      token: 'keyword.control.default.ts',
    },
    {
      foreground: 'e06c75',
      token: 'keyword.control.default.tsx',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.instanceof.js',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.instanceof.ts',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.instanceof.tsx',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.of.js',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.of.ts',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.of.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.brace.round.js',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.array-binding-pattern-variable.js',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.brace.square.js',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.brace.round.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.array-binding-pattern-variable.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.brace.square.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.brace.round.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.array-binding-pattern-variable.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.brace.square.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'source.js punctuation.accessor',
    },
    {
      foreground: 'abb2bf',
      token: 'source.ts punctuation.accessor',
    },
    {
      foreground: 'abb2bf',
      token: 'source.tsx punctuation.accessor',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.terminator.statement.js',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.terminator.statement.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.terminator.statement.tsx',
    },
    {
      foreground: 'd19a66',
      token:
        'meta.array-binding-pattern-variable.js variable.other.readwrite.js',
    },
    {
      foreground: 'd19a66',
      token:
        'meta.array-binding-pattern-variable.ts variable.other.readwrite.ts',
    },
    {
      foreground: 'd19a66',
      token:
        'meta.array-binding-pattern-variable.tsx variable.other.readwrite.tsx',
    },
    {
      foreground: 'e06c75',
      token: 'source.js support.variable',
    },
    {
      foreground: 'e06c75',
      token: 'source.ts support.variable',
    },
    {
      foreground: 'e06c75',
      token: 'source.tsx support.variable',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.property.js',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.property.ts',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.property.tsx',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.new.ts',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.new.j',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.new.tsx',
    },
    {
      foreground: '56b6c2',
      token: 'source.ts keyword.operator',
    },
    {
      foreground: '56b6c2',
      token: 'source.tsx keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.separator.parameter.js',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.separator.parameter.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.separator.parameter.tsx',
    },
    {
      foreground: 'e06c75',
      token: 'constant.language.import-export-all.js',
    },
    {
      foreground: 'e06c75',
      token: 'constant.language.import-export-all.ts',
    },
    {
      foreground: '56b6c2',
      token: 'constant.language.import-export-all.jsx',
    },
    {
      foreground: '56b6c2',
      token: 'constant.language.import-export-all.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'keyword.control.as.js',
    },
    {
      foreground: 'abb2bf',
      token: 'keyword.control.as.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'keyword.control.as.jsx',
    },
    {
      foreground: 'abb2bf',
      token: 'keyword.control.as.tsx',
    },
    {
      foreground: 'e06c75',
      token: 'variable.other.readwrite.alias.js',
    },
    {
      foreground: 'e06c75',
      token: 'variable.other.readwrite.alias.ts',
    },
    {
      foreground: 'e06c75',
      token: 'variable.other.readwrite.alias.jsx',
    },
    {
      foreground: 'e06c75',
      token: 'variable.other.readwrite.alias.tsx',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.js',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.ts',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.jsx',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.tsx',
    },
    {
      foreground: 'e06c75',
      token: 'meta.export.default.js variable.other.readwrite.js',
    },
    {
      foreground: 'e06c75',
      token: 'meta.export.default.ts variable.other.readwrite.ts',
    },
    {
      foreground: '98c379',
      token: 'source.js meta.template.expression.js punctuation.accessor',
    },
    {
      foreground: '98c379',
      token: 'source.ts meta.template.expression.ts punctuation.accessor',
    },
    {
      foreground: '98c379',
      token: 'source.tsx meta.template.expression.tsx punctuation.accessor',
    },
    {
      foreground: 'abb2bf',
      token: 'source.js meta.import-equals.external.js keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'source.jsx meta.import-equals.external.jsx keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'source.ts meta.import-equals.external.ts keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'source.tsx meta.import-equals.external.tsx keyword.operator',
    },
    {
      foreground: '98c379',
      token: 'entity.name.type.module.js',
    },
    {
      foreground: '98c379',
      token: 'entity.name.type.module.ts',
    },
    {
      foreground: '98c379',
      token: 'entity.name.type.module.jsx',
    },
    {
      foreground: '98c379',
      token: 'entity.name.type.module.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.class.js',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.class.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.class.jsx',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.class.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.definition.property.js variable',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.definition.property.ts variable',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.definition.property.jsx variable',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.definition.property.tsx variable',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.type.parameters.js support.type',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.type.parameters.jsx support.type',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.type.parameters.ts support.type',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.type.parameters.tsx support.type',
    },
    {
      foreground: 'abb2bf',
      token: 'source.js meta.tag.js keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'source.jsx meta.tag.jsx keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'source.ts meta.tag.ts keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'source.tsx meta.tag.tsx keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.tag.js punctuation.section.embedded',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.tag.jsx punctuation.section.embedded',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.tag.ts punctuation.section.embedded',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.tag.tsx punctuation.section.embedded',
    },
    {
      foreground: 'e5c07b',
      token: 'meta.array.literal.js variable',
    },
    {
      foreground: 'e5c07b',
      token: 'meta.array.literal.jsx variable',
    },
    {
      foreground: 'e5c07b',
      token: 'meta.array.literal.ts variable',
    },
    {
      foreground: 'e5c07b',
      token: 'meta.array.literal.tsx variable',
    },
    {
      foreground: 'e06c75',
      token: 'support.type.object.module.js',
    },
    {
      foreground: 'e06c75',
      token: 'support.type.object.module.jsx',
    },
    {
      foreground: 'e06c75',
      token: 'support.type.object.module.ts',
    },
    {
      foreground: 'e06c75',
      token: 'support.type.object.module.tsx',
    },
    {
      foreground: '56b6c2',
      token: 'constant.language.json',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.object.js',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.object.jsx',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.object.ts',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.object.tsx',
    },
    {
      foreground: '56b6c2',
      token: 'storage.type.property.js',
    },
    {
      foreground: '56b6c2',
      token: 'storage.type.property.jsx',
    },
    {
      foreground: '56b6c2',
      token: 'storage.type.property.ts',
    },
    {
      foreground: '56b6c2',
      token: 'storage.type.property.tsx',
    },
    {
      foreground: '98c379',
      token: 'meta.template.expression.js string.quoted punctuation.definition',
    },
    {
      foreground: '98c379',
      token:
        'meta.template.expression.jsx string.quoted punctuation.definition',
    },
    {
      foreground: '98c379',
      token: 'meta.template.expression.ts string.quoted punctuation.definition',
    },
    {
      foreground: '98c379',
      token:
        'meta.template.expression.tsx string.quoted punctuation.definition',
    },
    {
      foreground: '98c379',
      token:
        'meta.template.expression.js string.template punctuation.definition.string.template',
    },
    {
      foreground: '98c379',
      token:
        'meta.template.expression.jsx string.template punctuation.definition.string.template',
    },
    {
      foreground: '98c379',
      token:
        'meta.template.expression.ts string.template punctuation.definition.string.template',
    },
    {
      foreground: '98c379',
      token:
        'meta.template.expression.tsx string.template punctuation.definition.string.template',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.in.js',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.in.jsx',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.in.ts',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.operator.expression.in.tsx',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.object.js',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.object.ts',
    },
    {
      foreground: 'e06c75',
      token: 'meta.object-literal.key.js',
    },
    {
      foreground: 'e06c75',
      token: 'meta.object-literal.key.ts',
    },
    {
      foreground: 'abb2bf',
      token: 'source.python constant.other',
    },
    {
      foreground: 'd19a66',
      token: 'source.python constant',
    },
    {
      foreground: 'd19a66',
      token: 'constant.character.format.placeholder.other.python storage',
    },
    {
      foreground: 'e06c75',
      token: 'support.variable.magic.python',
    },
    {
      foreground: 'd19a66',
      token: 'meta.function.parameters.python',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.separator.annotation.python',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.separator.parameters.python',
    },
    {
      foreground: 'e06c75',
      token: 'entity.name.variable.field.cs',
    },
    {
      foreground: 'abb2bf',
      token: 'source.cs keyword.operator',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.readwrite.cs',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.object.cs',
    },
    {
      foreground: 'abb2bf',
      token: 'variable.other.object.property.cs',
    },
    {
      foreground: '61afef',
      token: 'entity.name.variable.property.cs',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.cs',
    },
    {
      foreground: 'c678dd',
      token: 'keyword.other.unsafe.rust',
    },
    {
      foreground: '56b6c2',
      token: 'entity.name.type.rust',
    },
    {
      foreground: 'abb2bf',
      token: 'storage.modifier.lifetime.rust',
    },
    {
      foreground: 'd19a66',
      token: 'entity.name.lifetime.rust',
    },
    {
      foreground: '56b6c2',
      token: 'storage.type.core.rust',
    },
    {
      foreground: 'd19a66',
      token: 'meta.attribute.rust',
    },
    {
      foreground: '56b6c2',
      token: 'storage.class.std.rust',
    },
    {
      foreground: 'abb2bf',
      token: 'markup.raw.block.markdown',
    },
    {
      foreground: 'e06c75',
      token: 'punctuation.definition.variable.shell',
    },
    {
      foreground: 'abb2bf',
      token: 'support.constant.property-value.css',
    },
    {
      foreground: 'd19a66',
      token: 'punctuation.definition.constant.css',
    },
    {
      foreground: 'e06c75',
      token: 'punctuation.separator.key-value.scss',
    },
    {
      foreground: 'd19a66',
      token: 'punctuation.definition.constant.scss',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.property-list.scss punctuation.separator.key-value.scss',
    },
    {
      foreground: 'e5c07b',
      token: 'storage.type.primitive.array.java',
    },
    {
      foreground: 'e06c75',
      token: 'entity.name.section.markdown',
    },
    {
      foreground: 'e06c75',
      token: 'punctuation.definition.heading.markdown',
    },
    {
      foreground: 'abb2bf',
      token: 'markup.heading.setext',
    },
    {
      foreground: 'd19a66',
      token: 'punctuation.definition.bold.markdown',
    },
    {
      foreground: '98c379',
      token: 'markup.inline.raw.markdown',
    },
    {
      foreground: 'e06c75',
      token: 'beginning.punctuation.definition.list.markdown',
    },
    {
      foreground: '5c6370',
      fontStyle: 'italic',
      token: 'markup.quote.markdown',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.string.begin.markdown',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.string.end.markdown',
    },
    {
      foreground: 'abb2bf',
      token: 'punctuation.definition.metadata.markdown',
    },
    {
      foreground: 'c678dd',
      token: 'punctuation.definition.metadata.markdown',
    },
    {
      foreground: 'c678dd',
      token: 'markup.underline.link.markdown',
    },
    {
      foreground: 'c678dd',
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
      foreground: 'e06c75',
      token: 'punctuation.separator.variable.ruby',
    },
    {
      foreground: 'd19a66',
      token: 'variable.other.constant.ruby',
    },
    {
      foreground: '98c379',
      token: 'keyword.operator.other.ruby',
    },
    {
      foreground: 'e06c75',
      token: 'punctuation.definition.variable.php',
    },
    {
      foreground: 'abb2bf',
      token: 'meta.class.php',
    },
  ],
  colors: {
    'editor.foreground': '#ABB2BF',
    'editor.background': '#282C34',
    'editor.selectionBackground': '#3E4451',
    'editor.lineHighlightBackground': '#99BBFF0A',
    'editorCursor.foreground': '#528BFF',
    'editorWhitespace.foreground': '#ABB2BF26',
  },
};

export default theme;
