import * as vscode from 'vscode';
import { BookmarkStore, Bookmark } from './BookmarkStore';

export class BookmarkedItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly url: string
	) {
		super(label);
		this.command = {
			command: 'bookmarkSidebar.openBookmark',
			title: 'Open Tab',
			arguments: [url]
		};
		this.contextValue = 'BookmarkedItem'; // for context menu
	}
}

export class BookmarkTreeDataProvider implements vscode.TreeDataProvider<BookmarkedItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<BookmarkedItem | undefined> = new vscode.EventEmitter();
	readonly onDidChangeTreeData: vscode.Event<BookmarkedItem | undefined> = this._onDidChangeTreeData.event;

	private store: BookmarkStore;

	constructor(private context: vscode.ExtensionContext) {
		this.store = new BookmarkStore(context);
	}

	getTreeItem(element: BookmarkedItem): vscode.TreeItem {
		return element;
	}

    async getChildren(): Promise<BookmarkedItem[]> {
        const libs = this.store.getBookmarks();
        return libs.map(lib => new BookmarkedItem(lib.name, lib.url));
    }

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	async addBookmark() {
		const name = await vscode.window.showInputBox({ prompt: 'New bookmark content name' });
		const url = await vscode.window.showInputBox({ prompt: 'New bookmark content URL' });
        if (name?.trim() && url?.trim() && url.startsWith('http')) {
          await this.store.addBookmark({ name, url });
          this.refresh();
        } else {
          vscode.window.showErrorMessage('Invalid name or URL.');
        }
	}

	async removeBookmark(item: BookmarkedItem) {
		await this.store.removeBookmark(item.label);
		this.refresh();
	}
}