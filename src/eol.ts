import * as vscode from 'vscode';

const ENDINGS = {
	eol_scolon: ";",
	eol_question_scolon: "?;",
	eol_await_scolon: ".await;",
	eol_await_question_scolon: ".await?;",
}
type EolType = keyof typeof ENDINGS;

type Fn = (...args: any[]) => any;

export function make_eol_cmd_fn(type: EolType): Fn {

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

export function cmd_eol_comma() {

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('No open text editor');
		return;
	}

	const document = editor.document;
	const sels = editor.selections;

	const edit = new vscode.WorkspaceEdit();
	for (const sel of sels) {
		const line = document.lineAt(sel.active.line);
		const lineText = line.text;
		const ending = ",";

		if (!lineText.endsWith(ending)) {
			const position = line.range.end;
			edit.insert(document.uri, position, ending);
		}
	}

	vscode.workspace.applyEdit(edit);

	// now move selection to the end
	move_selection_cursors_to_end(editor);
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
	move_selection_cursors_to_end(editor);
}

function move_selection_cursors_to_end(editor: vscode.TextEditor) {
	const document = editor.document;
	const sels = editor.selections;
	const eol_sels: vscode.Selection[] = [];
	for (const sel of sels) {
		const newLine = document.lineAt(sel.active.line);
		const endOfLinePosition = new vscode.Position(sel.active.line, newLine.text.length);
		const eol_sel = new vscode.Selection(endOfLinePosition, endOfLinePosition);
		eol_sels.push(eol_sel);
	}
	editor.selections = eol_sels;

	// Optionally, show/scroll the last line
	// editor.revealRange(new vscode.Range(endOfLinePosition, endOfLinePosition));
}

// #endregion --- Support