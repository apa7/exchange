import { withStyles } from 'material-ui/styles';
import React from 'react'
import { TableCell, TableHead, TableRow } from 'material-ui/Table';
import names from './Names'

const styles = theme => ({
});


class WalletTableHead extends React.Component {
    render() {
        return (
            <TableHead>
                <TableRow>
                    {names.map(headItem => {
                        return (
                            <TableCell key={headItem.name} numeric={headItem.numeric}>{headItem.name}</TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
        );
    }
}

export default withStyles(styles)(WalletTableHead)
