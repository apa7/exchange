import { withStyles } from 'material-ui/styles';
import React from 'react'
import { TableCell, TableRow } from 'material-ui/Table';
import TradeSwitch from './TradeSwitch'
import TokenLink from './TokenLink'

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

const kovanToken = 'https://kovan.etherscan.io/token/';

class TokenTableRow extends React.Component {
    getTokenLink = () => {
        return kovanToken + this.props.token.address;
    }

    render() {
        const { classes } = this.props;
        var token = this.props.token;
        return (
            <TableRow key={token.id}>
                <TableCell className={classes.wrap}>
                    <TokenLink
                        token={this.props.token}
                        img={this.props.img}
                    />
                </TableCell>
                <TableCell>
                    {token.address}
                </TableCell>
                <TableCell>
                    <TradeSwitch
                        checked={this.props.checked}
                        sendTx={this.props.sendTx}
                        idx={this.props.idx}
                    />
                </TableCell>
                <TableCell numeric>
                    {this.props.balance}
                </TableCell>
            </TableRow>
        );
    }
}

export default withStyles(styles)(TokenTableRow)
