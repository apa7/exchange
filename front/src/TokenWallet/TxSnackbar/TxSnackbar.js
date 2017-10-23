import { withStyles } from 'material-ui/styles';
import React from 'react'
import Snackbar from 'material-ui/Snackbar';
import SnackMessage from './SnackMessage'
import TxAction from './TxAction'

const styles = theme => ({
});

class TxSnackbar extends React.Component {
    handleRequestClose = () => {
        this.props.handleRequestClose();
    }

    render() {
        return (
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                SnackbarContentProps={{ 'aria-describedby': 'message-id' }}
                open={this.props.snackOpen}
                message={<SnackMessage txHash={this.props.txHash}/>}
                action={[<TxAction key='close' handleRequestClose={this.handleRequestClose}/>]}
            />
        );
    }
}

export default withStyles(styles)(TxSnackbar)
