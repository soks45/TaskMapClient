import { Env } from '@environments/env';

export const environment: Env = {
    production: true,
    apiUrl: 'https://tskmp.ru:4443/api',
    signalRHubs: {
        notifications: 'https://tskmp.ru:4443/notificationHub',
    },
    logUrl: 'https://tskmp.ru:4443/ClientLog/log',
    authClientId: '912961596350-kegl1icmtodr5r6t5rhfeb7tf2o4vvde.apps.googleusercontent.com',
};
