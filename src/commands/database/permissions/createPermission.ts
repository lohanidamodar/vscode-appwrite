import { window } from "vscode";
import { databases } from "../../../client";
import { PermissionsTreeItem } from "../../../tree/database/settings/PermissionsTreeItem";

export type CreatePermissionWizardContext = {
    kind: "read" | "write";
    permission: string;
};
export async function createPermissionWizard(kind?: "read" | "write"): Promise<CreatePermissionWizardContext | undefined> {
    const permissionKind = kind ?? (await window.showQuickPick(["read", "write"]));
    if (permissionKind && (permissionKind === "read" || permissionKind === "write")) {
        const permission = await window.showInputBox({ prompt: "Add * for wildcard access", placeHolder: "User ID, Team ID, or Role" });
        if (permission === undefined) {
            return undefined;
        }

        return {
            kind: permissionKind,
            permission,
        };
    }
    return undefined;
}

export async function createPermission(treeItem: PermissionsTreeItem): Promise<void> {
    if (!databases) {
        return;
    }

    const collection = treeItem.parent.collection;
    const context = await createPermissionWizard(undefined);

    if (context === undefined) {
        return;
    }

    const read = Array.from(collection.$permissions.read);
    const write = Array.from(collection.$permissions.write);

    if (context.kind === "read") {
        read.push(context.permission);
    } else {
        write.push(context.permission);
    }

    await databases.updatePermissions(collection, read, write);
}
