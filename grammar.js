/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'isle',

  // Tokens that can appear anywhere and are ignored.
  extras: $ => [
    /\s/,
    $.line_comment,
  ],

  // Integers match both `priority` and `pattern` in the same position, so we
  // have to tell TS they're conflicting. It will do some extra work to resolve
  // the tree.
  conflicts: $ => [
    [$.priority, $.pattern],
  ],

  // Ensure keywords are not tokenised as `identifier`s.
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
      seq('const', $.const_sym, $.identifier, $.type),
    ),

    primitive: $ => seq('(', 'primitive', $.identifier, ')'),

    enum: $ => seq('enum', repeat($.enum_variant)),

    enum_variant: $ => seq('(', seq($.identifier, repeat($.enum_field)), ')'),

    enum_field: $ => seq('(', $.identifier, $.type, ')'),

    type: $ => $.identifier,

    decl: $ => seq(
      repeat(choice("pure", "partial")),
      $.identifier,
      '(',
      repeat($.type),
      ')',
      $.type,
    ),

    rule: $ => seq(optional($.priority), $.pattern, repeat($.condition), $.expression),

    priority: $ => $.integer,

    pattern: $ => choice(
      $.integer,
      $.boolean,
      $.const_sym,
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
      $.const_sym,
      $.boolean,
      $.identifier,
      seq('(', 'let', '(', repeat($.let_binding), ')', $.expression, ')'),
      seq('(', $.identifier, repeat($.expression), ')'),
    ),

    let_binding: $ => seq('(', $.identifier, $.type, $.expression, ')'),

    extractor: $ => seq('(', $.identifier, repeat($.identifier), ')', $.pattern),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_.$]*/,

    const_sym: $ => /\$[A-Za-z0-9_.$]*/,

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
