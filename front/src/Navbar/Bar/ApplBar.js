import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import classNames from 'classnames';
import UserPic from './UserPic'
import UserAddress from './UserAddress'
import DrawerOpenIcon from './DrawerOpenIcon'
import getWeb3 from '../../utils/getWeb3'


const drawerWidth = 240;

const styles = theme => ({
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
});

class ApplBar extends React.Component {
    state = {
        web3: undefined,
        userAddress: undefined,
    };

    componentDidMount = () => {
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

    handleDrawerOpen = () => {
        this.props.handleDrawerOpen();
    }

    render() {
        const { classes } = this.props;
        return (
            <AppBar className={classNames(classes.appBar, this.props.open && classes.appBarShift)} position='static' color='default'>
                <Toolbar>
                    <DrawerOpenIcon
                        open={this.props.open}
                        handleDrawerOpen={this.handleDrawerOpen}
                    />
                    <UserAddress
                        web3={this.state.web3}
                        userAddress={this.state.userAddress}
                    />
                    <UserPic userAddress={this.state.userAddress}/>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ApplBar);
