import { Env } from '@environments/env';

export const environment: Env = {
    production: true,
    apiUrl: 'https://localhost:5001',
    signalRHubs: {
        Tasks: 'https://localhost:5001/hub/Task',
    },
    logUrl: 'https://localhost:5001/ClientLog/log',
    authClientId: '912961596350-0pbhiqf40bpa8ubdvt3h9s2jjo261nt1.apps.googleusercontent.com',
};
