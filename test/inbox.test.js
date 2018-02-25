const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

//Create a ganache instance with appropiate provider
const provider = ganache.provider()
const web3 = new Web3(provider);

//Import ABI and bytecode from the compiled contract
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const initialMessage = "Hi, there!";

beforeEach(async() => {
    //Get a list of accounts
    accounts = await web3.eth.getAccounts();

    //Use one of them to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi, there!'] })
        .send({ from: accounts[0], gas: '1000000' })

    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        //Check whether contract address exists
        assert.ok(inbox.options.address);
    });
    it('has a default message', async() => {
        const message = await inbox.methods.message().call();
        assert.equal(message, initialMessage);
    });
});