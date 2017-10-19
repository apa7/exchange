import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import React from 'react'
import $ from 'jquery';
import getWeb3 from './utils/getWeb3'
var abi = require('human-standard-token-abi')
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import blockies from 'ethereum-blockies-png'
import Avatar from 'material-ui/Avatar'
import AddIcon from 'material-ui-icons/Add';
var BigNumber = require('bignumber.js');
import Snackbar from 'material-ui/Snackbar';
import DeleteIcon from 'material-ui-icons/Delete'
import Switch from 'material-ui/Switch';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

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

    componentWillMount() {
        var context = this;
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
        var h = web3.eth.getTransaction(tx, function(err, res) {

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
        console.log(this.state);
        var ethTxLink = 'https://kovan.etherscan.io/tx/' + this.state.txHash;
        var ethTxText = (this.state.txHash) ? 'tx has been sent' : 'tx rejected';
        return (
            <div>
                <Paper className={classes.paper}>
                    <Typography type="headline" color="inherit">
                        Your tokens:
                    </Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Token</TableCell>
                                <TableCell>Contract address</TableCell>
                                <TableCell> Trade permissions </TableCell>
                                <TableCell numeric>Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.tokens.map((n, idx) => {
                                var img = blockies.createDataURL({
                                    seed: n.address
                                });
                                var link = 'https://kovan.etherscan.io/token/' + n.address;
                                var balance = (this.state.balances[idx]) ? this.state.balances[idx].dividedBy(new BigNumber('1000000000000000000')).toString(10): '';
                                var checked = this.state.tradePermissions[idx];
                                var tradeSwitch = (checked !== undefined) ? (
                                    <Switch
                                        checked={checked}
                                        onChange={this.sendTx(idx)}
                                    />
                                ) : undefined;
                                return (
                                    <TableRow key={n.id}>
                                        <TableCell className={classes.wrap}>
                                            <a href={link} target='_blank'>
                                                <Avatar
                                                src={img}
                                                className={classes.tokenPic}
                                                />
                                                <Typography className={classes.tokenName} type='subheading'>{n.symbol}</Typography>
                                            </a>
                                        </TableCell>
                                        <TableCell>{n.address}</TableCell>
                                        <TableCell>
                                            {tradeSwitch}
                                        </TableCell>
                                        <TableCell numeric>{balance}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    open={this.state.snackOpen}
                    message={<Typography type="title" align='center' color="inherit"><a target='_blank' href={ethTxLink}>{ethTxText}</a></Typography>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleRequestClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}

export default withStyles(styles)(TokenWallet)
