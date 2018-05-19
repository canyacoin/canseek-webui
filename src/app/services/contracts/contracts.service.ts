import {Injectable, OnInit} from '@angular/core';
// const Identicon = require('identicon.js');
// const _ = require('lodash');

declare let require: any;
declare let window: any;

const Web3 = require('web3');

const contract = require('truffle-contract');
const CanYaCoinArtifacts = require('../../../../build/contracts/CanYaCoin.json');
const EscrowArtifacts = require('../../../../build/contracts/Escrow.json');
const CanHireArtifacts = require('../../../../build/contracts/CanHire.json');
const gas = {gasPrice: '4000000000', gas: '500000'};

@Injectable()
export class ContractsService {
  private _account: string = null;
  private _web3;

  CanYaCoin = contract(CanYaCoinArtifacts);
  Escrow = contract(EscrowArtifacts);
  CanHire = contract(CanHireArtifacts);
  private _canYaCoin: any;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);
      this._web3.eth.net.getId().then(netId => {
        if (netId !== 3) {
          // alert('Please connect to the Ropsten network');
        }
      });
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    this.CanYaCoin.setProvider(this._web3.currentProvider);
    this.Escrow.setProvider(this._web3.currentProvider);
    this.CanHire.setProvider(this._web3.currentProvider);
  }

  public async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        });
      }) as string;

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getCANBalance(): Promise<number> {
    const account = await this.getAccount();
    const canYaCoin = await this.CanYaCoin.deployed();
    return new Promise((resolve, reject) => {
      canYaCoin.balanceOf.call(account, {from: account}).then(result => {
        resolve(result.toNumber());
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<number>;
  }

  public async getETHBalance(): Promise<number> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      this._web3.eth.getBalance(account).then(result => {
        resolve(this._web3.utils.fromWei(result));
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<number>;
  }

  public async buyCAN(amountInEther) {
    const account = await this.getAccount();
    const amountInWei = this._web3.utils.toWei(amountInEther, 'ether');
    const canYaCoin = await this.CanYaCoin.deployed();

    return new Promise((resolve, reject) => {
      canYaCoin.buy({from: account, value: amountInWei, ...gas}).then(result => {
        resolve(result.logs[0].args.value.toNumber());
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<number>;
  }

  public async addPost(bounty, cost) {
    const account = await this.getAccount();
    const canYaCoin = await this.CanYaCoin.deployed();
    const escrow = await this.Escrow.deployed();
    const canHire = await this.CanHire.deployed();

    return new Promise((resolve, reject) => {
      canHire.addPost(bounty, cost, {from: account, ...gas}).then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<number>;
  }

//   public async cancelPost(postId) {
//     const account = await this.getAccount();
//     const canYaCoin = await this.CanYaCoin.deployed();
//     const escrow = await this.Escrow.deployed();
//     const canHire = await this.CanHire.deployed();
//     const postStatus = await canHire.cancelPost(postId, {from: account});
//     return postStatus[1];
//   }

//   public async closePost(postId, candidateId) {
//     const account = await this.getAccount();
//     const canYaCoin = await this.CanYaCoin.deployed();
//     const escrow = await this.Escrow.deployed();
//     const canHire = await this.CanHire.deployed();
//     const postStatus = await canHire.closePost(postId, candidateId, {from: account});
//     return postStatus[1];
//   }

//   public async recommend(postId) {
//     const account = await this.getAccount();
//     const canYaCoin = await this.CanYaCoin.deployed();
//     const escrow = await this.Escrow.deployed();
//     const canHire = await this.CanHire.deployed();
//     const candidateId = await this.CanHire.recommend(postId, {from: account});
//     return candidateId;
//   }

  // public async postProject(userName, projectName, projectPitch) {
  //   const account = await this.getAccount();
  //   const canYaCoin = await this.CanYaCoin.deployed();
  //   const canYa25 = await this.CanYa25.deployed();
  //   const postProjectPrice = (await canYa25.postProjectPrice()).toNumber();
  //   await canYaCoin.approve(canYa25.address, postProjectPrice, {from: account, ...gas});
  //   const tx = await canYa25.postProject(userName, projectName, projectPitch, {from: account, ...gas});
  //   console.log(tx);
  // }

  // public async getProjectCount() {
  //   const canYa25 = await this.CanYa25.deployed();
  //   return canYa25.getProjectCount();
  // }

  // public async hasVoted() {
  //   const account = await this.getAccount();
  //   const canYa25 = await this.CanYa25.deployed();
  //   const hasVoted = await canYa25.hasVoted({from: account});
  //   return hasVoted;
  // }

  // public async vote(projectName) {
  //   const account = await this.getAccount();
  //   const canYaCoin = await this.CanYaCoin.deployed();
  //   const canYa25 = await this.CanYa25.deployed();
  //   const voteProjectPrice = (await canYa25.voteProjectPrice()).toNumber();
  //   await canYaCoin.approve(canYa25.address, voteProjectPrice, {from: account, ...gas});
  //   const tx = await canYa25.vote(projectName, {from: account, ...gas});
  //   console.log(tx);
  // }

  // public async withdraw() {
  //   const account = await this.getAccount();
  //   const canYa25 = await this.CanYa25.deployed();
  //   const tx = await canYa25.withdraw({from: account, ...gas});
  //   console.log(tx);
  // }

  // private getIdenticon(accountAddr) {
  //   //return Jazzicon(46, parseInt(accountAddr.slice(2, 10), 16));
  //   const options = {
  //     background: [255, 255, 255, 255],
  //     margin: 0,
  //     size: 30,
  //   };
  //   const data = new Identicon(accountAddr, options).toString();
  //   return `data:image/png;base64,${data}`;
  // }

  // public async getProjects() {
  //   const canYa25 = await this.CanYa25.deployed();
  //   const projectNames = await canYa25.getProjectNames();
  //   const projects = await Promise.all(projectNames.map(async projectName => {
  //     const project = await canYa25.projects(projectName);
  //     return {
  //       userAddress: project[0],
  //       identicon: this.getIdenticon(project[0]),
  //       userName: this._web3.utils.hexToAscii(project[1]).replace(/\u0000/g, ''),
  //       title: this._web3.utils.hexToAscii(project[2]).replace(/\u0000/g, ''),
  //       description: project[3],
  //       votes: project[4].toNumber(),
  //       funded: project[5],
  //       image: 'https://canyacoin.files.wordpress.com/2018/01/canya_featured-images-out-and-about.jpg',
  //     };
  //   }));
  //   return Promise.resolve(projects);
  // }
}
