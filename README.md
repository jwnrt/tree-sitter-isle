# tree-sitter-isle

[Tree-sitter] grammar for the [ISLE] term-rewriting language used by the
[Cranelift] code generator.

Based on the [language reference][lang-ref], particularly [the grammar][grammar]
plus some recent additions like `if-let`, `infallible`, `partial`, and `pure`.

Issues and pull requests welcome.

[Tree-sitter]: https://tree-sitter.github.io/tree-sitter/
[ISLE]: https://github.com/bytecodealliance/wasmtime/tree/main/cranelift/isle
[Cranelift]: https://github.com/bytecodealliance/wasmtime/tree/main/cranelift
[lang-ref]: https://github.com/bytecodealliance/wasmtime/blob/main/cranelift/isle/docs/language-reference.md
[grammar]: https://github.com/bytecodealliance/wasmtime/blob/main/cranelift/isle/docs/language-reference.md#reference-isle-language-grammar

## Example

ISLE uses an S-expression syntax and looks something like this:

```isle
;; Add two registers.
(rule (lower (iadd x y))
      (value_reg (add
                   (put_in_reg x)
                   (RegMemImm.Reg (put_in_reg y)))))

;; Add a register and an immediate.
(rule (lower (iadd x (simm32_from_value y))
      (value_reg (add
                   (put_in_reg x)
                   ;; `y` is a `RegMemImm.Imm`.
                   y)))
```

## Usage

Refer to the [tree-sitter docs] for using this grammar directly, or consult your
chosen text-editor's documentation for integration help.

[tree-sitter docs]: https://tree-sitter.github.io/tree-sitter/using-parsers

<details><summary>

### Helix

</summary>

1. Add the following to your `$XDG_CONFIG_HOME/helix/languages.toml` file:

   ```toml
   [[language]]
   name = "isle"
   scope = "source.isle"
   injection-regex = "isle"
   file-types = ["isle"]
   roots = []
   comment-token = ";"
   indent = { tab-width = 2, unit = "  " }
   
   [[grammar]]
   name = "isle"
   source = { git = "https://github.com/jwnrt/tree-sitter-isle", rev = "<LATEST COMMIT>" }
   ```

2. Copy [`queries/highlights.scm`](queries/highlights.scm) to
   `$XDG_CONFIG_HOME/helix/runtime/queries/isle/highlights.scm`.

3. Fetch and build the grammar:

   ```sh
   hx --grammar fetch
   hx --grammar build
   ```

</details>

## License

Distributed under the MIT license. See `LICENSE` for details.
