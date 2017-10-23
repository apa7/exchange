import React from 'react';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';

const styles = theme => ({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
});

class DrawerHeader extends React.Component {
    handleDrawerClose = () => {
        this.props.handleDrawerClose();
    }

    render() {
        const { classes, theme } = this.props;
        return (
            <div className={classes.drawerHeader}>
                Menu
                <IconButton onClick={this.handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DrawerHeader);
