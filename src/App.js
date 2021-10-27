import React from 'react';
import { Loader, Container, Header, Icon, Statistic, Input, Button, Message, Grid, List } from 'semantic-ui-react'
import web3 from './web3.js'
import puzzle from './puzzle.js'

class App extends React.Component {
  state = {
    address: '',
    puzzleID: '',
    prize: '0',
    isPaused: true,
    loading: true,
    isCommiting: false,
    answer: '',
    error: ''
  }

  refreshSummary = async () => {
    if (this.state.isCommiting) return;

    const isPaused = await puzzle.methods.isPaused().call();
    const prize = await puzzle.methods.prize().call();
    const puzzleID = await puzzle.methods.puzzleID().call();
    const ethVal = web3.utils.fromWei(prize, 'ether');

    this.setState({ isPaused, loading: false, prize: ethVal, puzzleID });
  }

  async componentDidMount(props) {
    this.interval = setInterval(async () => await this.refreshSummary(), 1000);
  }

  commitAnswer = async () => {
    this.setState({ loading: true, error: '', isCommiting: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await puzzle.methods.guessAnswer(this.state.answer)
        .send({ from: accounts[0] });
    }
    catch (err) {
      this.setState({ error: err.message });
    }
    this.setState({ loading: false, isCommiting: false });
    await this.refreshSummary();
  }

  async tick() {
    await this.refreshSummary();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    return (
      <Container style={{ marginTop: '20px' }}>

        <Header as='h2' icon textAlign='center'>
          <Icon name='chain' circular />
          <Header.Content>Puzzle</Header.Content>
        </Header>

        <Grid style={{ marginTop: "20px" }} columns={2} divided>

          <Grid.Column>

            {this.state.loading ? <Loader active inline /> :
              <Statistic.Group size="tiny" horizontal >
                <Statistic>
                  <Statistic.Value>address</Statistic.Value>
                  <Statistic.Label>
                    <a target="_blank" rel="noreferrer" href={`https://rinkeby.etherscan.io/address/${puzzle.options.address}`}>
                      {puzzle.options.address}
                    </a>
                  </Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>{this.state.prize} ETH</Statistic.Value>
                  <Statistic.Label>prize</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>{this.state.isPaused ? "paused" : "game is on!"}</Statistic.Value>
                  <Statistic.Label>state</Statistic.Label>
                </Statistic>
              </Statistic.Group>
            }
          </Grid.Column>

          <Grid.Column>
            <div>

              <h3>Rules</h3>
              <List>
                <List.Item>Be the first to guess the answer and you will win the prize.</List.Item>
                <List.Item>Committing answers require MetaMask wallet extension.</List.Item>
                <List.Item>After answer is guessed, new puzzle will populate shortly. Stay tuned!</List.Item>
              </List>

            </div>

            <div style={{ marginTop: "30px" }}>

              <Input fluid action
                error={!!this.state.error}
                placeholder='Your answer...'
                disabled={this.state.isPaused || this.state.isCommiting}>

                <input
                  value={this.state.answer}
                  onChange={e => this.setState({ answer: e.target.value, error: '' })} />

                <Button color="green"
                  onClick={this.commitAnswer}
                  disabled={this.state.isPaused || this.state.isCommiting}>
                    Guess!
                </Button>

              </Input>

              {!this.state.error ? "" :
                <Message error>{this.state.error}</Message>
              }
            </div>
          </Grid.Column>

        </Grid>

        <div style={{ height: "600px", position: "relative" }}>
          {!this.state.isPaused && this.state.puzzleID !== undefined ?

            <iframe sandbox
              src={`https://solveme.edc.org/whoami/?puzzle=${this.state.puzzleID}`}
              title="solveme"
              scrolling="no"
              style={{ border: "0px none", width: "100%", height: "100%", margin: "0 auto", userSelect: "none" }}>

            </iframe>
            :
            <div style={{ width: "100%", height: "100%", paddingTop: "290px", margin: "0 auto", textAlign: "center" }}>
              <h2>
                Awaiting new puzzle...
              </h2>
              <Loader active style={{ marginTop: "60px" }} />
            </div>
          }
          <div style={{ width: "100%", height: "50px", background: "white", position: "absolute", top: "0", left: "0" }} />
          <div style={{ width: "100%", height: "50px", background: "white", position: "absolute", bottom: "0", left: "0" }} />
        </div>

      </Container>
    );
  }
}

export default App;
