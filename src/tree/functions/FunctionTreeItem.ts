import { MarkdownString, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { ExecutionsTreeItem } from './executions/ExecutionsTreeItem';
import { FunctionsTreeItemProvider } from './FunctionsTreeItemProvider';
import { FunctionSettingsTreeItem } from './settings/FunctionSettingsTreeItem';
import { TagsTreeItem } from './tags/TagsTreeItem';
import { Models } from "node-appwrite";

export class FunctionTreeItem extends AppwriteTreeItemBase {
    constructor(public func: Models.Function, public readonly provider: FunctionsTreeItemProvider) {
        super(undefined, func.name);
        this.tooltip = new MarkdownString(`ID: ${func.$id}  \nLast updated: ${func.$updatedAt}  \nCreated: ${func.$createdAt}`);
        this.description = func.runtime;
    }

    public async getChildren(): Promise<TreeItem[]> {
        return [new FunctionSettingsTreeItem(this), new TagsTreeItem(this), new ExecutionsTreeItem(this)];
    }

    public async refresh(): Promise<void> {
        this.provider.refreshChild(this);
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "function";

    iconPath = new ThemeIcon("symbol-event");
}
