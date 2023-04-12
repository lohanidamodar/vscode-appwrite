import * as vscode from "vscode";
import { getActiveProjectId, getAppwriteProjects } from "../../settings";
import { ProjectTreeItem } from "./ProjectTreeItem";
import { projectsClient } from "../../client";

export class ProjectsTreeItemProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<
        vscode.TreeItem | undefined | void
    >();

    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration("appwrite")) {
                this.refresh();
            }
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(_element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        const projects = await projectsClient.list();
        if(projects.total == 0) {
            return [];
        }
        const activeProjectId = await getActiveProjectId();

        return projects.projects.map((proj) => new ProjectTreeItem(proj, proj.$id === activeProjectId));
        // const configs = await getAppwriteProjects();
        // if (configs === undefined || configs.length === 0) {
        //     return [];
        // }
        // return configs.map((config) => new ProjectTreeItem(config, config.projectId === activeProjectId));
    }
}
