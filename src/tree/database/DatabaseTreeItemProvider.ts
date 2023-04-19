import * as vscode from "vscode";
import { client, databases } from "../../client";
import AppwriteCall from "../../utils/AppwriteCall";
import { ext } from '../../extensionVariables';
import { AppwriteTreeItemBase } from '../../ui/AppwriteTreeItemBase';
import { Models } from "node-appwrite";
import { DatabaseTreeItem } from "./DatabaseTreeItem";

export class DatabaseTreeItemProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<
        DatabaseTreeItem | undefined | void
    >();

    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        ext.outputChannel?.appendLine('refresh database');
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
        if(databases === undefined) {
            return [];
        }

        const databaseList = await AppwriteCall<Models.DatabaseList, Models.DatabaseList>(databases.list());
        if (databaseList) {
            const databaseTreeItems = databaseList.databases.map((database: Models.Database) => new DatabaseTreeItem(database, this)) ?? [];
            const headerItem: vscode.TreeItem = {
                label: `Total Databases: ${databaseList.total}`,
            };
            return [headerItem, ...databaseTreeItems];
        }

        return [{ label: "No Databases found" }];
    }
}
