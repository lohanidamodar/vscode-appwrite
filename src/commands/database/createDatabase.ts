import { window } from "vscode";
import { databases } from "../../client";
import { ID } from "node-appwrite";

export async function createDatabase(): Promise<void> {
    if (!databases) {
        return;
    }

    const name = await window.showInputBox({
        prompt: "Database name",
    });

    if (name && name.length > 0) {
        await databases.create(ID.unique(), name);
        window.showInformationMessage(`Created Database "${name}".`);
    }
}
