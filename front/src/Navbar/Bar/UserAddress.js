import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip'

const styles = theme => ({
    addressText: {
        marginLeft: 20,
        marginRight: 10,
    },
});

class UserAddress extends React.Component {
    getWeb3Message = () => {
        if (!this.props.web3) {
            return 'injected web3 not found (yet)';
        }
        return this.props.userAddress.substring(0, 7) + '...';
    }

    render() {
        const { classes } = this.props;
        return (
            <Tooltip id='tooltip-bottom-end' title={this.props.userAddress} placement='bottom-end'>
                <Typography className={classes.addressText} type='title' color='inherit'>
                    {this.getWeb3Message()}
                </Typography>
            </Tooltip>
        );
    }
}

export default withStyles(styles, { withTheme: true })(UserAddress);
