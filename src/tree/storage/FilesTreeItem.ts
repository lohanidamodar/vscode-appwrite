import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { Models } from "node-appwrite";
import AppwriteCall from "../../utils/AppwriteCall";
import { storage } from "../../client";
import { BucketTreeItem } from "./BucketTreeItem";
import { FileTreeItem } from "./FileTreeItem";

export class FilesTreeItem extends AppwriteTreeItemBase<BucketTreeItem> {
    constructor(public readonly parent: BucketTreeItem,  public readonly bucket: Models.Bucket) {
        super(parent, "Files: " + bucket.name);
        this.tooltip = "Files of "+ bucket.name;
        this.label = "Files";
    }

    public async getChildren(): Promise<TreeItem[]> {
        if(storage === undefined) {return [];}
        const filesList = await AppwriteCall<Models.FileList, Models.FileList>(storage.listFiles(this.parent.bucket.$id));
        if (filesList && filesList.total > 0) {
            const fileTreeItem = filesList.files.map((file: Models.File) => new FileTreeItem(file)) ?? [];
            const headerItem: TreeItem = {
                label: `Total Files: ${filesList.total}`,
            };
            return [headerItem, ...fileTreeItem];
        }
        return [{ label: "No Files found" }];
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "files";

    iconPath = new ThemeIcon("folder");
}
