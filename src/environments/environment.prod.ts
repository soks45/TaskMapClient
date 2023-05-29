import { Env } from '@environments/env';

export const environment: Env = {
    production: true,
    apiUrl: 'https://localhost:5001',
    signalRHubs: {
        notifications: 'https://localhost:5001/notificationHub',
    },
    logUrl: 'https://localhost:5001/ClientLog/log',
    authClientId: '912961596350-kegl1icmtodr5r6t5rhfeb7tf2o4vvde.apps.googleusercontent.com',
};
