
import * as vscode from 'vscode';

// #region    --- Notification/Tracing

export function show_info(msg: string) {
	vscode.window.showInformationMessage(msg);
}

export function show_debug(msg: string | any[]) {
	const outputChannel = vscode.window.createOutputChannel("My Extension Details");

	let items: any[];
	if (typeof msg == "string") {
		items = msg.split("\n");
	} else {
		items = msg;
	}

	for (const item of items) {
		outputChannel.appendLine(item);
	}
	outputChannel.show(true);
}

// #endregion --- Notification/Tracing

// #region    --- Editor Activation

export async function show_editor_for_uri(uri: vscode.Uri) {
	const targetFsPath = uri.fsPath;

	// -- Try to find the active editor
	// let debug_msg = ""
	let col = 0;
	for (const group of vscode.window.tabGroups.all) {
		col += 1;
		// let fsPath = editor.document.uri.fsPath;
		for (const tab of group.tabs) {
			const tab_input = tab.input;
			if (!(tab_input instanceof vscode.TabInputText)) continue;

			// debug_msg += "\n== compare";
			// debug_msg += `\n         tab uri: ${tab_input.uri.fsPath}`;
			// debug_msg += `\n    targetFsPath: ${targetFsPath}`;

			const tab_fs_path = tab_input.uri.fsPath;
			if (tab_fs_path === targetFsPath) {
				// NOTE: Unfortunately, `tabGroups`/`group.activeTab` are read-only.
				//       So the way to work around it is to use the viewColumn which seems 
				//       to match the group idx+1, at least in most cases
				const text_doc = await vscode.workspace.openTextDocument(uri);
				vscode.window.showTextDocument(text_doc, { preview: false, preserveFocus: false, viewColumn: col });

				// debug_msg += "\n          OK MATCH!!!!";
				// show_debug(debug_msg);

				return; // we are done

			}
		}

	}
	// show_debug(debug_msg);


	// -- Open the editor for the targetFile

	const text_doc = await vscode.workspace.openTextDocument(uri);
	vscode.window.showTextDocument(text_doc);
}
// #endregion --- Editor Activation
