export const environment = {
  production: true,
  network: 'main',
  etherscanBaseUrl: 'https://etherscan.io/tx/',
  URL: {
    changeCurrency: 'https://min-api.cryptocompare.com/data/pricemulti',
    timezone: 'http://momentjs.com/data/moment-timezone-meta.json',
  },
  appname: 'CanSeek Escrow',
  contracts: {
    CanYaCoinAddr: '0x1d462414fe14cf489c7a21cac78509f4bf8cd7c0',
    EscrowAddr: '0x4c540ae83ebe431ea17493bec3805f607085a5a9',
    CanHireAddr: '0xfd6fa39c22412de6bbc3684b130fb4cab89bebae',
  },
  canpay: {
    useTestNet: false,
    contracts: {
      canyaCoinAddress: '0x1d462414fe14cf489c7a21cac78509f4bf8cd7c0',
    }
  },
  firebase: {
    apiKey: "AIzaSyDPlWlXthuAqDN04pTNGrppPsgO8tFn940",
    authDomain: "canseek-prod.firebaseapp.com",
    databaseURL: "https://canseek-prod.firebaseio.com",
    projectId: "canseek-prod",
    storageBucket: "canseek-prod.appspot.com",
    messagingSenderId: "162748170723"
  }
};
