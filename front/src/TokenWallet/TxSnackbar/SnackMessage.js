import { withStyles } from 'material-ui/styles';
import React from 'react'
import Typography from 'material-ui/Typography';

const styles = theme => ({
});

const etherScanPrefix = 'https://kovan.etherscan.io/tx/';

class SnackMessage extends React.Component {
    getEtherscanLink = () => {
        return etherScanPrefix + this.props.txHash;
    }

    getSnackText = () => {
        return (this.props.txHash) ? 'tx has been sent' : 'tx rejected';
    }

    render() {
        return (
            <Typography type="title" align='center' color="inherit">
                <a target='_blank' href={this.getEtherscanLink()}>
                    {this.getSnackText()}
                </a>
            </Typography>
        );
    }
}

export default withStyles(styles)(SnackMessage)
