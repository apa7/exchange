import { withStyles } from 'material-ui/styles';
import React from 'react'
import Switch from 'material-ui/Switch';

const styles = theme => ({
});

class TradeSwitch extends React.Component {
    sendTx = () => {
        this.props.sendTx();
    }

    render() {
        return (this.props.checked !== undefined) ? (
            <Switch
                checked={this.props.checked}
                onChange={this.sendTx}
            />
        ) : null;
    }
}

export default withStyles(styles)(TradeSwitch)
