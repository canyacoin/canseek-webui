// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  URL: {
    changeCurrency: 'https://min-api.cryptocompare.com/data/pricemulti'
  },
  firebase: {
    apiKey: "AIzaSyCxRQdQyKjdTyMbHt1F4gl7V2EGwqgekJU",
    authDomain: "canseek-dev.firebaseapp.com",
    databaseURL: "https://canseek-dev.firebaseio.com",
    projectId: "canseek-dev",
    storageBucket: "canseek-dev.appspot.com",
    messagingSenderId: "694155772067"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
