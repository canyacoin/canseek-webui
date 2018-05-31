pragma solidity ^0.4.23;

import "./Escrow.sol";
// import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
// import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol';
// import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol';
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CanHire is Ownable {

    using SafeMath for uint;

    enum Status { Default, Open, Closed, Cancelled }

    struct Post {
        uint id;
        address owner;
        Status status;
        uint bounty;
        uint cost;
        uint honeyPot;
        uint numCandidates;
        uint candidateSelected;
        address[] recommenders;
    }

    StandardToken public canYaCoin;
    Escrow public escrow;
    Post[] public posts;
    uint public numPosts;
    bool public active;
    uint public cancelFee = 1;
    uint public closeFee = 2;

    event PostCreated(uint postId);
    event CandidateRecommended(uint candidateId);
    event EscrowUpdated(address escrowAddress);
    event PostStatusUpdate(Status status);
    event ProfitsExtracted(uint profit);

    modifier is_active(){
        require(active);
        _;
    }

    modifier is_post_owner(uint postId, address caller) {
        require(caller == posts[postId].owner);
        _;
    }

    modifier has_candidate(uint postId, uint candidateId) {
        require(candidateId < posts[postId].numCandidates);
        _;
    }

    modifier post_exist(uint postId) {
        require(postId < numPosts);
        _;
    }

    modifier post_is_open(uint postId) {
        require(posts[postId].status == Status.Open);
        _;
    }

    constructor(StandardToken _canYaCoin, Escrow _escrow) public {
        canYaCoin = _canYaCoin;
        escrow = _escrow;
        setActive(true);
    }

    function getRecommenders(uint postId) public view returns (address[] recommenderList) {
        recommenderList = posts[postId].recommenders;
    }

    function setActive(bool isActive) public onlyOwner {
        active = isActive;
    }

    function setCancellationFee(uint _cancelFee) public onlyOwner {
        cancelFee = _cancelFee;
    }

    function setCloseFee(uint _closeFee) public onlyOwner {
        closeFee = _closeFee;
    }

    function setEscrow(address newEscrow) public onlyOwner {
        escrow = Escrow(newEscrow);
        emit EscrowUpdated(newEscrow);
    }

    function addPost(uint _bounty, uint _cost) public is_active {
        require(_bounty > 0);
        require(canYaCoin.approve(address(escrow), _bounty));
        require(escrow.transferToEscrow(msg.sender, _bounty));
        Post memory newPost;
        newPost.id = numPosts;
        newPost.owner = msg.sender;
        newPost.status = Status.Open;
        newPost.bounty = _bounty;
        newPost.cost = _cost;
        newPost.honeyPot = _bounty;
        posts.push(newPost);
        numPosts = numPosts.add(1);
        emit PostCreated(newPost.id);
    }

    function cancelPost(uint postId)
        public
        is_post_owner(postId, msg.sender)
        post_is_open(postId)
    {
        Post storage post = posts[postId];
        for(uint i = 0; i < post.numCandidates; i.add(1)) {
            require(escrow.transferFromEscrow(post.recommenders[i], post.cost));
        }
        uint fee = post.bounty.mul(cancelFee).div(100);
        require(escrow.transferFromEscrow(address(this), fee));
        require(escrow.transferFromEscrow(msg.sender, post.bounty.sub(fee)));
        posts[postId].status = Status.Cancelled;
        emit PostStatusUpdate(Status.Cancelled);
    }

    function closePost(uint postId, uint candidateId)
        public
        is_post_owner(postId, msg.sender)
        post_is_open(postId)
        has_candidate(postId, candidateId)
    {
        Post storage post = posts[postId];
        require(post.recommenders[candidateId] != msg.sender);
        uint fee = post.bounty.mul(closeFee).div(100);
        require(escrow.transferFromEscrow(address(this), fee));
        require(escrow.transferFromEscrow(post.recommenders[candidateId], post.honeyPot.sub(fee)));
        post.candidateSelected = candidateId;
        post.status = Status.Closed;
        emit PostStatusUpdate(Status.Closed);
    }

    function recommend(uint postId) public {
        require(canYaCoin.approve(address(escrow), posts[postId].cost));
        require(escrow.transferToEscrow(msg.sender, posts[postId].cost));
        uint candidateId = posts[postId].numCandidates;
        posts[postId].numCandidates.add(1);
        posts[postId].recommenders.push(msg.sender);
        posts[postId].honeyPot = posts[postId].honeyPot.add(posts[postId].cost);
        emit CandidateRecommended(candidateId);
    }

    function extractProfits(address _to, uint _amount) public onlyOwner {
        require(_amount > 0);
        require(canYaCoin.approve(address(this), _amount));
        require(canYaCoin.transferFrom(address(this), _to, _amount));
        emit ProfitsExtracted(_amount);
    }

}
