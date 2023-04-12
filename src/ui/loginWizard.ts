import { window } from "vscode";
import { AppwriteEndpoint, getActiveEndpointConfiguration } from "../settings";

export async function loginWizard(): Promise<{email: string, password: string} | undefined> {
    const email = await window.showInputBox({
        placeHolder: "email",
        valueSelection: undefined,
        prompt: "Enter your email",
        ignoreFocusOut: true,
    });
    if (email === undefined) {
        return;
    }
    const password = await window.showInputBox({
        password: true,
        placeHolder: "password",
        prompt: "Enter your password"
    });

    if(password === undefined) {
        return;
    }
    // const nickname = await window.showInputBox({
    //     prompt: "(Optional) Endpoint name",
    //     ignoreFocusOut: true,
    // });

    if (email && password) {
        return { email, password };
    }
    return undefined;
}
