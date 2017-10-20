import React from 'react'
import getWeb3 from './utils/getWeb3'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import $ from 'jquery';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import {ZeroEx} from '0x.js';
import SingleOrder from './SingleOrder'
var BigNumber = require('bignumber.js');
var abi = require('human-standard-token-abi')

const drawerWidth = 240;

const styles = theme => ({
    paper: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        margin: 'auto',
        width: 1300,
    }),
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    menu: {
        width: 200,
    },
    button: {
        width: 40,
        height: 40,
        marginLeft: theme.spacing.unit * 48,
        marginTop: theme.spacing.unit * 3
    },
    icon: {
        height: 20,
        width: 20,
    }
});

const decimals = new BigNumber('1000000000000000000');
const tokenTransferProxyAddress = '0x087Eed4Bc1ee3DE49BeFbd66C662B434B15d49d4';


class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            clickedHash: '',
            balance: undefined,
            allowance: undefined,
            tokens: [],
            web3: null
        }
        this.rowClick = this.rowClick.bind(this);
        this.getSymbolByAddress = this.getSymbolByAddress.bind(this);
        this.findOrderByHash = this.findOrderByHash.bind(this);
    };

    getSymbolByAddress(address) {
        return (this.state.tokens.length > 0) ? this.state.tokens.find(token => {
            return token.address === address
        }).symbol : '';
    }

    componentWillMount() {
        getWeb3.then(results => {
            var web3 = results.web3;
            this.setState({
                web3: web3
            })
        });
        $.ajax({
            url: 'http://localhost:8080/orders/open',
            success: (data) => {
                this.setState({
                    orders: data
                });
            }
        })
        $.ajax({
            url: 'http://localhost:8080/tokens'
        }).then(tokens => {
            this.setState({
                tokens: tokens
            });
        });
    }

    findOrderByHash(txHash) {
        return (this.state.orders.length > 0) ? this.state.orders.find(order => {
            return order.hash === txHash;
        }) : undefined;
    }

    rowClick(event, txHash) {
        var order = this.findOrderByHash(txHash);
        var web3 = this.state.web3;
        var context = this;
        var tokenAbi = web3.eth.contract(abi).at(order.takerTokenAddress);
        tokenAbi.balanceOf.call(web3.eth.accounts[0], function(err, balance) {
            tokenAbi.allowance.call(web3.eth.accounts[0], tokenTransferProxyAddress, function(err, allowed) {
                var enoughBalance = new BigNumber(balance).gte(new BigNumber(order.takerTokenValue));
                var enoughAllowance = new BigNumber(allowed).gte(new BigNumber(order.takerTokenValue))
                context.setState({
                    balance: enoughBalance,
                    allowance: enoughAllowance,
                    clickedHash: txHash,
                });
            })
        })

    }

    render() {
        const { classes } = this.props;
        console.log(this.state);
        var order = (this.state.clickedHash !== '') ? (
            <SingleOrder
                hash={this.state.clickedHash}
                open={true}
                tokens={this.state.tokens}
                balance={this.state.balance}
                allowance={this.state.allowance}
                userAddress={this.state.web3.eth.accounts[0]}
            />
        ) : undefined;
        return (this.state.orders) ? (
            <div>
                <Paper className={classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order maker</TableCell>
                                <TableCell>Maker tokens</TableCell>
                                <TableCell numeric>Amount</TableCell>
                                <TableCell>Taker tokens</TableCell>
                                <TableCell numeric>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.orders.map(n => {
                                return (
                                    <TableRow key={n.id} onClick={event => this.rowClick(event, n.hash)}>
                                        <TableCell>{n.maker}</TableCell>
                                        <TableCell>{this.getSymbolByAddress(n.makerTokenAddress)}</TableCell>
                                        <TableCell numeric>{new BigNumber(n.makerTokenValue).dividedBy(decimals).toString(10)}</TableCell>
                                        <TableCell>{this.getSymbolByAddress(n.takerTokenAddress)}</TableCell>
                                        <TableCell numeric>{new BigNumber(n.takerTokenValue).dividedBy(decimals).toString(10)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
                {order}
            </div>) : undefined;
    }
}

export default withStyles(styles)(OrderList);
