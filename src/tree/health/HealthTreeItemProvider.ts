import * as vscode from "vscode";
import { health } from "../../client";
import { ext } from "../../extensionVariables";
import { HealthTreeItem } from "./HealthTreeItem";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import { healthTooltips } from "../../appwrite/Health";
import { promiseWithTimeout } from "../../utils/promiseWithTimeout";
import { Models } from "node-appwrite";
// dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export class HealthTreeItemProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<HealthTreeItem | undefined | void> = new vscode.EventEmitter<
        HealthTreeItem | undefined | void
    >();

    private lastChecked: Date = new Date();

    readonly onDidChangeTreeData: vscode.Event<HealthTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: HealthTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: HealthTreeItem): Promise<vscode.TreeItem[]> {
        if (health === undefined) {
            return [];
        }

        // get children for root
        if (element === undefined) {
            try {
                const res = await promiseWithTimeout<Partial<Models.HealthStatus> | undefined>(
                    10000,
                    async () => {
                        try {
                            return await health?.get();
                        } catch (e) {
                            ext.outputChannel?.append('Error: ' + e.message);
                            vscode.window.showErrorMessage('Could not connect to Appwrite project');
                        }
                    },
                    "Health request timed out"
                );
                if (health === undefined) {
                    return [];
                }
                ext.outputChannel?.append(JSON.stringify(health, null, 4));
                const healthItems = Object.entries(health).map(([service, status]) => {
                    return new HealthTreeItem(service, status) // , healthTooltips[service as keyof Models.HealthStatus]);
                });
                this.lastChecked = new Date();
                return [
                    {
                        label: `Updated at ${dayjs(this.lastChecked).format("LTS")}`,
                    },
                    ...healthItems,
                ];
            } catch (e) {
                //
            }
        }
        return [];
    }
}
