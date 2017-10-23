import { withStyles } from 'material-ui/styles';
import React from 'react'
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar'

const styles = theme => ({
    tokenName: {
        textAlign: 'center',
        position: 'absolute',
        margin: 'auto',
        top: theme.spacing.unit * 8.5,
        left: theme.spacing.unit * 4
    },
});

const kovanToken = 'https://kovan.etherscan.io/token/';

class TokenLink extends React.Component {
    getTokenLink = () => {
        return kovanToken + this.props.token.address;
    }

    render() {
        const { classes } = this.props;
        var token = this.props.token;
        return (
            <a href={this.getTokenLink()} target='_blank'>
                <Avatar
                    src={this.props.img}
                    className={classes.tokenPic}
                />
                <Typography className={classes.tokenName} type='subheading'>{token.symbol}</Typography>
            </a>
        );
    }
}

export default withStyles(styles)(TokenLink)
