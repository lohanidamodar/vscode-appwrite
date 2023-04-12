import { workspace } from "vscode";
import { createAppwriteClient } from "./client";

export type AppwriteEndpoint = {
    endpoint: string;
}

export type AppwriteProjectConfiguration = {
    nickname?: string;
    endpoint: string;
    console?: string;
    projectId: string;
    selfSigned: boolean;
    secret: string;
};

export async function getDefaultProject(): Promise<AppwriteProjectConfiguration | undefined> {
    const projects = await getAppwriteProjects();
    return projects?.[0] ?? undefined;
}

export async function getAppwriteEndpoints(): Promise<AppwriteEndpoint[]> {
    const configuration = workspace.getConfiguration("appwrite");
    const endpoints = configuration.get("endpoints");
    if(endpoints === undefined) {
        configuration.update("endpoints", []);
        return [];
    }
    return endpoints as AppwriteEndpoint[];
}

export async function getAppwriteProjects(): Promise<AppwriteProjectConfiguration[]> {
    const configuration = workspace.getConfiguration("appwrite");
    const projects = configuration.get("projects");
    if (projects === undefined) {
        configuration.update("projects", []);
        return [];
    }
    return projects as AppwriteProjectConfiguration[];
}

export async function addProjectConfiguration(projectConfig: AppwriteProjectConfiguration): Promise<void> {
    const configuration = workspace.getConfiguration("appwrite");
    const projects = await getAppwriteProjects();

    await configuration.update("projects", [...projects, projectConfig], true);
    await setActiveProjectId(projectConfig.projectId);
}

export async function addEndpointConfiguration(endpointConfig: AppwriteEndpoint): Promise<void> {
    const configuration = workspace.getConfiguration("appwrite");
    const endpoints = await getAppwriteEndpoints();

    await configuration.update("endpoints", [...endpoints, endpointConfig], true);
    await setActiveEndpoint(endpointConfig.endpoint);
}

export async function getActiveProjectId(): Promise<string> {
    const configuration = workspace.getConfiguration("appwrite");
    const projectId = configuration.get<string>("activeProjectId");
    return projectId ?? "";
}

export async function getActiveEndpoint(): Promise<string> {
    const configuration = workspace.getConfiguration("appwrite");
    const endpoint = configuration.get<string>("activeEndpoint");
    return endpoint ?? "";
}

export async function getActiveEndpointConfiguration(): Promise<AppwriteEndpoint | undefined> {
    const configurations = await getAppwriteEndpoints();
    const activeEndpoint = await getActiveEndpoint();
    let activeConfig;

    if(configurations === undefined || configurations.length === 0) {
        return undefined;
    }

    configurations.forEach((endpoint) => {
        if(endpoint.endpoint == activeEndpoint) {
            activeConfig = activeEndpoint;
        }
    });

    if(activeConfig === undefined) {
        activeConfig == configurations[0];
        setActiveEndpoint(configurations[0].endpoint);
    }
    return activeConfig;
}

export async function getActiveProjectConfiguration(): Promise<AppwriteProjectConfiguration | undefined> {
    const configurations = await getAppwriteProjects();
    const activeConfigId = await getActiveProjectId();
    let activeConfig;

    if (configurations === undefined || configurations?.length === 0) {
        return undefined;
    }

    configurations.forEach((config) => {
        if (config.projectId === activeConfigId) {
            activeConfig = config;
        }
    });

    if (activeConfig === undefined) {
        activeConfig = configurations[0];
        setActiveProjectId(configurations[0].projectId);
    }
    return activeConfig;
}

export async function setActiveProjectId(projectId: string): Promise<void> {
    const configuration = workspace.getConfiguration("appwrite");
    await configuration.update("activeProjectId", projectId, true);
    const active = await getActiveProjectConfiguration();
    createAppwriteClient(active);
}

export async function setActiveEndpoint(endpoint: string): Promise<void> {
    const configuration = workspace.getConfiguration("appwrite");
    await configuration.update("activeEndpoint", endpoint, true);
    const active = await getActiveEndpointConfiguration();
    createAppwriteClient(active);
}

export async function updateActiveProjectId(): Promise<void> {
    const projects = await getAppwriteProjects();
    if (projects.length > 0) {
        const configuration = workspace.getConfiguration("appwrite");
        await configuration.update("activeProjectId", projects[0].projectId, true);
        const active = await getActiveProjectConfiguration();
        createAppwriteClient(active);
    }
}

export async function removeProjectConfig(projectId: string): Promise<void> {
    const projects = await getAppwriteProjects();
    const updatedProjects = projects.filter((project) => project.projectId !== projectId);
    const configuration = workspace.getConfiguration("appwrite");
    await configuration.update("projects", updatedProjects, true);
    await updateActiveProjectId();
}
