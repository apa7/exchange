import React from 'react'
import getWeb3 from './utils/getWeb3'
import { withStyles } from 'material-ui/styles';
import $ from 'jquery';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import {ZeroEx} from '0x.js';
var BigNumber = require('bignumber.js');
BigNumber.config({ ERRORS: false });
import { red } from 'material-ui/colors';


const zeroExConfig = {
    gasPrice: new BigNumber(60000000000)
};

const styles = theme => ({
    paper: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
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
    },
    errorText: {
        color: red[500],
    },
});

const decimals = new BigNumber('1000000000000000000');

class SingleOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            open: true,
            web3: null,
            userAddress: '',
            tokens: [],
            balance: undefined,
            allowance: undefined
        }
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleTransaction = this.handleTransaction.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getSymbolByAddress = this.getSymbolByAddress.bind(this);
        this.getButtonState = this.getButtonState.bind(this);
        this.getHelperMessage = this.getHelperMessage.bind(this);
    };

    getSymbolByAddress(address) {
        return (this.state.tokens.length > 0 && address !== undefined) ? this.state.tokens.find(token => {
            return token.address === address
        }).symbol : '';
    }

    componentWillMount() {
        this.setState({
            tokens: this.props.tokens,
            balance: this.props.balance,
            allowance: this.props.allowance,
            userAddress: this.props.userAddress
        })
        $.ajax({
            url: 'http://localhost:8080/orders/' + this.props.hash,
            crossDomain: true,
            success: (data) => {
                this.setState({
                    order: data
                });
            }
        })
        getWeb3.then(results => {
            var web3 = results.web3;
            web3.eth.getAccounts((err, accounts) => {
                this.setState({
                    web3: web3,
                    userAddress: accounts[0]
                })
            });
        })
    }

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    handleTransaction = () => {
        var context = this;
        var order = this.state.order;
        var ecSig = {
            r: order.signatureR,
            s: order.signatureS,
            v: Number(order.signatureV)
        };
        console.log('Salt ' + new BigNumber(order.salt.toString()));
        console.log(ecSig);
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
        console.log(signedOrder);
        var zeroExInstance = new ZeroEx(this.state.web3.currentProvider, zeroExConfig);
        zeroExInstance.exchange.fillOrderAsync(signedOrder, new BigNumber(order.openValue), false, this.state.userAddress, {shouldValidate: false}).then(txhash => {
            context.setState({open: false});
        })
    };

    handleCancel = () => {
        var context = this;
        var order = this.state.order;
        var ecSig = {
            r: order.signatureR,
            s: order.signatureS,
            v: Number(order.signatureV)
        };
        console.log('Salt ' + new BigNumber(order.salt.toString()));
        console.log(ecSig);
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
        console.log(signedOrder);
        var zeroExInstance = new ZeroEx(this.state.web3.currentProvider, zeroExConfig);
        zeroExInstance.exchange.cancelOrderAsync(signedOrder, new BigNumber(order.openValue), false, this.state.userAddress, {shouldValidate: false}).then(txhash => {
            context.setState({open: false});
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tokens: nextProps.tokens
        })
        $.ajax({
            url: 'http://localhost:8080/orders/' + nextProps.hash,
            crossDomain: true,
            success: (data) => {
                this.setState({
                    order: data,
                    open: nextProps.open,
                    balance: nextProps.balance,
                    allowance: nextProps.allowance,
                    userAddress: nextProps.userAddress
                });
            }
        })
    }

    getButtonState() {
        return !(this.state.balance && this.state.allowance);
    }

    getHelperMessage() {
        if (this.state.balance && this.state.allowance) return '';
        if (!this.state.balance) return "You don't have enough tokens to fill the order.";
        return "Your allowance is insufficient."
    }

    render() {
        const { classes } = this.props;
        var title = 'Order ' + this.props.hash;
        var firstLink = 'https://kovan.etherscan.io/token/' + this.state.order.makerTokenAddress;
        var secondLink = 'https://kovan.etherscan.io/token/' + this.state.order.takerTokenAddress;
        var cancelButton = (this.state.userAddress !== undefined && this.state.order.maker !== undefined && this.state.userAddress.toLowerCase() === this.state.order.maker.toLowerCase()) ? (
            <Button onClick={this.handleCancel} color="primary">
                Cancel
            </Button>
        ) : undefined;
        var coef = new BigNumber(this.state.order.openValue).dividedBy(new BigNumber(this.state.order.takerTokenValue));
        return (
            <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm the exchange of {new BigNumber(this.state.order.makerTokenValue).times(coef).dividedBy(decimals).toString(10)} {this.getSymbolByAddress(this.state.order.makerTokenAddress)} tokens
                        (contract address: <a target='_blank' href={firstLink}> {this.state.order.makerTokenAddress} </a>)
                        for {new BigNumber(this.state.order.openValue).dividedBy(decimals).toString(10)} {this.getSymbolByAddress(this.state.order.takerTokenAddress)} tokens
                        (contract address: <a target='_blank' href={secondLink}> {this.state.order.takerTokenAddress} </a>)
                    </DialogContentText>
                    <DialogContentText className={classes.errorText}>
                        {this.getHelperMessage()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {cancelButton}
                    <Button onClick={this.handleRequestClose} color="primary">
                        Reject
                    </Button>
                    <Button onClick={this.handleTransaction} disabled={this.getButtonState()} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(SingleOrder);
