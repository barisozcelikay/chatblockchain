/* eslint-disable array-callback-return */
import Web3 from 'web3';
import React, { Component } from 'react';
import ChatApp from '../abis/ChatApp.json'
import mainLogo from './arrow.png'


const InputDataDecoder = require('ethereum-input-data-decoder');
const abi =  [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        }
      ],
      "name": "etherAskEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "name": "etherSentEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "messageSentEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            }
          ],
          "indexed": false,
          "internalType": "struct ChatApp.Message[]",
          "name": "messages",
          "type": "tuple[]"
        }
      ],
      "name": "messagesFetchedEvent",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "messages",
      "outputs": [
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "sendMsg",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "sendEther",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "value",
          "type": "string"
        }
      ],
      "name": "askEther",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "getAllMsg",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
const decoder = new InputDataDecoder(abi);



class Chat extends Component {

  static user = {
    userAddress: 'A',
    friends : []
  }

  static message = {
    sender: 'A',
    receiver: 'B',
    message: 'Selam',
    time: ""
  }

  static friend = {
    friend_index : 1,
    friend_address : "B",
    total_message : 0,
    chats : []
  }
  static num = 1;
  

  

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
        await this.listenToMessages()
        await this.listenToEther()
        await this.listenToAskEther()
        await this.listenToFetchAllMsg()
        await this.fetchAllMsg()
        await this.updateUIData()
      }

    constructor(props) {
        super(props)
        let chats = [
            {
                msg: "This is a blockchain demo, try to tap in!",
                response: true
            },
            {
                msg: "Enter \"send_ether: 0.0001\" to send some tokens to your recipient ????",
                response: false
            }
        ]

        
        this.state = {
          users: [],
          user : {
            user_index: 0,
            first_open : true,
            userAddress: 'A',
            friends : []
          },
          message : {
            sender: 'A',
            receiver: 'B',
            message: 'Selam',
          },
          friend : {
            friend_index : 0,
            friend_address : "B",
            total_message : 0,
            chats : []
          },

            fixedChats: chats,
            chats: [],
            inputValue: '',
            accounts: [],
            account: '',
            nbBlocks: 0,
            otherAccount: '',
            accountNbTransactions: 0,
            otherAccountNbTransactions: 0,
            accountBalance: 0,
            otherAccountBalance: 0,
            lastGas: 0,
            blockHash: '',
            didATransaction: false,
            isLastTransactionSuccess: false,
            didARequest: false,
            accountRequesting: '',
            accountRequested: '',
            valueRequested: 0,
        }
    }

    // ------- init ------
    async loadWeb3() {
    
        if (window.ethereum) {
    
          // Need to put ws:// instead of http:// because of web sockets.
          // Web sockets are mandatory to listen to events.
          window.web3 = new Web3(Web3.providers.WebsocketProvider("ws://localhost:7545"))
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
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




      async  GetTransactions(){
        var latestBlock=await window.web3.eth.getBlockNumber()
        var Block =await window.web3.eth.getBlock(latestBlock)
    
        Block.transactions.forEach(async(transactionAddress) => {
            let t=await window.web3.eth.getTransaction(transactionAddress)
            console.log(t)
        })
        
    }
    


    async loadBlockchainData()  {
      
        const web3 = window.web3
    
        const accounts = await web3.eth.getAccounts()
        this.setState({ 
            accounts: accounts,
            account:this.state.account === '' ? accounts[0] : this.state.account,
            otherAccount: this.state.otherAccount === '' ? accounts[1] : this.state.otherAccount
         })


         let a = this.state.accounts;
      
      

          let _friends = [];

          for(let i = 0; i<a.length ; i++)
         {

          if(accounts[i] != this.state.account)
          {
             
              this.setState(
              {
                friend : 
                {
                  friend_index : i,
                  friend_address : accounts[i],
                  total_message : 0,
                  chats : []
                }
              }
            )

          _friends.push(this.state.friend)

          this.setState(
              {
                user: {
                  user_index : i,
                  userAddress: this.state.account,
                  friends : _friends,
                  first_open : false
                }
              }
            )
          }
         }
         
         

         

      console.log(this.state.user);
        console.log(accounts)
    
        const ethBalance = await web3.eth.getBalance(this.state.account)
        const ethBalance2 = await web3.eth.getBalance(this.state.otherAccount)
        this.setState({ ethBalance })
        // account & other account balances
        let a1 =  window.web3.utils.fromWei(ethBalance, 'ether');
        let a2 =  window.web3.utils.fromWei(ethBalance2, 'ether');
        this.setState({accountBalance : a1, otherAccountBalance : a2})


        // account & other account transactions
        let t1 = await window.web3.eth.getTransactionCount(this.state.account)
        let t2 = await window.web3.eth.getTransactionCount(this.state.otherAccount)
        this.setState({
            accountNbTransactions: t1,
            otherAccountNbTransactions: t2 
        })
        
        // number of blocks
        const latest = await window.web3.eth.getBlockNumber()
        this.setState(
            {
                nbBlocks : latest
            }
        )
        // last transaction gas
        const lastBlockNumber = await window.web3.eth.getBlockNumber();
        let block = await window.web3.eth.getBlock(lastBlockNumber);
        block = await window.web3.eth.getBlock(lastBlockNumber);

        const lastTransaction = block.transactions[block.transactions.length - 1];
        const transaction = await window.web3.eth.getTransaction(lastTransaction);
        console.log(web3.eth);
        console.log("girilen input");
        console.log(transaction.input);
        ;
        console.log(block.transactions)
        // console.log(result2)
        const result = decoder.decodeData(transaction.input);
        console.log("Yenim");
        console.log(result)
        console.log(web3.utils.toAscii(lastTransaction));
        let bl = await window.web3.eth.getBlock();
        console.log(bl);



        

        

            /*
        let block2 = await window.web3.eth.getBlock();
        let number = block.number;
        let transactions = block.transactions;
        //console.log('Search Block: ' + transactions);
    
        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await window.web3.eth.getTransaction(txHash);
                
                    console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
                
               
            }
        }
        */

        
        



        this.setState({
            blockHash: transaction["blockHash"],
            lastGas: transaction["gas"],
        })
        // Load smart contract
        const networkId =  await web3.eth.net.getId()
        const chatAppData = ChatApp.networks[networkId]
        console.log(networkId);
        const abi = ChatApp.abi
        if(chatAppData) {
       // console.log("Load blocktay??m :",this.state.otherAccount);
          const chatContract = new web3.eth.Contract(abi, this.state.otherAccount )
          console.log(chatContract);
          this.setState({ chatContract: chatContract })
        }
        else {
            window.alert('Chat contract not deployed to detected network.')
        }
    }

    // ------- listeners ------
    async listenToMessages() {
        var binded = this.didReceiveMessageBinded.bind(this)
        this.state.chatContract.events.messageSentEvent({})
        .on('data', binded)
        .on('error', console.error);
    }

    async listenToEther() {
        var binded = this.didReceiveEtherBinded.bind(this)
        this.state.chatContract.events.etherSentEvent({})
        .on('data', binded)
        .on('error', console.error);
    }

    async listenToAskEther() {
        var binded = this.didReceiveAskEtherBinded.bind(this)
        this.state.chatContract.events.etherAskEvent({})
        .on('data', binded)
        .on('error', console.error);
    }

    async listenToFetchAllMsg() {
        var binded = this.didReceiveAllMsgBinded.bind(this)
        this.state.chatContract.events.messagesFetchedEvent({})
        .on('data', binded)
        .on('error', console.error);
    }

    // ------- handlers ------
    async didReceiveMessageBinded(event){
        const message = event.returnValues.message
        if (event.returnValues.from === this.state.account){
            this.didReceiveMessage(message, true)
        }
        if (event.returnValues.to === this.state.account){
            this.didReceiveMessage(message, false)
        }
        this.setState({
            didATransaction: false,
            didARequest: false,
        })
        await this.updateUIData()
    }

    async didReceiveEtherBinded(event) {
        this.setState({
            didATransaction: true,
            didARequest: false,
            isLastTransactionSuccess: event.returnValues.success
        })
        // await this.wait()
        await this.updateUIData()
    }

    async didReceiveAskEtherBinded(event){
        if (this.state.account === event.returnValues.to) {
            let value_as_wei = window.web3.utils.fromWei(
                event.returnValues.value, "ether")
    
            this.setState({
                didATransaction: false,
                didARequest: true,
                accountRequesting: event.returnValues.from,
                accountRequested: event.returnValues.to,
                valueRequested: value_as_wei,
            })
            await this.updateUIData()
        }
    }

    async didReceiveAllMsgBinded(event){
        let allMsg = []

        event.returnValues.messages.forEach((message) => {
            allMsg.push({
                msg: message['message'],
                response: message['from'] === this.state.account
            })
        })
        if (allMsg.length === 0)
            allMsg = this.state.fixedChats

        this.setState({
            chats: allMsg
        })
        await this.updateUIData()
    }

    async didReceiveMessage(message, isResponse) {
        let chats = this.state.chats
        console.log("Chat Sayisi : ",chats.length)
        chats.push(
            {
                msg: message,
                response: isResponse
            }
        )
        this.setState({
            chats: chats,
            inputValue: ''
        })
    }

    async didSendMessage(message) {
        console.log("Haydi ",this.state.otherAccount)
        this.state.chatContract.methods.sendMsg(this.state.otherAccount, message)
            .send({ from: this.state.account, gas: 22000 ,}) // 1500000

            var defaultAddress = this.state.accounts[0]

            this.state.chats.push({
                msg:message,
                response:this.state.account == defaultAddress ? true : false
            })

            this.setState({chats:this.state.chats})
        await this.sendEtherIfAsked()
        await this.askEtherIfAsked()
        this.setState({
            inputValue : ""
        })
        await this.loadBlockchainData()
    }

    async sendEtherIfAsked() {
        let splitted = this.state.inputValue.split(':')
        if (splitted.length !== 2)
            return false

        if (splitted[0] == "send_ether" && this.isNumeric(splitted[1])) {
            let asWei = parseFloat(splitted[1]) * 1e18
            console.log("Oyee",this.state.otherAccount);
            this.state.chatContract.methods.sendEther(this.state.otherAccount).send({
                from: this.state.account,
                value: asWei,

            })
            return true
        }
        return false
    }

    async askEtherIfAsked() {
        let splitted = this.state.inputValue.split(':')
        if (splitted.length !== 2)
            return false

        if (splitted[0] == "ask_ether" && this.isNumeric(splitted[1])) {
            var asWei = (parseFloat(splitted[1]) * 1e18).toString()
            this.state.chatContract.methods.askEther(this.state.otherAccount, asWei).send({ from: this.state.account })
            return true
        }
        return false
    }

    async fetchAllMsg() {
        await this.state.chatContract.methods.getAllMsg(this.state.otherAccount).send({ from: this.state.account })
    }

    // ------- UI state updaters ------
    async updateUIData() {
        await this.updateNbTransactions()
        await this.updateBalances()
        await this.updateBlocks()
        await this.updateLastGas()
    }

    updateInputValue(evt) {
        this.setState({
          inputValue: evt.target.value
        });
      }

    async updateAddressSelect(newValue, isOtherAccount) {
        if (isOtherAccount) {
            console.log(this.state.otherAccount);
            this.setState({
                otherAccount: newValue,
                chats: this.state.chats
            })
            console.log("update addressteyim :",this.state.otherAccount);
        }
        else {
            this.setState({
                account: newValue,
                chats: this.state.chats
            })
        }

        console.log(newValue);
        await this.loadBlockchainData()
        await this.wait()
        await this.fetchAllMsg()
        await this.updateUIData()
        
    }

     async updateSelect(newValue, isOtherAccount) {
        if (isOtherAccount) {
            this.setState({
                otherAccount: newValue,
                chats: this.state.chats
            })
        }
        else {
            this.setState({
                account: newValue,
                chats: this.state.chats
            })
        }

        console.log(newValue);
        await this.wait()
        await this.fetchAllMsg()
        await this.updateUIData()

        return newValue;
    }

    async updateNbTransactions() {
        let accountNbTransactions = await window.web3.eth.getTransactionCount(this.state.account)
        let otherAccountNbTransactions = await window.web3.eth.getTransactionCount(this.state.otherAccount)
        this.setState({
            accountNbTransactions: accountNbTransactions,
            otherAccountNbTransactions: otherAccountNbTransactions
        })
    }

    async updateBalances() {
        let accountBalance = await window.web3.eth.getBalance(this.state.account)
        let otherAccountBalance = await window.web3.eth.getBalance(this.state.otherAccount)
        this.setState({
            accountBalance: window.web3.utils.fromWei(accountBalance, 'ether'),
            otherAccountBalance: window.web3.utils.fromWei(otherAccountBalance, 'ether')
        })
    }

    async updateBlocks() {
        const latest = await window.web3.eth.getBlockNumber()
        this.setState({
            nbBlocks: latest
        })
        await this.loadBlockchainData()
    }

    async updateLastGas() {
        const lastBlockNumber = await window.web3.eth.getBlockNumber();
        let block = await window.web3.eth.getBlock(lastBlockNumber);
        block = await window.web3.eth.getBlock(lastBlockNumber);

        const lastTransaction = block.transactions[block.transactions.length - 1];
        const transaction = await window.web3.eth.getTransaction(lastTransaction);

        this.setState({
            blockHash: transaction["blockHash"],
            lastGas: transaction["gas"],
        })

        await this.loadBlockchainData()
    }

    // ------- UI ------
    getMessagesAsDivs() {

      var defaultAddress = "0x3074895331022bae480846aDb9948e8276BAc558";
      this.state.chats.map(x =>  {
        console.log(x);
        console.log("dsadas");
        if(defaultAddress === this.state.account )
        {
          x.response = true;
        }
        else
        {
          x.response = false;
        }

        console.log(x);


          
      })

        let chatDivs = this.state.chats.map(x => x.response ? 
            <div class="message text-only">
                <div class="response">
                    <p class="text"> {x.msg} </p>
                    </div>
                </div> :
            <div class="message text-only">
                <p class="text"> {x.msg} </p>
            </div>
        )
        return chatDivs.reverse()
    }

    getToggleAdresses(isOtherAccount) {
        var addresses = []
        for (var i = 0; i < this.state.accounts.length; i++) {
            let account = this.state.accounts[i]
            if (isOtherAccount && account == this.state.otherAccount
                || !isOtherAccount && account == this.state.account)
                addresses.push(<option value={account} selected>{account}</option>)
            else {
                addresses.push(<option value={account}>{account}</option>)
            }
        }
        return addresses
    }

    displayEtherTransactionStatus() {
        if (!this.state.didATransaction)
            return

        if (this.state.isLastTransactionSuccess)
            return <div style={{color: "green"}}>ETH transaction succeeded!</div>
        else
            return <div>error</div>
    }

    displayAskEtherPopUp() {
        let to = this.state.accountRequested
        let valueAsEther = this.state.valueRequested
        let valueAsWei = parseFloat(this.state.valueRequested) * 1e18
        
        if (this.state.didARequest && to === this.state.account) {
            return (
            <div className="didAskContainer">
                <h6>Ether request</h6>
                <p>Account { to } requests you { valueAsEther } ether.</p>
                
                <button class="btn btn-success send-btn" onClick={() => this.state.chatContract.methods.sendEther(this.state.accountRequesting).send({
                    from: to,
                    value: valueAsWei
                })}>Accept</button>
            </div>
            )
        }
        return
    }

    // ------- helpers ------
    isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) &&
               !isNaN(parseFloat(str))
      }

    async wait() {
        const noop = ()=>{};
        for (var i = 0; i < 10000; i++)
            noop()
    }

    // ------- rendering ------
    render() {
      
        return (
        <body>
            <div class="block-container">
                <div class="row">
                    <div class="col-7 left-block">
                        <section class="chat">
                            <div class="header-chat">
                                <div class="left">
                                    <img src={mainLogo} class="arrow"/>
                                    <select class="custom-select" onChange={e => this.updateAddressSelect(e.target.value, false)} >
                                        { this.getToggleAdresses(false) }
                                    </select>     
                                </div>
                                <div class="right">
                                    <select class="custom-select" onChange={e => this.updateAddressSelect(e.target.value, true)} >
                                        { this.getToggleAdresses(true) }
                                    </select>  
                                </div>
                            </div>
                            <div class="messages-chat">
                            { this.getMessagesAsDivs() }
                            </div>
                        </section>
                        <div class="footer-chat">
                            <i class="icon fa fa-smile-o clickable" style={{fontSize: "25pt"}} aria-hidden="true"></i>
                            <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} type="text" class="write-message" placeholder="Type your message here"></input>
                            <i class="icon send fa fa-paper-plane-o clickable" aria-hidden="true"></i>
                            <button class="btn btn-success send-btn" onClick={() => this.didSendMessage(this.state.inputValue)}>Send</button>
                        </div>
                    </div>
                    <div class="col-5 right-block">
                        <h3>Blockchain state</h3>
                        <p>Number of blocks: { this.state.nbBlocks }</p>
                        <p>Last transaction gas: { this.state.lastGas }</p>
                        <div class="sender-block blockchain-block">
                            <p><b>Sender address:</b></p>
                            <p>{ this.state.account }</p>
                            <p>Number of transactions: { this.state.accountNbTransactions }</p>
                            <p>Wallet balance: { this.state.accountBalance } ETH</p>
                        </div>
                        <div class="recip-block blockchain-block">
                            <p><b>Recipient address:</b></p>
                            <p>{ this.state.otherAccount }</p>
                            <p>Number of transactions: { this.state.otherAccountNbTransactions }</p>
                            <p>Wallet balance: { this.state.otherAccountBalance } ETH</p>
                        </div>

                        <div class="alert-transac">
                            { this.displayEtherTransactionStatus() }
                        </div>
                        <div class="alert-request">
                            { this.displayAskEtherPopUp() }
                        </div>
                        
                    </div>
                </div>
                
                </div>
        </body>)
    }

}

export default Chat;