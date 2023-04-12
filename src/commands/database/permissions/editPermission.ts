import { window } from "vscode";
import { databases } from "../../../client";
import { PermissionTreeItem } from "../../../tree/database/settings/PermissionTreeItem";

export async function editPermission(treeItem: PermissionTreeItem): Promise<void> {
    if (!databases) {
        return;
    }
    const editedPermission = await window.showInputBox({
        value: treeItem.permission,
    });

    if (editedPermission === undefined) {
        return;
    }

    const collection = treeItem.parent.parent.collection;
    const kind = treeItem.kind;

    let read = Array.from(collection.$permissions.read);
    let write = Array.from(collection.$permissions.write);

    if (kind === "read") {
        read = read.filter((item) => item !== treeItem.permission);
        read.push(editedPermission);
    } else {
        write = write.filter((item) => item !== treeItem.permission);
        write.push(editedPermission);
    }

    await databases.updatePermissions(collection, read, write);
}
