import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import factory from "./ethereum/factory";
import Auction from "./ethereum/auction";
import web3 from "./ethereum/web3";
import Header from "./components/Header";
import Auctions from "./components/Auctions";
import AuctionItem from "./components/AuctionItem";
import NewAuction from "./components/NewAuction";
import MyAuction from "./components/MyAuction";
import MyBet from "./components/MyBet";
import Activate from "./components/Activate";
import Closed from "./components/Closed";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export class App extends Component {
  state = {
    userAccount: "",
    auctionAddresses: [],
    auctionSummaries: [],
    myAuction:[],
    myBet:[],
    activate:[],
    closed:[],
    loading: true,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const auctionAddresses = await factory.methods.getDeployedAuctions().call();
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined || accounts === undefined) {
      accounts = ["None. Please install metamask, log in and reload"];
    }
    let auctionSummaries = [];
    for (let i in auctionAddresses) {
      const tempAuction = Auction(auctionAddresses[i]);
      let summary = await tempAuction.methods.getSummary().call();
      summary = this.getFormatted(summary, auctionAddresses[i]);
      auctionSummaries.push(summary);
    }
    let myAuction = [];
    for (let i in auctionAddresses) {
      const tempAuction = Auction(auctionAddresses[i]);
      let summary = await tempAuction.methods.getSummary().call();
      summary = this.getFormatted(summary, auctionAddresses[i]);
      if(summary.manager===accounts[0]){
        myAuction.push(summary)
      }
    }
    let activate=[];
    for (let i in auctionAddresses) {
      const tempAuction = Auction(auctionAddresses[i]);
      let summary = await tempAuction.methods.getSummary().call();
      summary = this.getFormatted(summary, auctionAddresses[i]);
      if(summary.status){
        activate.push(summary);
      }
    }
    let closed=[];
    for (let i in auctionAddresses) {
      const tempAuction = Auction(auctionAddresses[i]);
      let summary = await tempAuction.methods.getSummary().call();
      summary = this.getFormatted(summary, auctionAddresses[i]);
      if(!summary.status){
        closed.push(summary);
      }
    }
    let myBet=[];
    for (let i in auctionAddresses) {
      const tempAuction = Auction(auctionAddresses[i]);
      let summary = await tempAuction.methods.getSummary().call();
      summary = this.getFormatted(summary, auctionAddresses[i]);
      for (let j = 1; j <= summary.biddersCount; j++) {
        const temp =await tempAuction.methods.bidders(j).call();
        if(accounts[0]===temp.bidder){
          myBet.push(summary);
        }

        
      }
    }

    this.setState({
      userAccount: accounts[0],
      auctionAddresses,
      auctionSummaries,
      myAuction,
      myBet,
      activate,
      closed,
      loading: false,
    });
  }

  getFormatted = (summary, deployedAddress) => {
    return {
      manager: summary[0],
      itemName: summary[1],
      itemDescription: summary[2],
      minimumBid: summary[3],
      biddersCount: summary[4],
      status: summary[5],
      highest:web3.utils.fromWei(summary[6], "ether"),
      deployedAddress,
    };
  };
  HelpModal = () => {
    return (
      <div>
        <Dialog
          open={this.state.openHelp}
          onClose={this.handleHelpClose}
          scroll="body"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Installing Metamask and creating an Ether Wallet</DialogTitle>
          <DialogContent>
            <DialogContentText>
            This platform requires <a href="https://metamask.io/">Metamask</a>. Acquiring an ether wallet 
            is as simple as installing Metamask within your browser. This will generate a wallet for you. 
            You can then select the "Rinkeby Test Network" from the drop down at the top of the viewer.
            </DialogContentText>
          </DialogContent>
          <DialogTitle id="scroll-dialog-title">Acquiring testnet Ether from an Etherem Faucet</DialogTitle>
          <DialogContent>
            <DialogContentText>
            You can request some testnet ether through the <a href="https://www.rinkeby.io/#faucet">Rinkeby Authenticated Faucet</a>. 
            Simply follow the instructions, select "18.75/3 days" from the "Give me Ether" dropdown, then using the social media platform
            of your choice from the list, post the address of your first account within Metamask. Share this link to the faucet and you will
            recieve 18.75 ether for use within the Rinkeby testnet. Ensure you have the correct address as you may not be able to request 
            more ether for a period of 3 days. 
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  render() {
    const { userAccount, auctionSummaries, myAuction, myBet, activate,closed ,loading } = this.state;
     console.log(auctionSummaries);
    return (
      <Router>
        <div>
          <Header userAccount={userAccount} loading={loading} />
          {this.HelpModal()}
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Auctions
                    {...props}
                    loading={loading}
                    userAccount={userAccount}
                    auctionSummaries={auctionSummaries}
                  />
                )}
              />
              <Route
                exact
                path="/item/:deployedAddress"
                render={(props) => (
                  <AuctionItem {...props} userAccount={userAccount} />
                )}
              />
              <Route
                exact
                path="/newAuction"
                render={(props) => (
                  <NewAuction
                    {...props}
                    loading={loading}
                    factory={factory}
                    userAccount={userAccount}
                  />
                )}
              />
              <Route
                exact
                path={`/myAuction/:userAccount`}
                render={(props) => (
                  <MyAuction
                    {...props}
                    loading={loading}
                    myAuction={myAuction}
                  />
                )}
              />
              <Route
                exact
                path={`/myBet/:userAccount`}
                render={(props) => (
                  <MyBet
                    {...props}
                    loading={loading}
                    myBet={myBet}
                  />
                )}
              />
              <Route
                exact
                path={`/activate`}
                render={(props) => (
                  <Activate
                    {...props}
                    loading={loading}
                    activate={activate}
                  />
                )}
              />
              <Route
                exact
                path={`/closed`}
                render={(props) => (
                  <Closed
                    {...props}
                    loading={loading}
                    closed={closed}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

