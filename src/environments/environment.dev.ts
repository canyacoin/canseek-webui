export const environment = {
  production: true,
  etherscanBaseUrl: 'https://ropsten.etherscan.io/tx/',
  URL: {
    changeCurrency: 'https://min-api.cryptocompare.com/data/pricemulti'
  },
  appname: 'CanSeek Escrow',
  contracts: {
    CanYaCoinAddr: '0xee9154ab6366416e80a1eb718954abe2ae406274',
    EscrowAddr: '0x021224710e96181acf84a5eeb5114652e3e622c9',
    CanHireAddr: '0x43461f82584da6e714d4745470a97ee745629ba2',
  },
  canpay: {
    useTestNet: true,
    contracts: {
      canyaCoinAddress: '0xee9154ab6366416e80a1eb718954abe2ae406274',
    }
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
