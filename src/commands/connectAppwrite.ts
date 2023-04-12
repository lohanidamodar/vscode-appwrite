import { accountClient, client, createAppwriteClient } from "../client";
import { addEndpointConfiguration, addProjectConfiguration } from '../settings';
import { addEndpointWizard } from "../ui/AddEndpointWizard";
import { addProjectWizard } from "../ui/AddProjectWizard";
import { loginWizard } from "../ui/loginWizard";
import { refreshTree } from '../utils/refreshTree';

export async function connectAppwrite():  Promise<void> {
    const endpointConfig = await addEndpointWizard();
    if (endpointConfig) {
        addEndpointConfiguration(endpointConfig);
        createAppwriteClient(endpointConfig);
        const res = await loginWizard();
        if(res) {
            const session = await accountClient.createEmailSession(res.email, res.password);
            refreshTree();
        }
    }
}
