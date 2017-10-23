import React from 'react';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import classNames from 'classnames';
import MenuIcon from 'material-ui-icons/Menu';

const styles = theme => ({
    hide: {
        display: 'none',
    },
});

class DrawerOpenIcon extends React.Component {
    handleDrawerOpen = () => {
        this.props.handleDrawerOpen();
    }

    render() {
        const { classes } = this.props;
        return (
            <IconButton
                color='primary'
                aria-label='open drawer'
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, this.props.open && classes.hide)}
            >
                <MenuIcon/>
            </IconButton>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DrawerOpenIcon);
