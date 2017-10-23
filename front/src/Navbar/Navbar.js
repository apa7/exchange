import React from 'react';
import { withStyles } from 'material-ui/styles';
import ApplBar from './Bar/ApplBar'
import DrawerMenu from './Drawer/DrawerMenu'

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 0.75,
        width: '100%',
    },
});

class NavBar extends React.Component {
    state = {
        open: false
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
         this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <ApplBar
                    open={this.state.open}
                    handleDrawerOpen={this.handleDrawerOpen}
                />
                <DrawerMenu
                    handleDrawerClose={this.handleDrawerClose}
                    open={this.state.open}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(NavBar);
