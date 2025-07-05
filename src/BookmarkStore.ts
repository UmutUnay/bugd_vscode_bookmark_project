import * as vscode from 'vscode';

export interface Bookmark {
  name: string;
  url: string;
  // Can add a little icon later
}

const STORAGE_KEY = 'bookmarkList';

export class BookmarkStore {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getBookmarks(): Bookmark[] {
    return this.context.globalState.get<Bookmark[]>(STORAGE_KEY, []);
  }

  async addBookmark(newBm: Bookmark): Promise<void> {
    const bookmarkList = this.getBookmarks();
    bookmarkList.push(newBm);
    await this.context.globalState.update(STORAGE_KEY, bookmarkList);
  }

  async removeBookmark(toBeDeletedName: string): Promise<void> {
    const bookmarkList = this.getBookmarks().filter(bm => bm.name !== toBeDeletedName);
    await this.context.globalState.update(STORAGE_KEY, bookmarkList);
  }

  async setBookmark(bookmarkList: Bookmark[]): Promise<void> {
    await this.context.globalState.update(STORAGE_KEY, bookmarkList);
  }
}