import { withStyles } from 'material-ui/styles';
import React from 'react'
import $ from 'jquery';
import getWeb3 from '../utils/getWeb3'
var abi = require('human-standard-token-abi')
import Table from 'material-ui/Table';
import Paper from 'material-ui/Paper';
var BigNumber = require('bignumber.js');
import WalletTableHead from './WalletColumns/WalletTableHead'
import TableTitle from './TableTitle'
import TxSnackbar from './TxSnackbar/TxSnackbar'
import TokenTableBody from './TokenInfo/TokenTableBody'

const styles = theme => ({
    paper: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        margin: 'auto',
        width: 1300,
    }),
    tokenName: {
        textAlign: 'center',
        position: 'absolute',
        margin: 'auto',
        top: theme.spacing.unit * 8.5,
        left: theme.spacing.unit * 4
    },
    wrap: {
        width: theme.spacing.unit * 3,
        height: theme.spacing.unit * 12,
        margin: 'auto',
        textAlign: 'center',
        position: 'relative'
    }
});

const maxAllowance = new BigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935');
const tradePermissionsAllowance = new BigNumber('100000000000000000000000000000000000000000000000000000000000000000000000000000');
const minAllowance = new BigNumber('0');
const tokenTransferProxyAddress = '0x087Eed4Bc1ee3DE49BeFbd66C662B434B15d49d4';

class TokenWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            userAddress: '',
            tokens: [],
            balances: [],
            tradePermissions: [],
            txHash: '',
            snackOpen: false
        };
        this.getBalances = this.getBalances.bind(this);
        this.getTokens = this.getTokens.bind(this);
        this.waitForTxMined = this.waitForTxMined.bind(this);
        this.sendTx = this.sendTx.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    handleRequestClose(event) {
        this.setState({
            snackOpen: false
        })
    }

    componentDidMount() {
        getWeb3.then(results => {
            var web3 = results.web3;
            web3.eth.getAccounts((err, accounts) => {
                this.setState({
                    web3: web3,
                    userAddress: accounts[0]
                }, () => {
                    this.getTokens();
                });
            });
        });

    }

    getTokens = () => {
        $.ajax({
            url: 'http://localhost:8080/tokens'
        }).then(tokens => {
            this.setState({
                tokens: tokens
            }, () => {
                this.getBalances()
            });
        });
    }

    getBalances = () => {
        var context = this;
        var web3 = this.state.web3;
        this.state.tokens.forEach((token, idx) => {
            var tokenAbi = web3.eth.contract(abi).at(token.address);
            tokenAbi.balanceOf.call(web3.eth.accounts[0], function(err, balance) {
                context.setState((prevState, props) => {
                    var newBalances = prevState.balances;
                    newBalances[idx] = balance;
                    return {balances: newBalances}
                });
            })
            tokenAbi.allowance.call(web3.eth.accounts[0], tokenTransferProxyAddress, function(err, allowed) {
                context.setState((prevState, props) => {
                    var newAllowances = prevState.tradePermissions;
                    newAllowances[idx] = allowed.gt(tradePermissionsAllowance);
                    return {tradePermissions: newAllowances};
                })
            })
        })
    }


    waitForTxMined(web3, tx, index) {
        var context = this;
        web3.eth.getTransaction(tx, function(err, res) {
            if (res == null || res.blockHash == null) {
                setTimeout(function() {context.waitForTxMined(web3, tx, index)}, 1000);
            }
            else {
                context.setState((prevState, props) => {
                    var newAllowances = prevState.tradePermissions;
                    newAllowances[index] = !newAllowances[index];
                    return {tradePermissions: newAllowances};
                })
            }
        });
    }

    sendTx = index => event => {
        var context = this;
        var web3 = this.state.web3;
        var contractAddress = this.state.tokens[index].address;
        var token = web3.eth.contract(abi).at(contractAddress);

        var newAllowance = (this.state.tradePermissions[index]) ? minAllowance : maxAllowance;

        token.approve(tokenTransferProxyAddress, newAllowance, {from: this.state.web3.eth.accounts[0]}, function(err, tx) {
            context.setState({
                txHash: tx,
                snackOpen: true
            });
            context.waitForTxMined(context.state.web3, tx, index);
        })
    }

    handleRequestClose = () => {
        this.setState({ snackOpen: false });
    };


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.paper}>
                    <TableTitle
                        title='Your tokens:'
                    />
                    <Table>
                        <WalletTableHead/>
                        <TokenTableBody
                            tradePermissions={this.state.tradePermissions}
                            tokens={this.state.tokens}
                            balances={this.state.balances}
                            sendTx={this.sendTx}
                        />
                    </Table>
                </Paper>

                <TxSnackbar
                    txHash={this.state.txHash}
                    snackOpen={this.state.snackOpen}
                    handleRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

export default withStyles(styles)(TokenWallet)
