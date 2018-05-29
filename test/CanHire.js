var CanYaCoin = artifacts.require("./CanYaCoin.sol");
var Escrow = artifacts.require("./Escrow.sol");
var CanHire = artifacts.require("./CanHire.sol");
const utils = require("tn-truffle-test-utils");

contract("CanHire", accounts => {

  let token;
  let escrow;
  let canHire;
  let tokenContractOwner = accounts[7];
  let escrowContractOwner = accounts[8];
  let canHireOwner = accounts[0];
  let employer1 = accounts[1];
  let employer2 = accounts[2];
  let recruiter1 = accounts[3];
  let recruiter2 = accounts[4];
  let recruiter3 = accounts[5];

  beforeEach(async () => {
    token = await utils.deploy(CanYaCoin, {from: tokenContractOwner});
    escrow = await utils.deploy(Escrow, token.address, {from: escrowContractOwner});
    canHire = await utils.deploy(CanHire, token.address, escrow.address, {from: canHireOwner});

    await token.buy({from: employer1, value: web3.toWei('2', 'ether')});
    await token.buy({from: employer2, value: web3.toWei('1', 'ether')});
    await token.buy({from: recruiter1, value: web3.toWei('1', 'ether')});
    await token.buy({from: recruiter2, value: web3.toWei('1', 'ether')});
    await token.buy({from: recruiter3, value: web3.toWei('1', 'ether')});

    const employer1Balance = await token.balanceOf(employer1);
    const employer2Balance = await token.balanceOf(employer2);
    const recruiter1Balance = await token.balanceOf(recruiter1);
    const recruiter2Balance = await token.balanceOf(recruiter2);
    const recruiter3Balance = await token.balanceOf(recruiter3);
    
    assert(await canHire.active(), "CanHire contract is not active.");
    assert.equal(employer1Balance.toNumber(), 2857, "wrong empoloyer1 balance");
    assert.equal(employer2Balance.toNumber(), 1428, "wrong employer2 balance");
    assert.equal(recruiter1Balance.toNumber(), 1428, "wrong recruiter1 balance");
    assert.equal(recruiter2Balance.toNumber(), 1428, "wrong recruiter2 balance");
    assert.equal(recruiter3Balance.toNumber(), 1428, "wrong recruiter3 balance");
  });

  it("should add 3 new posts", async () => {
    await token.approve(escrow.address, 1000, {from: employer1});
    await canHire.addPost(1000, 50, {from: employer1});
    
    const numPosts1 = await canHire.numPosts();
    const post1 = await canHire.posts(0);
    const employer1Balance1 = await token.balanceOf(employer1);
    const escrowBalance1 = await token.balanceOf(escrow.address);
    
    assert.equal(numPosts1.toNumber(), 1, "wrong total number of posts");
    assert.equal(post1[0].toNumber(), 0, "wrong post id");
    assert.equal(post1[1], employer1.toString(), "wrong post owner");
    assert.equal(post1[2].toNumber(), 1, "wrong post status");
    assert.equal(post1[3].toNumber(), 1000, "wrong post bounty");
    assert.equal(post1[4].toNumber(), 50, "wrong post cost");
    assert.equal(post1[5].toNumber(), 1000, "wrong post honeyPot");
    assert.equal(post1[6].toNumber(), 0, "wrong number of candidates of the post");
    assert.equal(post1[7].toNumber(), 0, "wrong candidated selected");
    assert.equal(employer1Balance1.toNumber(), 1857, "wrong employer balance");
    assert.equal(escrowBalance1.toNumber(), 1000, "wrong escrow balance");

    await token.approve(escrow.address, 1400, {from: employer2});
    await canHire.addPost(1400, 100, {from: employer2});

    const numPosts2 = await canHire.numPosts();
    const post2 = await canHire.posts(1);
    const employer2Balance = await token.balanceOf(employer2);
    const escrowBalance2 = await token.balanceOf(escrow.address);

    assert.equal(numPosts2.toNumber(), 2, "wrong total number of posts");
    assert.equal(post2[0].toNumber(), 1, "wrong post id");
    assert.equal(post2[1], employer2.toString(), "wrong post owner");
    assert.equal(post2[2].toNumber(), 1, "wrong post status");
    assert.equal(post2[3].toNumber(), 1400, "wrong post bounty");
    assert.equal(post2[4].toNumber(), 100, "wrong post cost");
    assert.equal(post2[5].toNumber(), 1400, "wrong post honeyPot");
    assert.equal(post2[6].toNumber(), 0, "wrong number of candidates of the post");
    assert.equal(post2[7].toNumber(), 0, "wrong candidated selected");
    assert.equal(employer2Balance.toNumber(), 28, "wrong employer balance");
    assert.equal(escrowBalance2.toNumber(), 2400, "wrong escrow balance");

    await token.approve(escrow.address, 1500, {from: employer1});
    await canHire.addPost(1500, 200, {from: employer1});

    const numPosts3 = await canHire.numPosts();
    const post3 = await canHire.posts(2);
    const employer1Balance2 = await token.balanceOf(employer1);
    const escrowBalance3 = await token.balanceOf(escrow.address);

    assert.equal(numPosts3.toNumber(), 3, "wrong total number of posts");
    assert.equal(post3[0].toNumber(), 2, "wrong post id");
    assert.equal(post3[1], employer1.toString(), "wrong post owner");
    assert.equal(post3[2].toNumber(), 1, "wrong post status");
    assert.equal(post3[3].toNumber(), 1500, "wrong post bounty");
    assert.equal(post3[4].toNumber(), 200, "wrong post cost");
    assert.equal(post3[5].toNumber(), 1500, "wrong post honeyPot");
    assert.equal(post3[6].toNumber(), 0, "wrong number of candidates of the post");
    assert.equal(post3[7].toNumber(), 0, "wrong candidated selected");
    assert.equal(employer1Balance2.toNumber(), 357, "wrong employer balance");
    assert.equal(escrowBalance3.toNumber(), 3900, "wrong escrow balance");
  });

  it("should recommend 2 candidates", async () => { 
    // employer1 adds a post
    await token.approve(escrow.address, 1000, {from: employer1});
    await canHire.addPost(1000, 50, {from: employer1});

    const numPosts = await canHire.numPosts();
    const post = await canHire.posts(0);
    const employer1Balance1 = await token.balanceOf(employer1);
    const escrowBalance = await token.balanceOf(escrow.address);
    
    assert.equal(numPosts.toNumber(), 1, "wrong total number of posts");
    assert.equal(post[0].toNumber(), 0, "wrong post id");
    assert.equal(post[1], employer1.toString(), "wrong post owner");
    assert.equal(post[2].toNumber(), 1, "wrong post status");
    assert.equal(post[3].toNumber(), 1000, "wrong post bounty");
    assert.equal(post[4].toNumber(), 50, "wrong post cost");
    assert.equal(post[5].toNumber(), 1000, "wrong post honeyPot");
    assert.equal(post[6].toNumber(), 0, "wrong number of candidates of the post");
    assert.equal(post[7].toNumber(), 0, "wrong candidated selected");
    assert.equal(employer1Balance1.toNumber(), 1857, "wrong employer balance");
    assert.equal(escrowBalance.toNumber(), 1000, "wrong escrow balance");

    // recruiter1 recommends 2 candidates
    await token.approve(escrow.address, 100, {from: recruiter1});
    await canHire.recommend(0, {from: recruiter1});
    await canHire.recommend(0, {from: recruiter1});

    const recruiter1Balance = await token.balanceOf(recruiter1);
    const newEscrowBalance = await token.balanceOf(escrow.address);
    const newPost = await canHire.posts(0);
    console.log(typeof(newPost[8].toString()));
    const recommender1 = newPost[8].toString();
    const recommender2 = newPost[8].toString();

    assert.equal(recruiter1Balance.toNumber(), 1328, "wrong recruiter balance");
    assert.equal(newEscrowBalance.toNumber(), 1100, "wrong escrow balance");
    assert.equal(newPost[0].toNumber(), 0, "wrong post id");
    assert.equal(newPost[1], employer1.toString(), "wrong post owner");
    assert.equal(newPost[2].toNumber(), 1, "wrong post status");
    assert.equal(newPost[3].toNumber(), 1000, "wrong post bounty");
    assert.equal(newPost[4].toNumber(), 50, "wrong post cost");
    assert.equal(newPost[5].toNumber(), 1100, "wrong post honeyPot");
    assert.equal(newPost[6].toNumber(), 2, "wrong number of candidates of the post");
    assert.equal(newPost[7].toNumber(), 0, "wrong candidated selected");
    assert(hasCandidate1, "post didn't register the recommended candidate");
    assert(hasCandidate1, "post didn't register the recommended candidate");
    assert.equal(recommender1, recruiter1.toString(), "wrong candidate recommender");
    assert.equal(recommender1, recruiter1.toString(), "wrong candidate recommender");
  });

  it("should cancel a post", async () => {
    await token.approve(escrow.address, 1000, {from: employer1});
    await canHire.addPost(1000, 50, {from: employer1});
    await token.approve(escrow.address, 100, {from: recruiter1});
    await canHire.recommend(0, {from: recruiter1});
    await canHire.recommend(0, {from: recruiter1});
    await token.approve(escrow.address, 150, {from: recruiter2});
    await canHire.recommend(0, {from: recruiter2});
    await canHire.recommend(0, {from: recruiter2});
    await canHire.recommend(0, {from: recruiter2});
    
    const canHireBalance = await token.balanceOf(canHire.address);
    const escrowBalance = await token.balanceOf(escrow.address);
    const employer1Balance = await token.balanceOf(employer1);
    const recruiter1Balance = await token.balanceOf(recruiter1);
    const recruiter2Balance = await token.balanceOf(recruiter2);
    const post = await canHire.posts(0);
    const cancellationFee = await canHire.cancellationFee();

    assert.equal(canHireBalance.toNumber(), 0, "canHire balance is not zero");
    assert.equal(escrowBalance.toNumber(), 1250, "wrong escrow balance");
    assert.equal(employer1Balance.toNumber(), 1857, "wrong employer1 balance");
    assert.equal(recruiter1Balance.toNumber(), 1328, "wrong recruiter1 balance");
    assert.equal(recruiter2Balance.toNumber(), 1278, "wrong recruiter2 balance");
    assert.equal(post[2].toNumber(), 1, "post status is not Open");
    assert.equal(cancellationFee.toNumber(), 1, "wrong cancellation fee");
    
    await canHire.cancelPost(0, {from: employer1});

    const newCanHireBalance = await token.balanceOf(canHire.address);
    const newEscrowBalance = await token.balanceOf(escrow.address);
    const newEmployer1Balance = await token.balanceOf(employer1);
    const newRecruiter1Balance = await token.balanceOf(recruiter1);
    const newRecruiter2Balance = await token.balanceOf(recruiter2);
    const newPost = await canHire.posts(0);

    assert.equal(newCanHireBalance.toNumber(), 10, "wrong canHire balance");
    assert.equal(newEscrowBalance.toNumber(), 0, "wrong escrow balance");
    assert.equal(newEmployer1Balance.toNumber(), 2847, "wrong employer1 balance");
    assert.equal(newRecruiter1Balance.toNumber(), 1428, "wrong recruiter1 balance");
    assert.equal(newRecruiter2Balance.toNumber(), 1428, "wrong recruiter2 balance");
    assert.equal(newPost[2].toNumber(), 3, "post status is not Cancelled");
  });

  it("should close a post", async () => {
    await token.approve(escrow.address, 1000, {from: employer1});
    await canHire.addPost(1000, 50, {from: employer1});
    await token.approve(escrow.address, 100, {from: recruiter1});
    await canHire.recommend(0, {from: recruiter1});
    await canHire.recommend(0, {from: recruiter1});
    await token.approve(escrow.address, 150, {from: recruiter2});
    await canHire.recommend(0, {from: recruiter2});
    await canHire.recommend(0, {from: recruiter2});
    await canHire.recommend(0, {from: recruiter2});
    
    const canHireBalance = await token.balanceOf(canHire.address);
    const escrowBalance = await token.balanceOf(escrow.address);
    const employer1Balance = await token.balanceOf(employer1);
    const recruiter1Balance = await token.balanceOf(recruiter1);
    const recruiter2Balance = await token.balanceOf(recruiter2);
    const post = await canHire.posts(0);
    const cancellationFee = await canHire.cancellationFee();

    assert.equal(canHireBalance.toNumber(), 0, "canHire balance is not zero");
    assert.equal(escrowBalance.toNumber(), 1250, "wrong escrow balance");
    assert.equal(employer1Balance.toNumber(), 1857, "wrong employer1 balance");
    assert.equal(recruiter1Balance.toNumber(), 1328, "wrong recruiter1 balance");
    assert.equal(recruiter2Balance.toNumber(), 1278, "wrong recruiter2 balance");
    assert.equal(post[2].toNumber(), 1, "post status is not Open");
    assert.equal(cancellationFee.toNumber(), 1, "wrong cancellation fee");
    
    await canHire.closePost(0, 3, {from: employer1});

    const newCanHireBalance = await token.balanceOf(canHire.address);
    const newEscrowBalance = await token.balanceOf(escrow.address);
    const newEmployer1Balance = await token.balanceOf(employer1);
    const newRecruiter1Balance = await token.balanceOf(recruiter1);
    const newRecruiter2Balance = await token.balanceOf(recruiter2);
    const newPost = await canHire.posts(0);

    assert.equal(newCanHireBalance.toNumber(), 0, "wrong canHire balance");
    assert.equal(newEscrowBalance.toNumber(), 0, "wrong escrow balance");
    assert.equal(newEmployer1Balance.toNumber(), 1857, "wrong employer1 balance");
    assert.equal(newRecruiter1Balance.toNumber(), 1328, "wrong recruiter1 balance");
    assert.equal(newRecruiter2Balance.toNumber(), 2528, "wrong recruiter2 balance");
    assert.equal(newPost[2].toNumber(), 2, "post status is not Closed");
  });

  it("should reset the cancellation fee", async () => {
    await canHire.setCancellationFee(10, {from: canHireOwner});
    const fee = await canHire.cancellationFee();
    assert.equal(fee.toNumber(), 10, "wrong cancellation fee");
    
    await token.approve(escrow.address, 1000, {from: employer1});
    await canHire.addPost(1000, 50, {from: employer1});
    
    const employer1Balance = await token.balanceOf(employer1);
    const escrowBalance = await token.balanceOf(escrow.address);
    const canHireBalance = await token.balanceOf(canHire.address);

    assert.equal(employer1Balance.toNumber(), 1857, "wrong employer1 balance");
    assert.equal(escrowBalance.toNumber(), 1000, "wrong escrow balance");
    assert.equal(canHireBalance.toNumber(), 0, "wrong CanHire balance");
    
    await canHire.cancelPost(0, {from: employer1});

    const newEmployer1Balance = await token.balanceOf(employer1);
    const newEscrowBalance = await token.balanceOf(escrow.address);
    const newCanHireBalance = await token.balanceOf(canHire.address);

    assert.equal(newEmployer1Balance.toNumber(), 2757, "wrong employer1 balance");
    assert.equal(newEscrowBalance.toNumber(), 0, "wrong escrow balance");
    assert.equal(newCanHireBalance.toNumber(), 100, "wrong CanHire balance");
  });

  it("should change contract activeness", async () => {
    await canHire.setActive(false, {from: canHireOwner});
    const status = await canHire.active();
    assert(!status, "CanHire contract is active.");
    await canHire.setActive(true, {from: canHireOwner});
    const newStatus = await canHire.active();
    assert(newStatus, "CanHire contract is not active.");
  });

})
