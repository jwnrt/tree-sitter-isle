/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'isle',

  extras: $ => [
    /\s/,
    $.line_comment,
  ],

  conflicts: $ => [
    [$.priority, $.pattern],
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($.defn),

    defn: $ => seq(
      '(',
      choice(
        seq('type', $.type_decl),
        seq('decl', $.decl),
        seq('rule', $.rule),
        seq('extractor', $.extractor),
        seq('extern', $.extern),
      ),
      ')',
    ),

    type_decl: $ => seq($.identifier, optional('extern'), $.type_value),

    type_value: $ => seq('(', choice($.primitive, $.enum), ')'),

    extern: $ => choice(
      seq('constructor', $.identifier, $.identifier),
      seq('extractor', optional('infallible'), $.identifier, $.identifier),
      seq('const', $.constant, $.identifier, $.type),
    ),

    primitive: $ => seq('(', 'primitive', $.identifier, ')'),

    enum: $ => seq('enum', repeat($.enum_variant)),

    enum_variant: $ => seq('(', seq($.identifier, repeat($.enum_field)), ')'),

    enum_field: $ => seq('(', $.identifier, $.type, ')'),

    type: $ => $.identifier,

    decl: $ => seq(repeat(choice("pure", "partial")), $.identifier, '(', repeat($.type), ')', $.type),

    rule: $ => seq(optional($.priority), $.pattern, repeat($.condition), $.expression),

    priority: $ => $.integer,

    pattern: $ => choice(
      $.integer,
      $.boolean,
      $.constant,
      '_',
      seq($.identifier, optional(seq('@', $.pattern))),
      seq('(', 'and', repeat($.pattern), ')'),
      seq('(', $.identifier, repeat($.pattern_arg), ')'),
    ),

    pattern_arg: $ => choice($.pattern, seq('<', $.expression)),

    condition: $ => choice($.if_let, $.if),
    if_let: $ => seq("(", "if-let", $.pattern, $.expression, ")"),
    if: $ => seq("(", "if", $.expression, ")"),

    expression: $ => choice(
      $.integer,
      $.constant,
      $.boolean,
      $.identifier,
      seq('(', 'let', '(', repeat($.let_binding), ')', $.expression, ')'),
      seq('(', $.identifier, repeat($.expression), ')'),
    ),

    let_binding: $ => seq('(', $.identifier, $.type, $.expression, ')'),

    extractor: $ => seq('(', $.identifier, repeat($.identifier), ')', $.pattern),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_.$]*/,

    constant: $ => /\$[A-Za-z0-9_.$]*/,

    integer: $ => choice(
      /-?[0-9][0-9_]*/,
      /-?0[xX][0-9a-fA-F_]+/,
      /-?0b[01_]+/,
      /-?0o[0-7_]+/,
    ),

    boolean: $ => choice('#t', '#f'),

    line_comment: $ => seq(';', token.immediate(/.*/)),
  },
});
