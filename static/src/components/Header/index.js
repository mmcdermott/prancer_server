import React, { Component } from 'react';

import { createBrowserHistory } from 'history';
const browserHistory = createBrowserHistory();

import { connect } from 'react-redux';


import AppBarImport from '@material-ui/core/AppBar/index.js';
const AppBar = AppBarImport.default;

import ButtonImport from '@material-ui/core/Button/index.js';
const Button = ButtonImport.default;

import AlertImport from '@material-ui/lab/Alert/index.js';
const Alert = AlertImport.default;

import DialogImport from '@material-ui/core/Dialog/index.js';
const Dialog = DialogImport.default;

import DialogContentTextImport from '@material-ui/core/DialogContentText/index.js';
const DialogContentText = DialogContentTextImport.default;

import DialogTitleImport from '@material-ui/core/DialogTitle/index.js';
const DialogTitle = DialogTitleImport.default;

import DialogActionsImport from '@material-ui/core/DialogActions/index.js';
const DialogActions = DialogActionsImport.default;

import DialogContentImport from '@material-ui/core/DialogContent/index.js';
const DialogContent = DialogContentImport.default;

import DividerImport from '@material-ui/core/Divider/index.js';
const Divider = DividerImport.default;

import LeftNavImport from '@material-ui/core/Drawer/index.js';
const LeftNav = LeftNavImport.default;

import MenuItemImport from '@material-ui/core/MenuItem/index.js';
const MenuItem = MenuItemImport.default;

import TextFieldImport from '@material-ui/core/TextField/index.js';
const TextField = TextFieldImport.default;

import ToolbarImport from '@material-ui/core/Toolbar/index.js';
const Toolbar = ToolbarImport.default;

import TypographyImport from '@material-ui/core/Typography/index.js';
const Typography = TypographyImport.default;

import IconButtonImport from '@material-ui/core/IconButton/index.js';
const IconButton = IconButtonImport.default;

import { AccountCircle, ExitToApp, Menu } from '@material-ui/icons/index.js';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            login_form_open: false,
            email: '',
            password: '',
        };

    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }


    handleClickOutside() {
        this.setState({
            open: false,
            login_form_open: false,
        });
    }


    login(e) {
        e.preventDefault();
        e.stopPropagation();
        const { email, password } = this.state
        const success = this.props.login(email, password);
        this.setState({
            open: success,
            login_form_open: !success,
        });
    }


    logout(e) {
        e.preventDefault();
        const success = this.props.logout();
        this.setState({
            open: false,
            login_form_open: false,
            email: '',
            password: '',
        });
    }

    closeLoginForm() {
      this.setState({
          login_form_open: false,
          password: '',
      });
    }

    openLoginForm() {
      this.setState({
          login_form_open: true,
      });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    renderLoginButton() {
      return (
        <Button
          className="user-button"
          color="inherit"
          aria-label="Login"
          onClick={() => this.openLoginForm()}
          startIcon={<AccountCircle />}
        >
            Login
        </Button>
      )
    }

    renderLoginDialog() {
      const { login_failure } = this.props;
      return (
        <Dialog
          open={this.state.login_form_open}
          onClose={() => this.closeLoginForm()}
          aria-labelledby='login-form'
        >
          <DialogTitle id="login-form">Login</DialogTitle>
          <DialogContent>
            { login_failure && (<Alert severity="error"> Invalid email/password! </Alert>) }
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              value={this.state.email}
              onChange={(e) =>
                this.setState({ email: event.target.value, })
              }
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              value={this.state.password}
              onChange={(e) =>
                this.setState({ password: event.target.value, })
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={(e) => this.closeLoginForm(e)} color="primary">
              Cancel
            </Button>
            <Button onClick={(e) => this.login(e)} color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>
      )
    }

    renderLogoutButton() {
      return (
        <Button
          className="user-button"
          color="inherit"
          aria-label="Login"
          onClick={() => this.logout()}
          startIcon={<ExitToApp />}
        >
            Logout
        </Button>
      )
    }

    render() {
        return (
            <header>
                <LeftNav open={this.state.open}>
                    {
                      <div>
                        <MenuItem onClick={() => this.dispatchNewRoute('/home')}>
                            Home
                        </MenuItem>
                        <MenuItem onClick={() => this.dispatchNewRoute('/tutorial')}>
                            Tutorial
                        </MenuItem>
                        <MenuItem
                          onClick={() => this.dispatchNewRoute('/filesView')}
                          disabled={!this.props.logged_in}
                        >
                            Files
                        </MenuItem>
                      </div>
                    }
                </LeftNav>
                <AppBar position="static">
                  <Toolbar>
                    <IconButton
                      className="menu-button"
                      color="inherit"
                      aria-label="Menu"
                      onClick={() => this.openNav()}
                    >
                      <Menu  />
                    </IconButton>
                    <Typography variant="h1" color="inherit" className="flex">
                      Clinical Annotation
                    </Typography>
                    { this.props.logged_in ? this.renderLogoutButton() : this.renderLoginButton() }
                  </Toolbar>
                </AppBar>
                { this.renderLoginDialog() }
            </header>
        );
    }
}
