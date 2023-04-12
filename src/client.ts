import { Client, Databases, Functions, Health, Storage, Users } from "node-appwrite";

import { AppwriteProjectConfiguration } from "./settings";

export let client: Client;
export let clientConfig: { endpoint: string; projectId: string; secret: string };
export let users: Users | undefined;
export let health: Health | undefined;
export let databases: Databases | undefined;
export let storage: Storage | undefined;
export let functions: Functions | undefined;


function initAppwriteClient({ endpoint, projectId, secret, selfSigned }: AppwriteProjectConfiguration) {
    client = new Client();
    clientConfig = { endpoint, projectId, secret };
    client.setEndpoint(endpoint).setProject(projectId).setKey(secret).setSelfSigned(selfSigned);

    users = new Users(client);
    health = new Health(client);
    databases = new Databases(client);
    storage = new Storage(client);
    functions = new Functions(client);

    return client;
}

export function createAppwriteClient(config?: AppwriteProjectConfiguration): void {
    if (config) {
        initAppwriteClient(config);
        return;
    }

    users = undefined;
    health = undefined;
    databases = undefined;
    storage = undefined;
    functions = undefined;
}
