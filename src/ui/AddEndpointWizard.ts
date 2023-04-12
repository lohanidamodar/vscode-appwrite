import { window } from "vscode";
import { AppwriteEndpoint, getActiveEndpointConfiguration } from "../settings";

export async function addEndpointWizard(): Promise<AppwriteEndpoint | undefined> {
    const config = await getActiveEndpointConfiguration();
    const endpoint = await window.showInputBox({
        placeHolder: "Endpoint",
        value: config?.endpoint ?? "https://cloud.appwrite.io/v1",
        valueSelection: undefined,
        prompt: "Enter your Appwrite API endpoint (ex: https://cloud.appwrite.io/v1)",
        ignoreFocusOut: true,
    });
    if (endpoint === undefined) {
        return;
    }
    
    // const nickname = await window.showInputBox({
    //     prompt: "(Optional) Endpoint name",
    //     ignoreFocusOut: true,
    // });

    if (endpoint) {
        return { endpoint };
    }
    return undefined;
}
