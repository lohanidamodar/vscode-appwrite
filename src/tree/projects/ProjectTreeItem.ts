import { ThemeIcon, TreeItem } from "vscode";
import { AppwriteProjectConfiguration } from "../../settings";
import type{ Models } from "@appwrite.io/console";

export class ProjectTreeItem extends TreeItem {
    constructor(public readonly project: Models.Project, active: boolean) {
        super("Project");
        this.iconPath = new ThemeIcon("rocket");
        const name = project.name;
        this.label = `${name} ${active ? "(Active)" : ""}`;
        this.contextValue = `appwriteProject${active ? "_active" : ""}`;
        if (!active) {
            this.command = { command: "vscode-appwrite.setActiveProject", title: "Set active", arguments: [this] };
        }
    }
}
