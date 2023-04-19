import { Models } from "node-appwrite";
import { ThemeIcon, TreeItem } from "vscode";

export class FileTreeItem extends TreeItem {
    constructor(public readonly file: Models.File) {
        super(file.name);
    }

    iconPath = new ThemeIcon("file");

    contextValue = "file";
}
