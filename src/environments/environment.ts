// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Env } from '@environments/env';

export const environment: Env = {
    production: false,
    apiUrl: 'https://localhost:5001/api',
    signalRHubs: {
        Tasks: 'https://localhost:5001/hub/task',
    },
    logUrl: 'https://localhost:5001/api/send-log',
    authClientId: '912961596350-kegl1icmtodr5r6t5rhfeb7tf2o4vvde.apps.googleusercontent.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
