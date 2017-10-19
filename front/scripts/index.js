//initializing web3 and solc
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var solc = require('solc');
var fs = require("fs");

//compiles a contract from 'contracts/Channel.sol'
//return a web3.eth.Contract instance and bytecode
var compileContract = function() {
    //opens a file
    //
    var defaultPath = "./contracts/Channel.sol";
    //in case the package in installed via "npm install"
    var installedPath = "./node_modules/channeltest1/contracts/Channel.sol";
    var source;
    if (fs.existsSync(defaultPath)) {
        source = fs.readFileSync(defaultPath, 'utf8');
    }
    else {
        source = fs.readFileSync(installedPath, 'utf8');
    }
    //compiling a contract
    var compiledContract = solc.compile(source, 1);
    var abi = compiledContract.contracts[':Channel'].interface;
    var bytecode = compiledContract.contracts[':Channel'].bytecode;
    var myContract = new web3.eth.Contract(JSON.parse(abi));

    return {
        instance: myContract,
        byteCode: bytecode //required to deploy a contract
    };
}

//a helper function that returns an object
//containing (r, s, v) values used by ecrecover
var sigUtil = function(signature) {
    return {
        r: signature.substr(0,66),
        s: "0x" + signature.substr(66,64),
        v: web3.utils.toHex(web3.utils.toDecimal(signature.substr(130, 2)) + 27)
    }
}

//deploys a contract with fromAddress as the owner,
//toAddress as a recepient and locks initialValue ether
var createChannel = function(fromAddress, toAddress, timeout, initialValue) {
    var compiled = compileContract();
    var instance = compiled.instance;
    var bytecode = compiled.byteCode;
    //deploying and getting contract address
    var deployPromise = instance.deploy({
        data: bytecode,
        arguments: [toAddress, timeout]
    }).send({
       from: fromAddress,
       gas: 1500000, //estimated: 756193, deployed on testrpc: around 650000 - 700000
       gasPrice: '3000000000',
       value: initialValue //web3.utils.toWei(value, units)
    }).on('confirmation')
    .then(function(newContractInstance) {
        contractAddress = newContractInstance.options.address;
        return contractAddress;
    });
    return deployPromise;
}

//validates a channel (called by a recepient)
//by checking the recepient address, a timeout and the amount of wei locked
var isValidChannel = function(channelAddress, recipientAddress, timeout, value) {
    var compiled = compileContract();
    var contractInstance = compiled.instance;
    contractInstance.options.address = channelAddress;
    return contractInstance.methods.validate(timeout, value).
        call({from: recipientAddress});
}

//generates a checque with value wei by signing (contractAddress + value)
//used by the payer
var newCheque = function(contractAddress, signerAddress, value) {
    //signed message: contractAddress + value
    var msg = web3.utils.soliditySha3(contractAddress, value);
    return web3.eth.sign(msg, signerAddress);
}

//validates a cheque by its signature, contract address and a cheque value
//checks the signer of the check and its value
var isValidCheque = function(signature, channelAddress, value) {
    var compiled = compileContract();
    var contractInstance = compiled.instance;
    contractInstance.options.address = channelAddress;
    //signed message
    var msg = web3.utils.soliditySha3(channelAddress, value);
    //obtaining (r, s, v) parameters used in ecrecover
    var rsv = sigUtil(signature);
    //verifying a signature and value
    return contractInstance.methods.verifyCheque(msg, rsv.v, rsv.r, rsv.s, value)
        .call();
}

//used by the recipient. closes a channel by providing both signatures
//and sets the refunds
var closeChannel = function(channelAddress, signature, recipientAddress, value) {
    var compiled = compileContract();
    var contractInstance = compiled.instance;
    contractInstance.options.address = channelAddress;
    //signed message
    var msg = web3.utils.soliditySha3(channelAddress, value);
    //getting (r, s, v) from first signature
    var rsv1 = sigUtil(signature);
    //signing a cheque with a recipient address
    var rsv2;

    var params = {
        from: recipientAddress, gas: 1500000, gasPrice: '30000000000'
    };

    var signedMsgPromise = contractInstance.methods.closeChannel(msg, rsv1.v, rsv1.r, rsv1.s, value).send(params).
    then(function() {
        return newCheque(channelAddress, recipientAddress, value);
    }).then(function(sig) {
        rsv2 = sigUtil(sig.toString());
        return contractInstance.methods.closeChannel(msg, rsv2.v, rsv2.r, rsv2.s, value).
            send(params);
    }).then(function() {
        return contractInstance.methods.closed().call();
    });
    return signedMsgPromise;
}

//used by the payer to close a channel in case of a timeout
var channelTimeout = function(channelAddress, senderAddress) {
    var compiled = compileContract();
    var contractInstance = compiled.instance;
    contractInstance.options.address = channelAddress;

    var params = {
        from: senderAddress, gas: 1500000, gasPrice: '30000000000'
    };

    var closedPromise = contractInstance.methods.channelTimeout().send(params).then(function() {
        return contractInstance.methods.closed().call();
    })
    return closedPromise;
}

//check returns after the channel has been closed
var pendingReturns = function(channelAddress, userAddress) {
    var compiled = compileContract();
    var contractInstance = compiled.instance;
    contractInstance.options.address = channelAddress;
    return contractInstance.methods.withdraw(userAddress).call();
}

//used to withdraw funds from the contract once its closed
var withdrawFunds = function(channelAddress, userAddress) {
    var compiled = compileContract();
    var contractInstance = compiled.instance;
    contractInstance.options.address = channelAddress;
    var params = { //estimated gas: 631
        from: userAddress, gas: 1500000, gasPrice: '30000000000'
    };
    return contractInstance.methods.withdrawFunds().send(params);
}


//exports.compileContract = compileContract;
//exports.sigUtil = sigUtil;
exports.createChannel = createChannel;
exports.isValidChannel = isValidChannel;
exports.newCheque = newCheque;
exports.isValidCheque = isValidCheque;
exports.closeChannel = closeChannel;
exports.channelTimeout = channelTimeout;
exports.pendingReturns = pendingReturns;
exports.withdrawFunds = withdrawFunds;
