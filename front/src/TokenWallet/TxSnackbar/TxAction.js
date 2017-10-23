import { withStyles } from 'material-ui/styles';
import React from 'react'
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close'

const styles = theme => ({
});

class TxAction extends React.Component {
    handleRequestClose = () => {
        this.props.handleRequestClose();
    }

    render() {
        const { classes } = this.props;
        return (
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleRequestClose}
            >
                <CloseIcon />
            </IconButton>
        );
    }
}

export default withStyles(styles)(TxAction)
