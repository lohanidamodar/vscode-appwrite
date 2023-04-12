import { window } from "vscode";
import { databases } from "../../client";
import { DocumentTreeItem } from "../../tree/database/DocumentTreeItem";
import { confirmDialog } from "../../ui/confirmDialog";

export async function deleteDocument(documentTreeItem: DocumentTreeItem): Promise<void> {
    if (!databases) {
        return;
    }
    const document = documentTreeItem.document;
    const collection = documentTreeItem.parent.parent.collection;
    try {
        const shouldDelete = await confirmDialog(`Delete document "${document["$id"]}" from ${collection.name}?`);
        if (shouldDelete) {
            await databases.deleteDocument(collection.$id, document["$id"]);
            window.showInformationMessage(`Deleted document "${document["$id"]}" from ${collection.name}.`);
        }
    } catch (e) {
        window.showErrorMessage(e);
    }
}
