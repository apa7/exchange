import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './Navbar/Navbar.js'
import OrderList from './OrderList'
import NewOrder from './NewOrder'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import TokenWallet from './TokenWallet/TokenWallet';
import MarketOrder from './MarketOrder'

const theme = createMuiTheme({
  palette: {
  },
});

const Main = () =>
    <MuiThemeProvider theme={theme}>
        <OrderList/>
    </MuiThemeProvider>;

const AppBar = () => (
    <MuiThemeProvider theme={theme}>
        <NavBar/>
    </MuiThemeProvider>
);

const Wallet = () => (
    <MuiThemeProvider theme={theme}>
        <TokenWallet/>
    </MuiThemeProvider>
);

const PostOrder = () => (
    <MuiThemeProvider theme={theme}>
        <NewOrder/>
    </MuiThemeProvider>
)

const PostMarket = () => (
    <MuiThemeProvider theme={theme}>
        <MarketOrder/>
    </MuiThemeProvider>
)


class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                  <Route component={AppBar}/>
                  <Switch>
                      <Route exact path='/orders' component={Main}/>
                      <Route path='/wallet' component={Wallet}/>
                      <Route exact path='/new' component={PostOrder}/>
                      <Route exact path='/market' component={PostMarket}/>
                  </Switch>
                </div>
            </BrowserRouter>
        );
    }
}





ReactDOM.render(
  <BrowserRouter><Router/></BrowserRouter>,
  document.getElementById('root')
);
