import { Account, Client, Projects } from "@appwrite.io/console";
import { Database } from "./appwrite/Database";
import { Functions } from './appwrite/Functions';
import { Health } from "./appwrite/Health";
import { Storage } from "./appwrite/Storage";
import { Users } from "./appwrite/Users";
import { AppwriteEndpoint } from "./settings";

export let client: Client;
export let accountClient: Account;
export let projectsClient: Projects;
export let clientConfig: { endpoint: string; projectId: string;};
export let usersClient: Users | undefined;
export let healthClient: Health | undefined;
export let databaseClient: Database | undefined;
export let storageClient: Storage | undefined;
export let functionsClient: Functions | undefined;


function initAppwriteClient({ endpoint }: AppwriteEndpoint) {
    client = new Client();
    const projectId = "console";
    clientConfig = { endpoint, projectId };
    client.setEndpoint(endpoint).setProject(projectId);

    projectsClient = new Projects(client);
    accountClient = new Account(client);
    usersClient = new Users(client);
    healthClient = new Health(client);
    databaseClient = new Database(client);
    storageClient = new Storage(client);
    functionsClient = new Functions(client);

    return client;
}

export function createAppwriteClient(config?: AppwriteEndpoint): void {
    if (config) {
        initAppwriteClient(config);
        return;
    }

    usersClient = undefined;
    healthClient = undefined;
    databaseClient = undefined;
    storageClient = undefined;
    functionsClient = undefined;
}
