const Web3 = require('web3');


class TransactionChecker {
    web3;
    account;


    constructor(address) {
        this.address = address.toLowerCase();
    }

    async checkBlock() {
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        let transactions = block.transactions;
        //console.log('Search Block: ' + transactions);
    
        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                if (this.address == tx.to.toLowerCase()) {
                    console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
                }
            }
        }
      }


}

var transactionChecker = new  TransactionChecker('0x69fb2a80542721682bfe8daa8fee847cddd1a267');
transactionChecker.checkBlock();