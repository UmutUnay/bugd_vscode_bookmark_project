import * as vscode from 'vscode';
import { BookmarkTreeDataProvider } from './BookmarkTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {
	const provider = new BookmarkTreeDataProvider(context);
	vscode.window.registerTreeDataProvider('bookmarkSidebar', provider);

	context.subscriptions.push(
		vscode.commands.registerCommand('bookmarkSidebar.openBookmark', (url: string) => {
			vscode.env.openExternal(vscode.Uri.parse(url));
		}),
		vscode.commands.registerCommand('bookmarkSidebar.addBookmark', () => provider.addBookmark()),
		vscode.commands.registerCommand('bookmarkSidebar.removeBookmark', (item) => provider.removeBookmark(item))
	);
}