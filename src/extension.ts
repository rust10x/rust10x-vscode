import * as vscode from 'vscode';

const ENDINGS = {
	eol_scolon: ";",
	eol_question_scolon: "?;",
	eol_await_scolon: ".await;",
	eol_await_question_scolon: ".await?;",
}
type EolType = keyof typeof ENDINGS;

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
}

export function deactivate() { }
type Fn = (...args: any[]) => any;

function make_eol_cmd_fn(type: EolType): Fn {

	function eol_scolon_applier(document: vscode.TextDocument, selection: vscode.Selection, edit: vscode.WorkspaceEdit) {
		const line = document.lineAt(selection.active.line);
		const lineText = line.text;
		const match = findLongestMatch(lineText);
		const ending = ENDINGS[type];

		if (match == null) {
			const position = line.range.end;
			edit.insert(document.uri, position, ending);
		} else if (match.value != ending) {
			let newText = lineText.slice(0, -1 * match.value.length) + ending;
			const lineRange = line.range;
			edit.replace(document.uri, lineRange, newText);
		}
	}

	return function () {
		apply_for_each(eol_scolon_applier)
	}

}

// #region    --- Support

interface MatchResult {
	value: string;
	key: string;
}

function findLongestMatch(input: string): MatchResult | null {
	let endings = ENDINGS;

	let longestMatch: MatchResult | null = null;

	Object.entries(endings).forEach(([key, value]) => {
		if (input.endsWith(value)) {
			// If a match is found and it is longer than the current longest match, update longestMatch
			if (!longestMatch || value.length > longestMatch.value.length) {
				longestMatch = { value: value, key };
			}
		}
	});

	return longestMatch;
}


type ApplierFn = (document: vscode.TextDocument, selection: vscode.Selection, edit: vscode.WorkspaceEdit) => void;

function apply_for_each(applier: ApplierFn) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('No open text editor');
		return;
	}

	const document = editor.document;
	const selections = editor.selections;

	const edit = new vscode.WorkspaceEdit();

	selections.forEach((selection) => {
		applier(document, selection, edit)
	});
	vscode.workspace.applyEdit(edit);

	// now move selection to the end
	const sels = editor.selections;
	for (const sel of sels) {
		const newLine = document.lineAt(sel.active.line);
		const endOfLinePosition = new vscode.Position(sel.active.line, newLine.text.length);

		editor.selection = new vscode.Selection(endOfLinePosition, endOfLinePosition);
		editor.revealRange(new vscode.Range(endOfLinePosition, endOfLinePosition));
	}

}

// #endregion --- Support