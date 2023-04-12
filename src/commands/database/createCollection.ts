import { QuickPickItem, window } from "vscode";
import { databases } from "../../client";
import { ID } from "node-appwrite";

export async function createCollection(): Promise<void> {
    if (!databases) {
        return;
    }
    const databaseList = await databases.list();
        if (databaseList === undefined) {
            return;
        }
        const pick = await window.showQuickPick(
            databaseList.databases.map<QuickPickItem>(
                (database): QuickPickItem => ({ label: database.name, description: database.name, detail: database.$id })
            ),
            { placeHolder: "Select a database to create collection" }
        );
        if (pick === undefined || pick.detail === undefined) {
            return;
        }
    const name = await window.showInputBox({
        prompt: "Collection name",
    });

    if (name && name.length > 0) {
        await databases.createCollection(pick.detail, ID.unique(), name);
        window.showInformationMessage(`Created collection "${name}".`);
    }
}
