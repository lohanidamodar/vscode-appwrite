import { window } from "vscode";
import { databases } from "../../client";
import { CollectionTreeItem } from "../../tree/database/CollectionTreeItem";
import { confirmDialog } from "../../ui/confirmDialog";

export async function deleteCollection(collectionTreeItem: CollectionTreeItem): Promise<void> {
    if (!databases) {
        return;
    }
    const collection = collectionTreeItem.collection;
    try {
        const shouldDelete = await confirmDialog(`Delete collection "${collection.name}"?`);
        const database = collectionTreeItem.parent.database;
        if (shouldDelete) {
            await databases.deleteCollection(database.$id, collection.$id);
            window.showInformationMessage(`Deleted collection "${collection.name}".`);
        }
    } catch (e) {
        window.showErrorMessage(e);
    }
}
