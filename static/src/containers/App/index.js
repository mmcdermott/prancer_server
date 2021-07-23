import React from 'react';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions';

import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
} from '../../constants/index';

/* application components */
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import './styles/app.scss';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
          logged_in: false,
          login_failure: false
        };
    }

    do_login(email, password) {
        const { login } = this.props;

        const login_result = login(email, password)

        if (login_result.type == LOGIN_SUCCESS) {
            this.setState({ logged_in: true, login_failure: false })
            return true
        } else {
            this.setState({ logged_in: false, login_failure: true })
            return false
        }
    }

    do_logout() {
        const { logout } = this.props;

        const logout_result = logout()
        if (logout_result.type == LOGOUT_SUCCESS) {
            this.setState({ logged_in: false, login_failure: false })
            return true
        } else {
            return false
        }
    }

    render() {
        const theme = {
          palette: {
            primary: {
              main: '#607D8B'
            },
            secondary: {
              main: '#E0F2F1'
            }
          },
          typography: {
            fontSize: 24,
          }
        };

        return (
            <MuiThemeProvider theme={createMuiTheme(theme)}>
                <section>
                    <Header
                      login={(username, password) => this.do_login(username, password)}
                      logged_in={this.state.logged_in}
                      login_failure={this.state.login_failure}
                      logout={() => this.do_logout()}
                    />
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 20 }}
                    >
                        {this.props.children}
                    </div>
                    <div>
                        <Footer />
                    </div>
                </section>
            </MuiThemeProvider>
        );
    }
}

export { App };
