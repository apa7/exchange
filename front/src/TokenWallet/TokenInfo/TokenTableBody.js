import { withStyles } from 'material-ui/styles';
import React from 'react'
import { TableBody } from 'material-ui/Table';
import blockies from 'ethereum-blockies-png'
var BigNumber = require('bignumber.js');
import TokenTableRow from './TokenTableRow'

const styles = theme => ({
});

const decimals = new BigNumber('1000000000000000000')

class TokenTableBody extends React.Component {
    render() {
        return (
            <TableBody>
                {this.props.tokens.map((n, idx) => {
                    var img = blockies.createDataURL({
                        seed: n.address
                    });
                    var balance = (this.props.balances[idx]) ?
                        this.props.balances[idx].dividedBy(decimals).toString(10): '';
                    return (
                        <TokenTableRow
                            key={n.id}
                            token={n}
                            img={img}
                            checked={this.props.tradePermissions[idx]}
                            sendTx={this.props.sendTx(idx)}
                            idx={idx}
                            balance={balance}
                        />
                    );
                })}
            </TableBody>
        );
    }
}

export default withStyles(styles)(TokenTableBody)
