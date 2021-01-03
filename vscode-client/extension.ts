/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions
} from 'vscode-languageclient/node';
import * as vscodelc from 'vscode-languageclient';

namespace ExtraRequest {
	export const ShowAllFiles =
		new vscodelc.RequestType0<any, void>('workspace/xShowAllFiles')
	export const GetAllEntities =
		new vscodelc.RequestType0<{name: string, library: string}[], void>('workspace/xGetAllEntities')
	export const GetEntityInterface =
		new vscodelc.RequestType<{name: string, library: string}, any, void>('workspace/xGetEntityInterface')
}

let client: LanguageClient;

class EntityItem implements vscode.QuickPickItem {
	label: string
	description: string
	library: string

	constructor(name : string, library: string) {
		this.label = name
		this.description = library + '.' + name
		this.library = library
	}
}

async function instantiate_entity() {
	await client.sendRequest(ExtraRequest.GetAllEntities)
	.then(ent => {
		if (!ent) {
			return;
		}
		let res = ent.map(e => new EntityItem(e.name, e.library))
		return vscode.window.showQuickPick(res)
	})
	.then(res => {
		return client.sendRequest(ExtraRequest.GetEntityInterface, {name: res.label, library: res.library})
	})
	.then(res => {
		let textEditor = vscode.window.activeTextEditor
		if (!textEditor)
			return
		let snippet = '${1:my_inst}: ' + `entity ${res.library}.${res.entity}`
		let placeholder_pos = 2
		function gen_interfaces(name: string, inters: [{name: string}]): string {
			if (!inters.length)
				return ''
			let isfirst = true
			let r = `\n  ${name} map (`
			for (let g of inters) {
				if (isfirst)
					isfirst = false
				else
					r += ','
				r += `\n    ${g.name} => \${${placeholder_pos}:${g.name}}`
				
				placeholder_pos += 1;
			}
			return r + '\n  )'
		}
		snippet += gen_interfaces('generic', res.generics)
		snippet += gen_interfaces('port', res.ports)
		snippet += ';'
		return textEditor.insertSnippet(new vscode.SnippetString(snippet))
		 //textEditor.edit((edit) => { edit.insert(textEditor.selection.active, res.description) })
	})
}

export function activate(context: vscode.ExtensionContext) {
	let serverPath = "ghdl-ls";

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: {
			command: serverPath,
			args: ['-v']
		},
		debug: {
			command: serverPath,
			args: ['-vvv', '--trace-file=vhdl-ls.trace']
		}
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for vhdl documents
		documentSelector: [{ scheme: 'file', language: 'vhdl' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	//  Force debugging
	let debug: boolean = vscode.workspace.getConfiguration().get('vhdl.debugLSP');

	// Create the language client and start the client.
	client = new LanguageClient(
		'vhdlLanguageServer',
		'VHDL Language Server',
		serverOptions,
		clientOptions,
		debug
	);

	// Start the client. This will also launch the server
	context.subscriptions.push(client.start());

	context.subscriptions.push(vscode.commands.registerCommand(
		'ghdl-ls.showallfiles', async () => {
			let oc = vscode.window.createOutputChannel('all-files');
			oc.clear();
			const files = await client.sendRequest(ExtraRequest.ShowAllFiles);
			if (!files) {
				return;
			}
			for (let f of files) {
				oc.append(`${f.fe}: name:${f.name}\n`);
				oc.append(`      dir:${f.dir}\n`);
				if (f.uri) {
					oc.append(`    uri: ${f.uri}\n`)
				}
			}
			oc.show();
		}
	))
	context.subscriptions.push(vscode.commands.registerCommand(
		'ghdl-ls.instantiate-entity', instantiate_entity))
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
