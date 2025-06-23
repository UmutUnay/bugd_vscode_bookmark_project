"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkStore = void 0;
const STORAGE_KEY = 'bookmarkList';
class BookmarkStore {
    constructor(context) {
        this.context = context;
    }
    getBookmarks() {
        return this.context.globalState.get(STORAGE_KEY, []);
    }
    async addBookmark(newBm) {
        const bookmarkList = this.getBookmarks();
        bookmarkList.push(newBm);
        await this.context.globalState.update(STORAGE_KEY, bookmarkList);
    }
    async removeBookmark(toBeDeletedName) {
        const bookmarkList = this.getBookmarks().filter(bm => bm.name !== toBeDeletedName);
        await this.context.globalState.update(STORAGE_KEY, bookmarkList);
    }
    async setBookmark(bookmarkList) {
        await this.context.globalState.update(STORAGE_KEY, bookmarkList);
    }
}
exports.BookmarkStore = BookmarkStore;
