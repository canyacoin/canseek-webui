// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  etherscanBaseUrl: 'https://etherscan.io/tx/',
  URL: {
    changeCurrency: 'https://min-api.cryptocompare.com/data/pricemulti'
  },
  appname: 'CanSeek Escrow',
  contracts: {
    // local
    CanYaCoinAddr: '0x4D83C67d94c0d9333CB67567a4CF87bB5e3A977C',
    EscrowAddr: '0xB947E992E5C8417884a9ac0a02F4b2Ff9094e234',
    CanHireAddr: '0x119018A9D74b1043b50E535dd04d50edc9006648'

    // // ropsten
    // CanYaCoinAddr: '0xee9154ab6366416e80a1eb718954abe2ae406274',
    // EscrowAddr: '0x021224710e96181acf84a5eeb5114652e3e622c9',
    // CanHireAddr: '0x43461f82584da6e714d4745470a97ee745629ba2',

    // // main
    // CanYaCoinAddr: '0x1d462414fe14cf489c7a21cac78509f4bf8cd7c0',
    // EscrowAddr: '0x4c540ae83ebe431ea17493bec3805f607085a5a9',
    // CanHireAddr: '0xfd6fa39c22412de6bbc3684b130fb4cab89bebae',
  },
  canpay: {
    useTestNet: true,
    contracts: {
      canyaCoinAddress: '0x4D83C67d94c0d9333CB67567a4CF87bB5e3A977C',
      // canyaCoinAddress: '0xee9154ab6366416e80a1eb718954abe2ae406274',
      // canyaCoinAddress: '0x1d462414fe14cf489c7a21cac78509f4bf8cd7c0',
      // canyaAbi: <CanYaCoin_ABI> // optional, default is set the prod CanYaCoin ABI
    }
  },
  firebase: {
    // local
    apiKey: "AIzaSyCN8yqwRhPKwIZ1v__RYIyJRbKTWFstKns",
    authDomain: "canseek-local.firebaseapp.com",
    databaseURL: "https://canseek-local.firebaseio.com",
    projectId: "canseek-local",
    storageBucket: "canseek-local.appspot.com",
    messagingSenderId: "287939724872"
    
    // // dev
    // apiKey: "AIzaSyCxRQdQyKjdTyMbHt1F4gl7V2EGwqgekJU",
    // authDomain: "canseek-dev.firebaseapp.com",
    // databaseURL: "https://canseek-dev.firebaseio.com",
    // projectId: "canseek-dev",
    // storageBucket: "canseek-dev.appspot.com",
    // messagingSenderId: "694155772067"
    
    // // prod
    // apiKey: "AIzaSyDPlWlXthuAqDN04pTNGrppPsgO8tFn940",
    // authDomain: "canseek-prod.firebaseapp.com",
    // databaseURL: "https://canseek-prod.firebaseio.com",
    // projectId: "canseek-prod",
    // storageBucket: "canseek-prod.appspot.com",
    // messagingSenderId: "162748170723"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
