import * as vscode from "vscode";
import { client, users } from "../../client";
import AppwriteCall from "../../utils/AppwriteCall";
import { ThemeIcon } from "vscode";
import { UserPrefsTreeItem } from "./properties/UserPrefsTreeItem";
import { ChildTreeItem } from "../ChildTreeItem";
import { UserTreeItem } from "./UserTreeItem";
import { Models } from "node-appwrite";


export class UserTreeItemProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<UserTreeItem | undefined | void> = new vscode.EventEmitter<
        UserTreeItem | undefined | void
    >();

    readonly onDidChangeTreeData: vscode.Event<UserTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: UserTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: UserTreeItem): Promise<vscode.TreeItem[]> {
        if (client === undefined) {
            return Promise.resolve([]);
        }

        if (element instanceof UserTreeItem) {
            const regDate = new Date(element.user.registration);
            const items: vscode.TreeItem[] = [
                new ChildTreeItem(element, {
                    contextValue: "user.name",
                    label: element.user.name || "Unfilled",
                    iconPath: new ThemeIcon("person"),
                    description: "Name",
                }),
                new ChildTreeItem(element, {
                    contextValue: "user.email",
                    label: element.user.email,
                    iconPath: new ThemeIcon("mail"),
                    description: "Email",
                }),
                new ChildTreeItem(element, {
                    contextValue: "user.registration",
                    label: regDate.toDateString(),
                    iconPath: new vscode.ThemeIcon("calendar"),
                    description: "Joined",
                }),
                new ChildTreeItem(element, {
                    label: element.user.$id,
                    description: "User ID",
                    iconPath: new vscode.ThemeIcon("key"),
                    contextValue: "user.id",
                }),
                new UserPrefsTreeItem(element),
            ];
            return Promise.resolve(items);
        }

        const usersList = await AppwriteCall<Models.UserList<any>, Models.UserList<any>>(users!.list());
        if (usersList) {
            const userTreeItems = usersList.users.map((user: Models.User<any>) => new UserTreeItem(user)) ?? [];
            const headerItem: vscode.TreeItem = {
                label: `Total users: ${usersList.total}`,
            };
            return [headerItem, ...userTreeItems];
        }

        return [{ label: "No users found" }];
    }
}
