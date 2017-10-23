import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import items from './DrawerMenuItems'
import SingleMenuItem from './SingleMenuItem'

const styles = theme => ({
    icon: {
        marginLeft : theme.spacing.unit * 2
    },
    menuName: {
        display:'inline-block',
        marginLeft: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2
    },
    list: {
        height: 45
    }
});

class DrawerList extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <List>
                {items.map((item, idx) => {
                    return (
                        <ListItem key={idx} className={classes.list} button>
                            <SingleMenuItem
                                iconName={item.iconName}
                                link={item.link}
                                text={item.text}
                            />
                        </ListItem>
                    );
                })}
            </List>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DrawerList);
