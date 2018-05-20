var CanYaCoin = artifacts.require("CanYaCoin");
var Escrow = artifacts.require("Escrow");
var CanHire = artifacts.require("CanHire");

module.exports = async function(deployer) {
  await deployer.deploy(CanYaCoin);
  await deployer.deploy(Escrow, CanYaCoin.address);
  await deployer.deploy(CanHire, CanYaCoin.address, Escrow.address);
  // const CanYaCoinAddr = '0x1c35bb17214afe2d324a880ef4258f5f14323f80'; //Ganache
  // const EscrowAddr = '0x486f4e1be36e7ef8f01361af29c39ebf1202de3a'; //Ganache
  // const CanYaCoinAddr = '0x28dA8B592708ACa18a7a0CBB7D70Cb24056abA24'; //Ropsten
  // const EscrowAddr = '0x0efC3065a808470b67BDbA3ee356c3A8b7e73b11'; //Ropsten
  // const CanHireAddr = '0xcAD7e8468E98ED42672182C00691E933534BD6b0'; //Ropsten

}
