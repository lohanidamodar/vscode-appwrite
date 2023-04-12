import { window } from "vscode";
import { users } from "../../client";
import { UserTreeItem } from '../../tree/users/UserTreeItem';
import { DialogResponses } from "../../ui/DialogResponses";
import { refreshTree } from "../../utils/refreshTree";

export async function deleteUser(userTreeItem: UserTreeItem): Promise<void> {
    if (!users) {
        return;
    }
    const user = userTreeItem.user;
    const userId = user.$id;
    const shouldDeleteUser = await window.showWarningMessage(
        `Are you sure you want to delete user with email: "${user.email}"?`,
        {
            modal: true,
        },
        DialogResponses.yes,
        DialogResponses.cancel
    );

    if (shouldDeleteUser === DialogResponses.yes) {
            await users.delete(userId);
        refreshTree("users");
    }
}
