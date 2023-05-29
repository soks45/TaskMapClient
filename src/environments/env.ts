export interface Env {
    production: boolean;
    apiUrl: string;
    signalRHubs: {
        notifications: string;
    };
    logUrl: string;
    authClientId: string;
}
