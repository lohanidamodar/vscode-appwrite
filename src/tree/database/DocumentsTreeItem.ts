import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { databases } from "../../client";
import { ext } from "../../extensionVariables";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import AppwriteCall from "../../utils/AppwriteCall";
import { CollectionTreeItem } from "./CollectionTreeItem";
import { DocumentTreeItem } from "./DocumentTreeItem";
import { Models } from "node-appwrite";

export class DocumentsTreeItem extends AppwriteTreeItemBase<CollectionTreeItem> {
    constructor(public readonly parent: CollectionTreeItem) {
        super(parent, "Documents");
        this.label = "Documents"
    }

    public async getChildren(): Promise<TreeItem[]> {
        if(databases === undefined) {
            return [];
        }
        const documentList = await AppwriteCall<Models.DocumentList<any>>(databases.listDocuments(this.parent.parent.database.$id, this.parent.collection.$id));
        if (documentList === undefined || documentList?.total === 0) {
            return [];
        }

        ext.outputChannel?.append(JSON.stringify(documentList, null, 4));

        const documentTreeItems = documentList.documents.map((document) => new DocumentTreeItem(this, document));
        const headerItem: TreeItem = {
            label: `Total documents: ${documentTreeItems?.length}`,
        };
        return [headerItem, ...documentTreeItems];
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "documents";

    iconPath = new ThemeIcon("database");
}
