import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { DatabaseTreeItemProvider } from "./DatabaseTreeItemProvider";
import { DocumentsTreeItem } from "./DocumentsTreeItem";
import { PermissionsTreeItem } from "./settings/PermissionsTreeItem";
import { RulesTreeItem } from "./settings/RulesTreeItem";
import { DatabaseTreeItem } from "./DatabaseTreeItem";
import { CollectionsTreeItem } from "./CollectionsTreeItem";
import { Models } from "node-appwrite";

export class CollectionTreeItem extends AppwriteTreeItemBase<CollectionsTreeItem> {
    constructor(public readonly parent: CollectionsTreeItem, public readonly collection: Models.Collection) {
        super(parent, collection.name);
        this.label = collection.name;
    }

    public async getChildren(): Promise<TreeItem[]> {
        return [new DocumentsTreeItem(this)];
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "collection";

    iconPath = new ThemeIcon("folder");
}
