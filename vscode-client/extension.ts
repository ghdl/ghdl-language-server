/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions
} from 'vscode-languageclient';
import * as vscodelc from 'vscode-languageclient';

namespace ShowAllFilesRequest {
	export const type =
		new vscodelc.RequestType0<any, void, void>('workspace/xShowAllFiles');
}

let client: LanguageClient;

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
			args: ['-v', '--log-file=vhdl-ls.log', '--trace-file=vhdl-ls.trace']
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
	let debug: boolean = process.env.DEBUG_GHDL_LS != undefined

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
			const files = await client.sendRequest(
				ShowAllFilesRequest.type);
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
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
