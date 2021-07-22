import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import LeftNav from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';


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
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    closeLoginForm() {
      this.setState({
          login_form_open: false,
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

    render() {
        return (
            <header>
                <LeftNav open={this.state.open}>
                    {
                      <div>
                        <MenuItem onClick={() => this.dispatchNewRoute('/home')}>
                            Home
                        </MenuItem>
                        <MenuItem onClick={() => this.dispatchNewRoute('/filesView')}>
                            Files
                        </MenuItem>
                        <MenuItem onClick={() => this.dispatchNewRoute('/tutorial')}>
                            Tutorial
                        </MenuItem>
                      </div>
                    }
                </LeftNav>
                <AppBar position="static">
                  <Toolbar>
                    <IconButton className="menu-button" color="inherit" aria-label="Menu">
                      <MenuIcon onClick={() => this.openNav()} />
                    </IconButton>
                    <Typography variant="title" color="inherit" className="flex">
                      Clinical Annotation
                    </Typography>
                    <IconButton
                        className="user-button" color="inherit" aria-label="Login" onClick={() => this.openLoginForm()}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                  <Dialog open={this.state.login_form_open} onClose={() => this.closeLoginForm()} aria-labelledby='login-form'>
                  <DialogTitle id="login-form">Login</DialogTitle>
                  <DialogContent>
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
            </header>

        );
    }
}
