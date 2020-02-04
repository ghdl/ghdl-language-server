A [Language Server Protocol (LSP)](https://en.wikipedia.org/wiki/Language_Server_Protocol) server for VHDL based on [GHDL](https://github.com/ghdl/ghdl), and a client for Visual Studio Code (VSC). The LSP server can be integrated in other text editors or IDES, such as, Vim, Emacs, Atom or Theia. Contributions are welcome!

# ghdl-ls

Subdir `ghdl-ls` contains the sources of a LSP server for VHDL written in Python (3.x), which relies on [libghdl](https://github.com/ghdl/ghdl/tree/master/src/vhdl/python/libghdl) for analysis.

## Requirements

> IMPORTANT:
>
> Always use the latest version of GHDL. The Python binding, libghdl, ghdl-ls, etc. may have incompatible changes.

- Build and install [GHDL](https://github.com/ghdl/ghdl). Building the shared library `libghdl` is enabled by default.
- Install [libghdl-py](https://github.com/ghdl/ghdl/tree/master/src/vhdl/python/libghdl). For example:

``` bash
mkdir libghdl-py
cd libghdl-py
curl -fsSL https://codeload.github.com/ghdl/ghdl/tar.gz/master | tar xzf - --strip-components=2 ghdl-master/python

pip3 install .
# or
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

## Install

Download subdir `ghdl-ls` from this repo and install it. For example:

``` bash
mkdir ghdl-ls
cd ghdl-ls
curl -fsSL https://codeload.github.com/ghdl/ghdl-language-server/tar.gz/master | tar xzf - --strip-components=2 ghdl-language-server-master/ghdl-ls

pip3 install .
# or
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

> HINT:
> - To install for development: `pip install -e .`
> - Add `--user` to install in your home directory.

## Usage

The executable is named `ghdl-ls`. It uses stdin/stdout to communicate with
its client.

The language server will require a project file named `hdl-prj.json` which will provide all required options to run GHDL analysis :
 - All options to pass to `ghdl -a` (the analysis step)
 - Your project fileset

An example of `hdl-prj.json` file could be :
```json
{
    "options": {
        "ghdl_analysis": [
            "--workdir=work",
            "--ieee=synopsys",
            "-fexplicit"
        ]
    },
    "files": [
        { "file": "rtl/core.vhd",           "language": "vhdl" },
        { "file": "assembly/core_fpga.vhd", "language": "vhdl" },
        { "file": "sim/tb_core.vhd",        "language": "vhdl" }
    ]
}
```

You will find all valid options in the GHDL documentation in the [options to invoke GHDL](https://ghdl.readthedocs.io/en/latest/using/InvokingGHDL.html#options).

# Visual Studio Code (VSC) Extension

<p align="center">
  <a title="vscode-client Dependency Status" href="https://david-dm.org/ghdl/ghdl-language-server?path=vscode-client"><img src="https://img.shields.io/david/ghdl/ghdl-language-server.svg?path=vscode-client&longCache=true&style=flat-square&label=deps"></a><!--
  -->
  <a title="vscode-client DevDependency Status" href="https://david-dm.org/ghdl/ghdl-language-server?path=vscode-client&type=dev"><img src="https://img.shields.io/david/dev/ghdl/ghdl-language-server.svg?path=vscode-client&longCache=true&style=flat-square&label=devdeps"></a><!--
  -->
</p>

Subdir `vscode-client` contains the sources of a VSC Extension; a LSP client that allows to have ghdl-ls integrated in VSC.

## Build

> HINT: On debian, installing `npm` from repositories (`sudo apt install npm`) will probably install an outdated version of npm with regard to Node.js version. This will make any npm install operation fail.
>
> Therefore, you will need to upgrade `npm` using `sudo npm install -g npm@latest` and restart your terminal before going further

- Install `npm` or `yarn`.
- Install `vsce` through `npm install -g vsce` or `yarn global add vsce`.
- Get the sources. For example: `curl -fsSL https://codeload.github.com/ghdl/ghdl-language-server/tar.gz/master | tar xzf - --strip-components=2 ghdl-language-server-master/vscode-client`
- The first time, execute `npm install` or `yarn` to install package dependencies.
- Execute `vsce package` or `vsce package --yarn`.
- The output is a file named `vhdl-lsp-*.vsix`.

## Install

- Through the command-line: `code --install-extension vhdl-lsp-*.vsix`.
- Graphically through [Install from VSIX...](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix).

> HINT:
>
> VSIX files are actually ZIP files. Hence, it is possible to install an extension by extracting the content to a suitable location. This is useful in the context of the [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview) feature; which is a [NOT Open Source](https://code.visualstudio.com/docs/remote/faq#_why-arent-the-remote-development-extensions-or-their-components-open-source) component that is *"installed and updated automatically by VS Code when it connects to an endpoint"* and which cannot be used with any other client (see [Can VS Code Server be installed or used on its own?](https://code.visualstudio.com/docs/remote/faq#_can-vs-code-server-be-installed-or-used-on-its-own)).
>
> In order to pre-install a VSIX extension in a remote host or a docker image/container where VSC is not available, just extract it to `$HOME/.vscode-server/extensions`. For example:
>
> ``` bash
> cd $(dirname $0)
> vsix_file="$(ls vhdl-lsp-*.vsix)"
> vsc_exts="$HOME/.vscode-server/extensions"
> mkdir -p $vsc_exts
> unzip "$vsix_file"
> rm [Content_Types].xml
> mv extension.vsixmanifest extension/.vsixmanifest
> mv extension "$vsc_exts/tgingold.${vsix_file%.*}"
> ```

## Issues and bug reports

In case of crash of ghdl-ls, you should restart `code` with debugging enabled:

```bash
 $ DEBUG_GHDL_LS=1 code .
```

This makes `ghdl-ls` write logs (`vhdl-ls.log`, `vhdl-ls.trace.in` and `vhdl-ls.trace.out`) which should be attached to the issue.

# Ready-to-use Docker images

In the Continuous Integration (CI) pipeline of [ghdl/docker](https://github.com/ghdl/docker), some images are generated which include `ghdl-ls` and `vsce-client`. These are uploaded to [ghdl/ext:*](https://hub.docker.com/r/ghdl/ext/tags) at [hub.docker.com/u/ghdl](https://cloud.docker.com/u/ghdl/repository/list).

- `ghdl/ext:ls-debian`: based on Debian Buster, it contains Python 3, GHDL, libghdl-py, ghdl-ls and vscode-client.
  - `ghdl/ext:latest`: based on `ls-debian`, it contains VUnit and GtkWave too.
- `ghdl/ext:ls-ubuntu`: based on Ubuntu Bionic, it contains the same tools as `ls-debian`.

All of these can be used with VSC's 'Remote - Containers' Extension as follows:

- Start a container: `docker run --name ghdl-ls --rm -d ghdl/ext:latest bash -c "/opt/ghdl/install_vsix.sh && tail -f /dev/null"`
- In VSC, go to `Remote-Containers: Attach to Running Container...` and select the container named `ghdl-ls`.
  - Alternatively, if you have the 'Docker' extension installed, just go to the list of running containers and right-click on it.
- Wait until the new window is loaded and have fun!

> HINT:
>
> - There are some example VHDL files in /tmp/files.
> - All the terminals you open in VSC will be inside the container.
> - In order to use gtkwave, the container must have access to some X server. [x11docker](https://github.com/mviereck/x11docker) and/or [runx](https://github.com/mviereck/runx) can be helpful in this context.

# Emacs extension

Subdir `emacs-client` contains instructions and an example configuration init file for use with emacs, including a LSP client that allows to have ghdl-ls integrated in Emacs.
