import React, { Component } from 'react';

import { createBrowserHistory } from 'history';
const browserHistory = createBrowserHistory();

import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar/index.js';
import Button from '@material-ui/core/Button/index.js';
import Alert from '@material-ui/lab/Alert/index.js';
import Dialog from '@material-ui/core/Dialog/index.js';
import DialogContentText from '@material-ui/core/DialogContentText/index.js';
import DialogTitle from '@material-ui/core/DialogTitle/index.js';
import DialogActions from '@material-ui/core/DialogActions/index.js';
import DialogContent from '@material-ui/core/DialogContent/index.js';
import Divider from '@material-ui/core/Divider/index.js';
import LeftNav from '@material-ui/core/Drawer/index.js';
import MenuItem from '@material-ui/core/MenuItem/index.js';
import TextField from '@material-ui/core/TextField/index.js';
import Toolbar from '@material-ui/core/Toolbar/index.js';
import Typography from '@material-ui/core/Typography/index.js';
import IconButton from '@material-ui/core/IconButton/index.js';
import { AccountCircle, ExitToApp, Menu } from '@material-ui/icons/index.js';


export class Header extends Component {
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
                    <IconButton className="menu-button" color="inherit" aria-label="Menu">
                      <Menu onClick={() => this.openNav()} />
                    </IconButton>
                    <Typography variant="title" color="inherit" className="flex">
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
