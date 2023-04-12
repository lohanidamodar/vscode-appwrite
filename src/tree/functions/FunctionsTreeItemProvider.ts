import * as vscode from "vscode";
import { client, functions } from "../../client";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { ext } from "../../extensionVariables";
import { EventEmitter, TreeItem } from "vscode";
import { FunctionTreeItem } from "./FunctionTreeItem";
import { Models } from "node-appwrite";

export class FunctionsTreeItemProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: EventEmitter<TreeItem | undefined | void> = new EventEmitter<TreeItem | undefined | void>();

    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        ext.outputChannel?.appendLine("Refreshing functions tree provider...");
        this._onDidChangeTreeData.fire();
    }

    refreshChild(child: vscode.TreeItem): void {
        this._onDidChangeTreeData.fire(child);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(parent?: AppwriteTreeItemBase | TreeItem): Promise<vscode.TreeItem[]> {
        if (client === undefined) {
            return Promise.resolve([]);
        }

        if (parent === undefined) {

            const list: Models.FunctionList = await functions!.list();

            if (list) {
                const functionTreeItems = list.functions.map((func: Models.Function) => new FunctionTreeItem(func, this)) ?? [];
                return functionTreeItems;
            }

            return [{ label: "No functions found" }];
        }

        if (parent instanceof AppwriteTreeItemBase) {
            return await parent.getChildren?.() ?? [];
        }

        return [];
    }
}
