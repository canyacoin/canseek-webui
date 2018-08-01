import { Injectable, OnInit } from '@angular/core';
import { debug } from 'util';
// const Identicon = require('identicon.js');
// const _ = require('lodash');

declare let require: any;
declare let window: any;

const Web3 = require('web3');

const contract = require('truffle-contract');
const CanYaCoinArtifacts = require('../../../../build/contracts/CanYaCoin.json');
const EscrowArtifacts = require('../../../../build/contracts/Escrow.json');
const CanHireArtifacts = require('../../../../build/contracts/CanHire.json');
let gasBuy = '50000';
let gasPrice = '503000000';
let gasApprove = '45600';
let gasAddPost = '500000';
let gasCancelPost = '200000';
let gasGetRefund = '60000';
let gasClosePost = '200000';
let gasRecommend = '200000';
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };

// Ropsten contract address
// const CanYaCoinAddr = '0xf838388d1abe9db5c4d4946407ee74e99f495261';
// const EscrowAddr = '0x13d202a36b25d82e910e1319a8709e1779746fcc';
// const CanHireAddr = '0x6634ffed8315ef701db2a7edbae9d23b53481493';

// Ganache contract address
const CanYaCoinAddr = '0x5877b0d8a13dfd5e14973fe16c41be7b587f03c6';
const EscrowAddr = '0xc27d35a45ea0c094af8014d1a0e10565df2327f4';
const CanHireAddr = '0xec7b9be7c2a42c35c84d29a3e68b67c1a4c78fb5';

@Injectable()
export class ContractsService {
  private _account: string = null;
  private _web3;

  CanYaCoin = contract(CanYaCoinArtifacts);
  Escrow = contract(EscrowArtifacts);
  CanHire = contract(CanHireArtifacts);

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);
      this._web3.eth.net.getId().then(netId => {
        if (netId !== 3) {
          alert('Please connect to the Ropsten network');
          return;
        }
      });
    } else {
      alert('Please use a DApp browser like mist or MetaMask plugin for chrome');
      return;
    }
    this._web3.eth.getGasPrice().then(price => {
      gasPrice = price;
    });

    this.CanYaCoin.setProvider(this._web3.currentProvider);
    this.Escrow.setProvider(this._web3.currentProvider);
    this.CanHire.setProvider(this._web3.currentProvider);
  }

  public async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        if (this._web3) {
          this._web3.eth.getAccounts((err, accs) => {
            if (err != null) {
              alert('There was an error fetching your accounts.');
              return;
            }
  
            if (accs.length === 0) {
              alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
              return;
            }
            resolve(accs[0]);
          });
        } else {
          alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
          return;
        }
        
      }) as string;

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getCANBalance(): Promise<number> {
    const account = await this.getAccount();
    const canYaCoin = await this.CanYaCoin.at(CanYaCoinAddr);
    return new Promise((resolve, reject) => {
      canYaCoin.balanceOf.call(account, { from: account }).then(result => {
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

  public async buyCAN(amountInEther = '1') {
    const account = await this.getAccount();
    const amountInWei = this._web3.utils.toWei(amountInEther, 'ether');
    const canYaCoin = await this.CanYaCoin.at(CanYaCoinAddr);

    return new Promise((resolve, reject) => {
      canYaCoin.buy({ from: account, value: amountInWei, gasPrice: gasPrice, gas: gasBuy }).then(result => {
        resolve(result.logs[0].args.value.toNumber());
      })
        .catch(err => {
          reject(err);
        });
    }) as Promise<number>;
  }

  public async getNumPosts() {
    const canHire = await this.CanHire.at(CanHireAddr);
    return new Promise((resolve, reject) => {
      canHire.numPosts().then(numPosts => {
        resolve(numPosts.toNumber() - 1);
      })
        .catch(err => {
          reject(err);
        });
    }) as Promise<number>;
  }

  public async getPostOwner(postId) {
    const canHire = await this.CanHire.at(CanHireAddr);
    return new Promise((resolve, reject) => {
      canHire.posts(postId).then(result => {
        resolve(result[1].toString());
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<string>;
  }

  public async getPostStatus(postId) {
    const canHire = await this.CanHire.at(CanHireAddr);
    return new Promise((resolve, reject) => {
      canHire.posts(postId).then(post => {
        let postStatus;
        switch (post[2].toString()) {
          case '1': {
            postStatus = 'open';
            break;
          }
          case '2': {
            postStatus = 'closed';
            break;
          }
          case '3': {
            postStatus = 'cancelled';
            break;
          }
          default: {
            postStatus = 'pending';
            break;
          }
        }
        resolve(postStatus.toString());
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<string>;
  }

  public async getPostCost(postId) {
    const canHire = await this.CanHire.at(CanHireAddr);
    return new Promise((resolve, reject) => {
      canHire.posts(postId).then(result => {
        resolve(result[4].toNumber());
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<number>;
  }

  public async getPostHoneypot(postId) {
    const canHire = await this.CanHire.at(CanHireAddr);
    return new Promise((resolve, reject) => {
      canHire.posts(postId).then(result => {
        resolve(result[5].toNumber());
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<number>;
  }

  public async addPost(id, bounty, cost) {
    const account = await this.getAccount();
    const canYaCoin = await this.CanYaCoin.at(CanYaCoinAddr);
    const escrow = await this.Escrow.at(EscrowAddr);
    const canHire = await this.CanHire.at(CanHireAddr);
    await canYaCoin.approve(escrow.address, bounty, { from: account, gasPrice: gasPrice, gas: gasApprove });

    return new Promise((resolve, reject) => {
      canHire.addPost(id, bounty, cost, { from: account, gasPrice: gasPrice, gas: gasAddPost }).then(result => {
        resolve(result.logs[0].args.postId.toNumber());
      })
        .catch(err => {
          reject(err);
        });
    }) as Promise<number>;
  }

  public async cancelPost(postId) {
    const account = await this.getAccount();
    const canYaCoin = await this.CanYaCoin.at(CanYaCoinAddr);
    const escrow = await this.Escrow.at(EscrowAddr);
    const canHire = await this.CanHire.at(CanHireAddr);

    return new Promise((resolve, reject) => {
      canHire.cancelPost(postId, { from: account, gasPrice: gasPrice, gas: gasCancelPost }).then(result => {
        resolve(result.logs[0].args.status.toNumber());
      })
        .catch(err => {
          reject(err);
        });
    }) as Promise<number>;
  }

  public async closePost(postId, candidateId) {
    const account = await this.getAccount();
    const canHire = await this.CanHire.at(CanHireAddr);

    return new Promise((resolve, reject) => {
      canHire.closePost(postId, candidateId, { from: account, gasPrice: gasPrice, gas: gasClosePost }).then(result => {
        resolve(result.toString());
      })
        .catch(err => {
          reject(err);
        });
    }) as Promise<number>;
  }

  public async recommend(candidateUniqueId, postId) {
    const account = await this.getAccount();
    const canYaCoin = await this.CanYaCoin.at(CanYaCoinAddr);
    const escrow = await this.Escrow.at(EscrowAddr);
    const canHire = await this.CanHire.at(CanHireAddr);
    const cost = await this.getPostCost(postId);
    const honeypot = await this.getPostHoneypot(postId);
    await canYaCoin.approve(escrow.address, cost, {from: account, gasPrice: gasPrice, gas: gasApprove});

    return new Promise((resolve, reject) => {
      canHire.recommend(candidateUniqueId, postId, {from: account, gasPrice: gasPrice, gas: gasRecommend}).then(result => {
        const { candidateId } = result.logs[0].args;

        this.getPostHoneypot(postId).then(
          honeypot => {
            resolve({honeypot, candidateId: Number(candidateId)});
          }
        )
      }).catch( err => {
        reject(err);
      });
    }) as Promise<object>;
  }

  public async getRecommenders(postId) {
    const canHire = await this.CanHire.at(CanHireAddr);

    return new Promise((resolve, reject) => {
      canHire.getRecommenders(postId).then( recommenders => {
        resolve(recommenders);
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<object>;
  }

  public async getPost(postId) {
    const canHire = await this.CanHire.at(CanHireAddr);
    const recommenders = await canHire.getRecommenders(postId);
    return new Promise((resolve, reject) => {
      canHire.posts(postId).then(async post => {
        const status = await this.getPostStatus(postId);
        const postInfo = {'id': post[0].toNumber(),
                        'owner': post[1].toString(),
                        'status': status,
                        'bounty': post[3].toNumber(),
                        'cost': post[4].toNumber(),
                        'honeypot': post[5].toNumber(),
                        'candidateSelected': post[6].toNumber(),
                        'recommenders': recommenders
                      };
        resolve(postInfo);
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<object>;
  }

  public async getAllPosts() {
    const posts = [];
    return new Promise((resolve, reject) => {
      this.getNumPosts().then(async numPosts => {
        for (let i = 1; i <= numPosts; i++) {
          posts.push(await this.getPost(i));
        }
        resolve(posts);
      })
      .catch(err => {
        reject(err);
      });
    }) as Promise<object>;
  }

  public async getAllCandidates(postId) {
    const canHire = await this.CanHire.at(CanHireAddr);
    const post = await canHire.posts(postId);
    const numCandidates = post[6].toNumber();
    const recommenders = [];
    for (let i = 0; i < numCandidates; i++) {
      recommenders.push(await canHire.posts[postId]);
    }
  }

  public async getPostId(uniqueId) {
    const account = await this.getAccount();
    const canHire = await this.CanHire.at(CanHireAddr);
    return new Promise((resolve, reject) => {
      canHire.getId(uniqueId, {account}).then(postId => {
        resolve(postId.toNumber());
      }).catch( err => {
        reject(err);
      });
    }) as Promise<number>;
  }

  public async getCandidateId(uniqueCandidateId, postId) {
    const canHire = await this.CanHire.at(CanHireAddr);
    const honeypot = await this.getPostHoneypot(postId);
    return new Promise((resolve, reject) => {
      canHire.getCandidateId(uniqueCandidateId, postId).then(candidateId => {
        resolve({honeypot, candidateId: candidateId.toNumber()});
      }).catch( err => {
        reject(err);
      });
    }) as Promise<any>;
  }

  public async getRefund(postId) {
    const account = await this.getAccount();
    const canHire = await this.CanHire.at(CanHireAddr);

    return new Promise((resolve, reject) => {
      canHire.getRefund(postId, {from: account, gasPrice: gasPrice, gas: gasGetRefund}).then(refund => {
        console.log(refund);
        resolve(refund.logs[0].args.cost.toNumber());
      }).catch( err => {
        reject(err);
      });
    }) as Promise<number>;
  }

}
