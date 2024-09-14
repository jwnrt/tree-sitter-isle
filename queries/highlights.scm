; Comments
(line_comment) @comment

; Textual tokens
(constant) @constant
(type) @type

; Assume PascalCase identifiers are types.
((identifier) @type
  (#match? @type "^[A-Z]"))
(identifier) @variable

; Keywords
[
  "and"
  "const"
  "constructor"
  "decl"
  "enum"
  "extern"
  "extractor"
  "extractor"
  "if"
  "if-let"
  "infallible"
  "let"
  "partial"
  "primitive"
  "pure"
  "rule"
  "type"
] @keyword

; Literals
(integer) @constant.numeric
(boolean) @constant.builtin

; Punctuation
["(" ")"] @punctuation.bracket
