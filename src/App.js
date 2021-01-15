import "./App.css";
import lottery from "./lottery";
import { Component } from "react";
import web3 from "./web3";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
  };
  async componentDidMount() {
    // When using Metamask provider, no need to specify from: accounts[0],
    // because the default property is already set.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Transacting..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({
      message: "Transaction complete, you have entered into the lottery",
    });
  };
  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts()
    this.setState({message: "Choosing a winner, hold tight!..."})
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    this.setState({message: "Winner has been picked"})
  };
  render() {
    return (
      <div>
        <h2>lottery contract</h2>
        <p>Manager: {this.state.manager}</p>
        <p>Number of players: {this.state.players.length}</p>
        <p>Balance: {web3.utils.fromWei(this.state.balance, "ether")} ether</p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4> Enter into the lottery</h4>
          <div>
            <label>Amount? </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Let's pick a winner</h4>
        <button onClick={this.onClick}>Pick winner</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
