import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip'
import IconButton from 'material-ui/IconButton';
import getWeb3 from './utils/getWeb3'
import blockies from 'ethereum-blockies-png'
import classNames from 'classnames';
import MenuIcon from 'material-ui-icons/Menu';
import List, { ListItem, ListItemText } from 'material-ui/List';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet'
import AddBoxIcon from 'material-ui-icons/AddBox'
import ViewListIcon from 'material-ui-icons/ViewList'
import { Link } from 'react-router-dom'


const drawerWidth = 240;

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 0.75,
        width: '100%',
    },
    addressPic: {
        margin: 10,
        width: 30,
        height: 30,
    },
    addressText: {
        marginLeft: 20,
        marginRight: 10,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    hide: {
        display: 'none',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    drawerInner : {
        width: drawerWidth
    },
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


class NavBar extends React.Component {
    state = {
        web3: undefined,
        userAddress: undefined,
        etherscanNetworkUrl: 'https://kovan.etherscan.io/address/',
        open: false
    };

    componentWillMount = () => {
        getWeb3.then(results => {
            var web3 = results.web3;
            web3.eth.getAccounts((err, accounts) => {
                this.setState({
                    web3: web3,
                    userAddress: accounts[0]
                })
            })
        });
    }

    getWeb3Message() {
        if (!this.state.web3) {
            return 'injected web3 not found (yet)';
        }
        return this.state.userAddress.substring(0, 7) + '...';
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

     handleDrawerClose = () => {
         this.setState({ open: false });
    };

    render() {
        const { classes, theme } = this.props;
        var web3msg = this.getWeb3Message();
        var img;
        if (this.state.userAddress) {
            img = blockies.createDataURL({
                seed: this.state.userAddress.toLowerCase()
            });
        }
        var tooltip;
        var etherscanLink = this.state.etherscanNetworkUrl + this.state.userAddress;
        return (
            <div className={classes.root}>
                <AppBar className={classNames(classes.appBar, this.state.open && classes.appBarShift)} position='static' color='default'>
                    <Toolbar>
                        <IconButton
                            color="primary"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, this.state.open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Tooltip id="tooltip-bottom-end" title={this.state.userAddress} placement="bottom-end">
                            <Typography className={classes.addressText} type="title" color="inherit">
                                {web3msg}
                            </Typography>
                        </Tooltip>
                        <a href={etherscanLink} target='_blank'>
                            <Avatar
                                src={img}
                            className={classes.addressPic}
                            />
                        </a>
                    </Toolbar>
                </AppBar>

                <Drawer
                    type="persistent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    open={this.state.open}
                >
                    <div className={classes.drawerInner}>
                        <div className={classes.drawerHeader}>
                            Menu
                            <IconButton onClick={this.handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                        <Divider/>
                        <List>
                            <ListItem className={classes.list} button><Link to='/orders'>
                                <ViewListIcon className={classes.icon}/>
                                <Typography className={classes.menuName} type="title"> Open orders list </Typography>
                            </Link></ListItem>
                            <ListItem className={classes.list} button><Link to='/new'>

                                    <AddBoxIcon className={classes.icon}/>
                                    <Typography className={classes.menuName} type="title"> Add a new order </Typography>

                            </Link></ListItem>
                            <Divider inset/>
                            <ListItem className={classes.list} button><Link to='/wallet'>

                                    <AccountBalanceWalletIcon className={classes.icon}/>
                                    <Typography className={classes.menuName} type="title"> Token wallet </Typography>

                            </Link></ListItem>
                        </List>



                    </div>
                </Drawer>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(NavBar);
