import { MarkdownString, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { databases } from "../../client";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { DatabaseTreeItemProvider } from "./DatabaseTreeItemProvider";
import { Models } from "node-appwrite";
import { CollectionsTreeItem } from "./CollectionsTreeItem";

export class DatabaseTreeItem extends AppwriteTreeItemBase {
    constructor(public database: Models.Database, public readonly provider: DatabaseTreeItemProvider) {
        super(undefined, database.name);
        this.tooltip = new MarkdownString(`ID: ${database.$id}  \nLast updated: ${database.$updatedAt}  \nCreated: ${database.$createdAt}`);
        this.description = database.name;
    }

    public async getChildren(): Promise<TreeItem[]> {
        return [new CollectionsTreeItem(this, this.database)];
    }

    public async refresh(): Promise<void> {
        if (!databases) {
            return;
        }
        this.database = (await databases.get(this.database.$id)) ?? this.database;
        this.provider.refreshChild(this);
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "database";

    iconPath = new ThemeIcon("disk");
}
