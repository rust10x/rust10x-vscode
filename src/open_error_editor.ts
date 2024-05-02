import * as Path from "path";
import * as vscode from 'vscode';

import { show_debug, show_editor_for_uri } from './utils';

export async function cmd_open_error_rs() {
	const current_path = vscode.window.activeTextEditor?.document.uri.fsPath;
	if (current_path == null) return;

	const rel_error_path = await find_related_error_path(current_path);

	if (rel_error_path != null) {
		const uri = vscode.Uri.file(rel_error_path);
		await show_editor_for_uri(uri);
	}

}

async function find_related_error_path(ref_path: string): Promise<string | null> {
	let files = await find_error_files();

	// -- get dirs from files
	const dirs = files.map(f => Path.dirname(f));
	// 
	let max_len = 0;
	let found_path: string | null = null;
	for (const dir of dirs) {
		const dir_len = dir.length
		if (ref_path.startsWith(dir) && dir_len > max_len) {
			max_len = dir_len;
			found_path = Path.join(dir, "error.rs");
		}
	}
	return found_path;

}

async function find_error_files(): Promise<string[]> {
	let workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (workspaceFolder == null) {
		return [];
	}
	// TODO: probably need to fix the `/` for windows, 
	//       and add prefix relative to the closest dir that contains a Cargo.toml (to supports cargo workspace)
	let searchPattern = new vscode.RelativePattern(workspaceFolder, `**/error.rs`);
	return (await vscode.workspace.findFiles(searchPattern, null)).map(uri => uri.fsPath);
}