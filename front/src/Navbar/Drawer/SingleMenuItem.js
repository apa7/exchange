import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import AddBoxIcon from 'material-ui-icons/AddBox'
import ViewListIcon from 'material-ui-icons/ViewList'
import { Link } from 'react-router-dom'

const styles = theme => ({
    icon: {
        marginLeft : theme.spacing.unit * 2
    },
    menuName: {
        display:'inline-block',
        marginLeft: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2
    },
});

class SingleMenuItem extends React.Component {
    getIconByName = () => {
        const { classes } = this.props;
        if (this.props.iconName === 'viewlist') {
            return <ViewListIcon className={classes.icon}/>;
        }
        if (this.props.iconName === 'addbox') {
            return <AddBoxIcon className={classes.icon}/>;
        }
        if (this.props.iconName === 'accountbalancewallet') {
            return <AccountBalanceWalletIcon className={classes.icon}/>;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Link to={this.props.link}>
                {this.getIconByName()}
                <Typography className={classes.menuName} type='title'> {this.props.text} </Typography>
            </Link>
        );
    }
}

export default withStyles(styles, { withTheme: true })(SingleMenuItem);
