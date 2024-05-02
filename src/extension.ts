import * as vscode from 'vscode';
import { cmd_eol_comma, make_eol_cmd_fn } from './eol';
import { cmd_open_error_rs } from './open_error_editor';

export function activate(context: vscode.ExtensionContext) {
	// -- eol_scolon
	let disposable = vscode.commands.registerCommand('rust10x.eol_scolon', make_eol_cmd_fn("eol_scolon"));
	context.subscriptions.push(disposable);

	// -- eol_question_scolon
	disposable = vscode.commands.registerCommand('rust10x.eol_question_scolon', make_eol_cmd_fn("eol_question_scolon"));
	context.subscriptions.push(disposable);

	// -- eol_await_scolon
	disposable = vscode.commands.registerCommand('rust10x.eol_await_scolon', make_eol_cmd_fn("eol_await_scolon"));
	context.subscriptions.push(disposable);

	// -- rust10x.eol_await_question_scolon
	disposable = vscode.commands.registerCommand('rust10x.eol_await_question_scolon', make_eol_cmd_fn("eol_await_question_scolon"));
	context.subscriptions.push(disposable);

	// -- rust10x.eol_comma
	disposable = vscode.commands.registerCommand('rust10x.eol_comma', cmd_eol_comma);
	context.subscriptions.push(disposable);

	// -- rust10x.open_error
	disposable = vscode.commands.registerCommand('rust10x.open_error_rs', cmd_open_error_rs);
	context.subscriptions.push(disposable);
}

export function deactivate() { }

