"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkTreeDataProvider = exports.BookmarkedItem = void 0;
const vscode = __importStar(require("vscode"));
const BookmarkStore_1 = require("./BookmarkStore");
class BookmarkedItem extends vscode.TreeItem {
    constructor(label, url) {
        super(label);
        this.label = label;
        this.url = url;
        this.command = {
            command: 'bookmarkSidebar.openBookmark',
            title: 'Open Tab',
            arguments: [url]
        };
        this.contextValue = 'BookmarkedItem'; // for context menu
    }
}
exports.BookmarkedItem = BookmarkedItem;
class BookmarkTreeDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.store = new BookmarkStore_1.BookmarkStore(context);
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren() {
        const libs = this.store.getBookmarks();
        return libs.map(lib => new BookmarkedItem(lib.name, lib.url));
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    async addBookmark() {
        const name = await vscode.window.showInputBox({ prompt: 'New bookmark content name' });
        const url = await vscode.window.showInputBox({ prompt: 'New bookmark content URL' });
        if (name?.trim() && url?.trim() && url.startsWith('http')) {
            await this.store.addBookmark({ name, url });
            this.refresh();
        }
        else {
            vscode.window.showErrorMessage('Invalid name or URL.');
        }
    }
    async removeBookmark(item) {
        await this.store.removeBookmark(item.label);
        this.refresh();
    }
}
exports.BookmarkTreeDataProvider = BookmarkTreeDataProvider;
