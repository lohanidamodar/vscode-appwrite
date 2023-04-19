import * as vscode from "vscode";
import { storage, client } from "../../client";
import { BucketTreeItem } from "./BucketTreeItem";
import { ext } from "../../extensionVariables";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";

export class StorageTreeItemProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<
        BucketTreeItem | undefined | void
    >();

    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    refreshChild(child: vscode.TreeItem): void {
        this._onDidChangeTreeData.fire(child);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(parent?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        ext.outputChannel?.appendLine('getChildren for: ' + parent?.label);
        if (client === undefined) {
            return Promise.resolve([]);
        }

        if (parent instanceof AppwriteTreeItemBase) {
            return await parent.getChildren?.() ?? [];
        }
        if (storage === undefined) {
            return [];
        }

        const buckets = await storage.listBuckets();
        if (buckets === undefined || buckets?.buckets.length === 0) {
            const noStorage = new vscode.TreeItem("No Buckets found");
            return [noStorage];
        }
        const bucketTreeItems =  buckets.buckets.map((bucket) => new BucketTreeItem(bucket, this));
        const headerItem: vscode.TreeItem = {
            label: `Total Buckets: ${buckets.total}`,
        };
        return [headerItem, ...bucketTreeItems];
    }
}
