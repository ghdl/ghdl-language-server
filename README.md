# ghdl-language-server

A language server for VHDL based on [GHDL](https://github.com/ghdl/ghdl). ghdl-language-server, which relies on [libghdl](https://github.com/ghdl/ghdl/tree/master/src/vhdl/python/libghdl) for parsing, implements a [Language Server Protocol (LSP)](https://en.wikipedia.org/wiki/Language_Server_Protocol) server in Python (3.x) and a client for VSC.

# ghdl-ls

## Requirements

> IMPORTANT: always use the latest version of GHDL. The Python binding, libghdl, ghdl-ls, etc. may have incompatible changes.

- Install [GHDL](https://github.com/ghdl/ghdl). Add `--enable-python` during configuration; this is needed so that the libraries are available.
- Install [libghdl](https://github.com/ghdl/ghdl/tree/master/src/vhdl/python/libghdl). After building GHDL, a tarball named `libghdl-py.tgz` should be available at the root. Install it with `pip install libghdl-py.tgz`.

## Install

Download subdir `ghdl-ls` from this repo, and execute: `pip install .`

- To install for development: `pip install -e .`
- Add `--user` to install in your home directory.

The executable is named `ghdl-ls`. It uses stdin/stdout to communicate with
its client.

# Visual Studio Code (VSC) Extension

Subdir `vscode-client` contains the sources of a VSC Extension; a LSP client that allows to have ghdl-ls integrated in VSC.

## Build

- Install `npm` or `yarn`.
- Install `vsce` through `npm install -g vsce` or `yarn global add vsce`.
- Download subdir `vscode-client` from this repo, and execute `vsce package`.
- The output is a file named `vhdl-lsp-*.vsix`.

## Install

- Though the command-line: `code --install-extension vhdl-lsp-*.vsix`.
- Graphically though [Install from VSIX...](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix).

## Issues

In case of crash of ghdl-ls, you should restart `code` with debugging enabled:

```bash
 $ DEBUG_GHDL_LS=1 code .

This makes `ghdl-ls` writing logs (`vhdl-ls.log`, `vhdl-ls.trace.in` and `vhdl-ls.trace.out`) which should be attached to the issue.
