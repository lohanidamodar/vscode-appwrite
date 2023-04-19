import { MarkdownString, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { storage } from "../../client";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { Models } from "node-appwrite";
import { StorageTreeItemProvider } from "./StorageTreeItemProvider";
import { FilesTreeItem } from "./FilesTreeItem";

export class BucketTreeItem extends AppwriteTreeItemBase {
    constructor(public bucket: Models.Bucket, public readonly provider: StorageTreeItemProvider) {
        super(undefined, bucket.name);
        this.tooltip = new MarkdownString(`ID: ${bucket.$id}  \nLast updated: ${bucket.$updatedAt}  \nCreated: ${bucket.$createdAt}`);
        this.description = bucket.name;
    }

    public async getChildren(): Promise<TreeItem[]> {
        return [new FilesTreeItem(this, this.bucket)];
    }

    public async refresh(): Promise<void> {
        if (!storage) {
            return;
        }
        this.bucket = (await storage.getBucket(this.bucket.$id)) ?? this.bucket;
        this.provider.refreshChild(this);
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "bucket";

    iconPath = new ThemeIcon("disk");
}
