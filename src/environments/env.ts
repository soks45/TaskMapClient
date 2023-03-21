export interface Env {
    production: boolean;
    apiUrl: string;
    signalRHubs: {
        Tasks: string;
    };
    logUrl: string;
    authClientId: string;
}
