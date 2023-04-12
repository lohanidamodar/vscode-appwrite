import { ProgressLocation, QuickPickItem, Uri, window, workspace } from "vscode";
import { functions } from "../../client";
import { getTarReadStream } from "../../utils/tar";
import { ext } from "../../extensionVariables";
import * as fs from "fs";
import { TagsTreeItem } from "../../tree/functions/tags/TagsTreeItem";
import { selectWorkspaceFolder } from "../../utils/workspace";
import { ProgressMessage } from "../../utils/types";
import { activateTag } from "./activateTag";
import { InputFile, Models } from "node-appwrite";

export async function createTag(item?: TagsTreeItem | Uri): Promise<void> {
    if (item instanceof Uri) {
        const functionList = await functions?.list();
        if (functionList === undefined) {
            return;
        }
        const pick = await window.showQuickPick(
            functionList.functions.map<QuickPickItem>(
                (func): QuickPickItem => ({ label: func.name, description: func.runtime, detail: func.$id })
            ),
            { placeHolder: "Select a function to create tag" }
        );
        if (pick === undefined || pick.detail === undefined) {
            return;
        }
        const deployments = await functions?.listDeployments(pick.detail);
        let value;
        if (deployments && deployments.deployments.length > 0) {
            value = deployments.deployments[deployments.deployments.length - 1].entrypoint;
        }
        const command = await window.showInputBox({ value, prompt: "Command to run your code" });
        if (command === undefined) {
            return;
        }
        const tag = await window.withProgress(
            { location: ProgressLocation.Notification, title: "Creating tag..." },
            async (progress, _token) => {
                if (pick.detail === undefined) {
                    return;
                }
                return await createTagFromUri(pick.detail, command, item, progress);
            }
        );
        if (tag) {
            await tagNotification(tag);
        }

        return;
    }

    if (item instanceof TagsTreeItem) {
        const func = item.parent.func;
        const folder = await selectWorkspaceFolder("Select folder of your function code.");
        if (folder === undefined || folder === "") {
            return;
        }
        const deployments = await functions?.listDeployments(func.$id);
        let value;
        if (deployments && deployments.deployments.length > 0) {
            value = deployments.deployments[deployments.deployments.length - 1].entrypoint;
        }
        const command = await window.showInputBox({ value, prompt: "Command to run your code" });
        if (command === undefined) {
            return;
        }
        const tag = await window.withProgress(
            { location: ProgressLocation.Notification, title: "Creating tag..." },
            async (progress, _token) => {
                return await createTagFromUri(func.$id, command, Uri.parse(folder), progress);
            }
        );

        if (tag) {
            await tagNotification(tag);
            return;
        }
    }

    if (item === undefined) {
        const functionList = await functions?.list();
        if (functionList === undefined) {
            return;
        }
        const pick = await window.showQuickPick(
            functionList.functions.map<QuickPickItem>(
                (func): QuickPickItem => ({ label: func.name, description: func.runtime, detail: func.$id })
            ),
            { placeHolder: "Select a function to create tag" }
        );
        if (pick === undefined || pick.detail === undefined) {
            return;
        }
        const funcId = pick.detail;
        const folder = await selectWorkspaceFolder("Select folder of your function code.");
        const tags = await functions?.listDeployments(funcId);
        let value;
        if (tags && tags.deployments.length > 0) {
            value = tags.deployments[tags.deployments.length - 1].entrypoint;
        }
        const command = await window.showInputBox({ value, prompt: "Command to run your code" });
        if (command === undefined) {
            return;
        }
        const tag = await window.withProgress(
            { location: ProgressLocation.Notification, title: "Creating tag..." },
            async (progress, _token) => {
                return await createTagFromUri(funcId, command, Uri.parse(folder), progress);
            }
        );

        if (tag) {
            await tagNotification(tag);
            return;
        }
    }
}

async function createTagFromUri(functionId: string, command: string, uri: Uri, progress: ProgressMessage): Promise<Models.Deployment | undefined> {
    progress.report({ message: "Creating tarball", increment: 10 });

    if (functions === undefined) {
        return;
    }

    let tarFilePath;
    try {
        tarFilePath = await getTarReadStream(uri);
    } catch (e) {
        window.showErrorMessage("Error creating tar file.\n" + e);
        return;
    }
    if (tarFilePath === undefined) {
        window.showErrorMessage("Failed to create tar file.");
        ext.outputChannel.appendLog("Failed to create tar file.");
        return;
    }
    // somehow makes the upload work
    await workspace.fs.readFile(Uri.file(tarFilePath));
    progress.report({ message: "Uploading tag", increment: 60 });
    try {
        return await functions.createDeployment(functionId, command, InputFile.fromPath(tarFilePath, 'code'), true);
    } catch (e) {
        ext.outputChannel.appendLog("Creating tag error: " + e);
    }
}

async function tagNotification(tag: Models.Deployment): Promise<void> {
    ext.tree?.functions?.refresh();
    if (tag) {
        const action = await window.showInformationMessage(
            `Successfully created tag with size ${tag.size}B.`,
            "Activate tag",
            "View in console"
        );
        if (action === "Activate tag") {
            await activateTag(tag);
        }
        if (action === "View in console") {
            //
        }
        return;
    }
}
