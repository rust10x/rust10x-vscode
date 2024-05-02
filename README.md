# Rust10x VSCode Extension

Rust10x is designed to enhance productivity in production coding with Rust.

For more information and keybindings, visit: https://rust10x.com/vscode

The initial releases include:
1) A collection of snippets that I frequently use in my Rust programming and in my [Rust Production Coding Videos](https://youtube.com/jeremychone).
2) Several Rust coding productivity commands. For now, these include the [`eol_..` commands](#2-commands).

### 1) Snippets

All snippets are prefixed with `10x-`, making them quick to select by just typing `1` and then triggering the suggestion. For example, typing `1tf` and then pressing `Ctrl+Space` will suggest `10x-test-fn`, `10x-test-async-fn`, and `10x-impl-try-from`. ([more info](https://rust10x.com/vscode))

I haven't included keybindings as they are more of personal preferences personal, but you can find the ones I use at [rust10x/vscode](https://rust10x.com/vscode).

### 2) Commands

See [YouTube Video](https://www.youtube.com/watch?v=Ek9_WtxCNjw&list=PL7r-PXl6ZPcCIOFaL7nVHXZvBmHNhrh_Q) about the `eol...` commands. 

NEW in version 0.1.5 and later.

The `eol_...` commands allow toggling the end-of-line completion. They will replace the existing end-of-line character with the one specified by the command.

| Command                             | EOL        | Possible bindings |
|-------------------------------------|------------|-------------------|
| `rust10x.eol_scolon`                | `;`        | `cmd+;`           |
| `rust10x.eol_question_scolon`       | `?;`       | `cmd+alt+;`       |
| `rust10x.eol_await_scolon`          | `.await;`  | `cmd+ctrl+;`      |
| `rust10x.eol_await_question_scolon` | `.await?;` | `cmd+ctrl+alt+;`  |
| `rust10x.eol_comma`                 | `,`        | `cmd+shift+,`     |


Other cool command: 

| Command                 | Note                                     | Possible bindings |
|-------------------------|------------------------------------------|-------------------|
| `rust10x.open_error_rs` | Open/Focus the closest parent `error.rs` | `cmd+ctrl+e`      |

You can find the my keybindings at [rust10x/vscode](https://rust10x.com/vscode).


> Note: I am showing the keybindings I use for these commands, but they are not set in this extension, as they might already be in use.
> <br />In short, the pattern for these bindings is that `alt` adds the `?`, and `ctrl` adds the `.await`.



[GitHub Repo](https://github.com/rust10x/rust10x-vscode) | [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=rust10x.rust10x)

More coming...

Happy Coding!