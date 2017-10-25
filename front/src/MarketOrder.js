import TextField from 'material-ui/TextField';
import React from 'react'
import getWeb3 from './utils/getWeb3'
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { red } from 'material-ui/colors';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import $ from 'jquery';
import {ZeroEx} from '0x.js';
var BigNumber = require('bignumber.js');
import NumberFormat from 'react-number-format';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import MenuItem from 'material-ui/Menu/MenuItem';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
var abi = require('human-standard-token-abi')

const zeroExConfig = {
    gasPrice: new BigNumber(60000000000)
};
const exchangeAddress = '0x90fe2af704b34e0224bf2299c838e04d4dcf1364';
const fee = new BigNumber(0);
const zeroAddress = '0x0000000000000000000000000000000000000000';




const styles = theme => ({
    paper: theme.mixins.gutters({
        paddingTop: 50,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        margin: 'auto',
        width: 500,
    }),
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: 20,
        marginRight: theme.spacing.unit,
        width: 350,
    },
    menu: {
        width: 200,
    },
    button: {
        width: 40,
        height: 40,
        marginLeft: theme.spacing.unit * 51,
        marginTop: theme.spacing.unit * 3
    },
    icon: {
        height: 20,
        width: 20,
    },
    header: {
        marginLeft: theme.spacing.unit * 0.5
    },
    errorText: {
        color: red[500],
    },
});

var chosenA = '  ...'
var chosenB = '  ...';

function NumberFormatCustomA (props) {
    return (
        <NumberFormat
            {...props}
            onChange={(event, values) => {
                props.onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            suffix={chosenA}
            decimalPrecision={3}
        />
    );
}

function NumberFormatCustomB (props) {
    return (
        <NumberFormat
            {...props}
            onChange={(event, values) => {
                props.onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            suffix={chosenB}
            decimalPrecision={3}
        />
    );
}

const decimals = new BigNumber('1000000000000000000');
const tokenTransferProxyAddress = '0x087Eed4Bc1ee3DE49BeFbd66C662B434B15d49d4';


class MarketOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idA: '',
            idB: '',
            valueA: undefined,
            web3: null,
            userAddress: '',
            tokens: [],
            confirm: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.doSomething = this.doSomething.bind(this);
        this.doSomething = this.doSomething.bind(this);
        this.signAndSend = this.signAndSend.bind(this);
    }

    handleRequestClose = () => {
        this.setState({ confirm: false });
    };

    componentWillMount() {
        getWeb3.then(results => {
            var web3 = results.web3;
            web3.eth.getAccounts((err, accounts) => {
                this.setState({
                    web3: web3,
                    userAddress: accounts[0]
                })
            });
        })
        $.ajax({
            url: 'http://localhost:8080/tokens'
        }).then(tokens => {
            this.setState({
                tokens: tokens
            });
        });
    }

    handleUpdate = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    handleChange = name => event => {
        if (name === 'idA') {
            chosenA = '   ' + this.state.tokens[event.target.value - 1].symbol;
        }
        if (name === 'idB') {
            chosenB = '   ' + this.state.tokens[event.target.value - 1].symbol;
        }
        this.setState({
            [name]: event.target.value,
        });
    };

    doSomething(event) {
        /*

        */
        var context = this;
        var web3 = this.state.web3;
        var tokenAbi = web3.eth.contract(abi).at(this.state.tokens[this.state.idA - 1].address);
        tokenAbi.balanceOf.call(web3.eth.accounts[0], function(err, balance) {
            var enoughBalance = balance.gte(new BigNumber(context.state.valueA).times(decimals));
            tokenAbi.allowance.call(web3.eth.accounts[0], tokenTransferProxyAddress, function(err, allowed) {
                var enoughAllowance = allowed.gte(new BigNumber(context.state.valueA).times(decimals));
                context.setState({
                    confirm: true
                })
            })
        })
    }

    signAndSend() {
        var zeroExInstance = new ZeroEx(this.state.web3.currentProvider, zeroExConfig);
        var context = this;
        var zeroExOrders = [];
        var params = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'POST',
            url: 'http://localhost:8080/orders/market',
            data: JSON.stringify({
                tokenToBuyAddress: this.state.tokens[this.state.idA - 1].address,
                tokenToSellAddress: this.state.tokens[this.state.idB - 1].address,
                tokenToBuyAmount: new BigNumber(this.state.valueA).times(decimals).toString(10)
            }),
        };
        $.ajax(params).then(ordersToFill => {
            ordersToFill.forEach(orderInfo => {
                var fill = orderInfo.fill;
                var order = orderInfo.order;
                var ecSig = {
                    r: order.signatureR,
                    s: order.signatureS,
                    v: Number(order.signatureV)
                };
                var signedOrder = {
                    ecSignature: ecSig,
                    exchangeContractAddress: order.exchangeContract,
                    expirationUnixTimestampSec: new BigNumber(order.expirationTime),
                    feeRecipient: order.feeRecipient,
                    maker: order.maker,
                    makerFee: order.makerFee.toString(),
                    makerTokenAddress: order.makerTokenAddress,
                    makerTokenAmount: new BigNumber(order.makerTokenValue),
                    salt: new BigNumber(order.salt).toString(10),
                    taker: order.taker,
                    takerFee: order.takerFee.toString(),
                    takerTokenAddress: order.takerTokenAddress,
                    takerTokenAmount: new BigNumber(order.takerTokenValue),
                };
                var fillObject = {
                    signedOrder: signedOrder,
                    takerTokenFillAmount: fill
                };
                zeroExOrders.push(fillObject);
            });
            zeroExInstance.exchange.batchFillOrdersAsync(zeroExOrders, false, this.state.userAddress, {shouldValidate: false}).then(txhash => {
                context.setState({confirm: false});
            })
        });
        /*
        $.ajax(params).then(context.setState({confirm: false}));
        var zeroExInstance = new ZeroEx(this.state.web3.currentProvider, zeroExConfig);
        var salt = ZeroEx.generatePseudoRandomSalt().toString(10);

        var zeroExOrder = {
            exchangeContractAddress: exchangeAddress,
            expirationUnixTimestampSec: new BigNumber('1518469201'),
            feeRecipient: zeroAddress,
            maker: this.state.web3.eth.accounts[0].toLowerCase(),
            makerFee: fee,
            makerTokenAddress: this.state.tokens[this.state.idA - 1].address.toLowerCase(),
            makerTokenAmount: new BigNumber(this.state.valueA).times(decimals),
            salt: salt,
            taker: zeroAddress,
            takerFee: fee,
            takerTokenAddress: this.state.tokens[this.state.idB - 1].address.toLowerCase(),
            takerTokenAmount: new BigNumber(this.state.valueB).times(decimals),
        };

        var orderHash = ZeroEx.getOrderHashHex(zeroExOrder);

        zeroExInstance.signOrderHashAsync(orderHash, this.state.web3.eth.accounts[0]).then(sig => {
            var data = JSON.stringify({
                exchangeContract: exchangeAddress,
                expirationTime: Number('1518469201'),
                feeRecipient: zeroAddress,
                maker: this.state.web3.eth.accounts[0].toLowerCase(),
                makerFee: fee,
                makerTokenAddress: this.state.tokens[this.state.idA - 1].address.toLowerCase(),
                makerTokenValue: new BigNumber(this.state.valueA).times(decimals),
                taker: zeroAddress,
                takerFee: fee,
                takerTokenAddress: this.state.tokens[this.state.idB - 1].address.toLowerCase(),
                takerTokenValue: new BigNumber(this.state.valueB).times(decimals),
                salt: salt,
                status: 'OPEN',
                signatureV: sig.v,
                signatureS: sig.s,
                signatureR: sig.r,
                hash: orderHash,
                filled: '0',
                cancelled: '0'
            });

            var params = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: 'POST',
                url: 'http://localhost:8080/orders',
                data: data,
            };
            $.ajax(params).then(context.setState({confirm: false}));
        });
        */
    }

    render() {
        const { classes } = this.props;
        var valueAmsg;
        var valueBmsg;
        if (this.state.valueA) {
            valueAmsg = (this.state.valueA.toString().indexOf('.') > -1) ? this.state.valueA.toString() : this.state.valueA.toString() + '.000';
        }
        if (this.state.valueB) {
            valueBmsg = (this.state.valueB.toString().indexOf('.') > -1) ? this.state.valueB.toString() : this.state.valueB.toString() + '.000';
        }
        var dialog = (this.state.confirm) ? (
            <Dialog open={this.state.confirm} onRequestClose={this.handleRequestClose}>
                <DialogTitle>Confirm an order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This order will be processed immediately by the current market prices.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose} color="primary">
                        Reject
                    </Button>
                    <Button onClick={this.signAndSend} color="primary">
                        Sign and send
                    </Button>
                </DialogActions>
            </Dialog>
        ) : undefined;

        return (<div>
            <Paper className={classes.paper} elevation={3}>
                <Typography className={classes.header} type="title" color="inherit">
                    Place a new market order
                </Typography>
                <TextField
                    id="select-maker-token"
                    select
                    label="Tokens you're buying"
                    className={classes.textField}
                    value={this.state.idA}
                    onChange={this.handleChange('idA')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {this.state.tokens.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.symbol}
                        </MenuItem>
                    ))}
                </TextField>
                <FormControl className={classes.textField}>
                    <InputLabel htmlFor="amount-A">The amount of tokens youre buying</InputLabel>
                    <Input
                        value={this.state.valueA}
                        name='valueA'
                        onChange={this.handleUpdate('valueA')}
                        inputComponent={NumberFormatCustomA}
                        className={classes.input}
                        inputProps={{
                            'aria-label': 'Description',
                        }}
                    />
                </FormControl>
                <TextField
                    id="select-maker-token"
                    select
                    label="Tokens you're selling"
                    className={classes.textField}
                        value={this.state.idB}
                    onChange={this.handleChange('idB')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {this.state.tokens.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.symbol}
                        </MenuItem>
                    ))}
                </TextField>
                <Button fab color="primary" aria-label="add" onClick={this.doSomething} className={classes.button}>
                    <AddIcon className={classes.icon} />
                </Button>
            </Paper>

            {dialog}
            </div>
        )
    }
}

export default withStyles(styles)(MarketOrder);
