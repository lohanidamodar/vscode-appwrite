import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { DatabaseTreeItem } from "./DatabaseTreeItem";
import { Models } from "node-appwrite";
import { CollectionTreeItem } from "./CollectionTreeItem";
import AppwriteCall from "../../utils/AppwriteCall";
import { databases } from "../../client";

export class CollectionsTreeItem extends AppwriteTreeItemBase<DatabaseTreeItem> {
    constructor(public readonly parent: DatabaseTreeItem,  public readonly database: Models.Database) {
        super(parent, "Collections: " + database.name);
        this.tooltip = "Collections of "+ database.name;
        this.label = "Collections";
    }

    public async getChildren(): Promise<TreeItem[]> {
        const collectionList = await AppwriteCall<Models.CollectionList, Models.CollectionList>(databases!.listCollections(this.parent.database.$id));
        if (collectionList && collectionList.total > 0) {
            const collectionTreeItems = collectionList.collections.map((collection: Models.Collection) => new CollectionTreeItem(this, collection)) ?? [];
            const headerItem: TreeItem = {
                label: `Total Collections: ${collectionList.total}`,
            };
            return [headerItem, ...collectionTreeItems];
        }
        return [{ label: "No collections found" }];
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "collections";

    iconPath = new ThemeIcon("folder");
}
