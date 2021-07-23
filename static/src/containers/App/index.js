import React from 'react';

import { createTheme, ThemeProvider } from '@material-ui/core/styles/index.js';
import { indigo, teal } from '@material-ui/core/colors/index.js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/index.js';

import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
} from '../../constants/index.js';

/* application components */
import Header from '../../components/Header/index.js';

import { Footer } from '../../components/Footer/index.js';

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
          login_pending: false,
          login_failure: false,
          login_error: false
        };
    }

    async do_login(email, password) {
        const { login } = this.props;

        this.setState({ login_pending: true })

        const login_promise = login(email, password)

        console.log(login_promise)

        login_promise.then(
            login_result => {
                console.log(login_result)
                if (login_result.type == LOGIN_SUCCESS) {
                  this.setState({
                    login_pending: false, logged_in: true, login_failure: false, login_error: false
                  })
                } else {
                  this.setState({
                    login_pending: false, logged_in: false, login_failure: true, login_error: false
                  })
                }
            }
        ).catch(
            err => {
                console.log(err)
                this.setState({
                    login_pending: false, logged_in: false, login_failure: false, login_error: true 
                })
            }
        )
    }

    do_logout() {
        const { logout } = this.props;

        const logout_result = logout()
        if (logout_result.type == LOGOUT_SUCCESS) {
            this.setState({ logged_in: false, login_failure: false, login_error: false, login_pending: false })
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
          <div>
            <ThemeProvider theme={createTheme(theme)}>
                <section>
                    <Header
                      login={(username, password) => this.do_login(username, password)}
                      logout={() => this.do_logout()}
                      logged_in={this.state.logged_in}
                      login_failure={this.state.login_failure}
                      login_error={this.state.login_error}
                      login_pending={this.state.login_pending}
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
            </ThemeProvider>
          </div>
        );
    }
}

export { App };
