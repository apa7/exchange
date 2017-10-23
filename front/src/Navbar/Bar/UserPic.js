import React from 'react';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar'
import blockies from 'ethereum-blockies-png'

const etherscanNetworkUrl = 'https://kovan.etherscan.io/address/';

const styles = theme => ({
    addressPic: {
        margin: 10,
        width: 30,
        height: 30,
    },
});

class UserPic extends React.Component {
    getEtherscanLink = () => {
        return etherscanNetworkUrl + this.props.userAddress;
    }

    getImage = () => {
        if (this.props.userAddress) {
            return blockies.createDataURL({
                seed: this.props.userAddress.toLowerCase()
            });
        }
        return null;
    }

    render() {
        const { classes } = this.props;
        return (
            <a href={this.getEtherscanLink()} target='_blank'>
                <Avatar
                    src={this.getImage()}
                    className={classes.addressPic}
                />
            </a>
        );
    }
}

export default withStyles(styles, { withTheme: true })(UserPic);
