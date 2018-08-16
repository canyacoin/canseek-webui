import { Injectable, OnInit } from '@angular/core';
import { debug } from 'util';
// const Identicon = require('identicon.js');
// const _ = require('lodash');

declare let require: any;
declare let window: any;

const Web3 = require('web3');

const contract = require('truffle-contract');
const CanYaCoinArtifacts = require('../../../build/contracts/CanYaCoin.json');
const EscrowArtifacts = require('../../../build/contracts/Escrow.json');
const CanHireArtifacts = require('../../../build/contracts/CanHire.json');
let gasBuy = '50000';
let gasPrice = '503000000';
let gasApprove = '45600';
let gasAddPost = '500000';
let gasCancelPost = '200000';
let gasGetRefund = '100000';
let gasClosePost = '200000';
let gasRecommend = '200000';
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };
// const gas = { gasPrice: '503000000', gas: '200000' };

// mainnet contract address
// const CanYaCoinAddr = '0xc0b3c2394c62a6d6437a189444c46d556cf1339d';
// const EscrowAddr = '0x1b17a3bed2c7f638faee11e785f8c6d2ad78d78c';
// const CanHireAddr = '0xb2a0def4d812b144c5146972e69d1d5432d812ad';


// Ropsten contract address
const CanYaCoinAddr = '0x1e7df0798b3cf411c954b1355f0889dc58a20d92';
const EscrowAddr = '0x180140cf37a7ad694e2a54f037ad1e4cd8bc4b9b';
const CanHireAddr = '0xea4088ca8948de6aa8e8c49130dee94336de3dd1';

// Ganache contract address
// const CanYaCoinAddr = '0x3314e3c39e2bae4fd0a8fe5dd6a8bb9be8906599';
// const EscrowAddr = '0x3c38e7156ab6499ca7b66b7cf6f04fc627838c83';
// const CanHireAddr = '0xc2f5720e8b07680b2350453c62df9910674f96c3';

// (0) 8f5c40f1ad8b0ab5786fdfefda7726107800350dc1cec541cfb9cba694947f04
// (1) 61f7b49fa99892afddc74d4c1607270b3b49b7fb468703c66e152aa65805387c
// (2) 0fcebee91744f7d9fe849cccbd5012bacabc860bfbf6714cf4c28f141bbc263d
// (3) 023a6d213a9ff3238cda54e4522b218ff28abaad122e56b2f8226df36fc96041
// (4) e6b607b7482be3f2093e2898ba401897bcb3524bf37416405a13cdbadd24b58d
// (5) efa8b9b3984d8cacc40949c70aef04e1a21981607339a9d172ab3b36b26530f7
// (6) e31f93b2216edf7dfe25eaeec704cd50c3cc1da808adb521c33144827de3db74
// (7) 00292650bde8210e00826d68d73daa75ec225d03d384c30b7381a3dd2d95b144
// (8) 66c6882f3d06bd2ee9ae2a846406ad18aea59751df13a412dd8926f3a2fadcf2
// (9) 996099c796573dce6a866bb645dbe405e2be67d2c2a635f1b3d3f3d623f88cc9


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
          // alert('Please connect to the Ropsten network');
          return;
        }
      });
    } else {
      // alert('Please use a DApp browser like mist or MetaMask plugin for chrome');
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
            if (err != null || accs.length === 0) {
              reject(false);
            } else {
              resolve(accs[0]);
            }
          });
        } else {
          throw new Error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
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
    await canYaCoin.approve(escrow.address, cost, {from: account, gasPrice: gasPrice, gas: gasApprove});

    return new Promise((resolve, reject) => {
      canHire.recommend(candidateUniqueId, postId, {from: account, gasPrice: gasPrice, gas: gasRecommend}).then(result => {
        const { candidateId } = result.logs[0].args;
        this.getPostHoneypot(postId)
        .then(honeypot => {
          setTimeout(() => {
            resolve({honeypot, candidateId: Number(candidateId)})
          }, 10);
        })
      }).catch( err => {
        reject(err);
      });
    }) as Promise<any>;
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
        const result = refund.logs[0].args.cost.toNumber();
        resolve(!result);
      }).catch( err => {
        reject(err);
      });
    }) as Promise<boolean>;
  }

}
