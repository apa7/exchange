import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import DrawerHeader from './DrawerHeader'
import DrawerList from './DrawerList'

const drawerWidth = 240;

const styles = theme => ({
    drawerInner : {
        width: drawerWidth
    },
});

class DrawerMenu extends React.Component {
    handleDrawerClose = () => {
         this.props.handleDrawerClose();
    };

    render() {
        const { classes } = this.props;
        return (
            <Drawer type='persistent' classes={{
                paper: classes.drawerPaper,
            }} open={this.props.open}>
                <div className={classes.drawerInner}>
                    <DrawerHeader
                        handleDrawerClose={this.handleDrawerClose}
                    />
                    <Divider/>
                    <DrawerList/>
                </div>
            </Drawer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DrawerMenu);
