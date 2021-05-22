import React, { Component } from 'react';
import {
  msalApp,
  requiresInteraction,
  isIE,
  AUTH_REQUESTS,
  AUTH_SCOPES,
} from '../utils/auth-utils';
import { AuthContext } from '../context/auth-context';

// If you support IE, our recommendation is that you sign-in using Redirect APIs
const useRedirectFlow = isIE();
//const useRedirectFlow = true;

export default (C) =>
  class AuthProvider extends Component {
    constructor(props) {
      super(props);

      this.state = {
        account: null,
        isAuthenticated: false,
        error: null,
      };
    }

    async acquireToken(request, redirect) {
      console.log("acquire token");
      console.log("request");
      console.log(request);


      console.log("request.scopes");

      console.log(request.scopes);

      

      return msalApp
        .acquireTokenSilent(request)
        .then((loginResponse) => {
          console.log("there is a login response");
          console.log(loginResponse);
          if (loginResponse) {
            this.setState({
              account: loginResponse.account,
              isAuthenticated: true,
              error: null,
            });
            return true;
          }
        })
        .catch((error) => {
          // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
          // due to consent or interaction required ONLY
          if (requiresInteraction(error.errorCode)) {
            this.setState({
              isAuthenticated: false,
            });

            return redirect ? msalApp.acquireTokenRedirect(request) : this.onSignIn(redirect);
          }
          console.error('Non-interactive error:', error.errorCode);
          return false;
        });
    }

    async onSignIn(redirect) {
      if (redirect) {
        return msalApp.loginRedirect({
          scopes: [AUTH_SCOPES.OPENID, AUTH_SCOPES.PROFILE],
          extraQueryParameters: {
            ui_locales: localStorage.getItem('language') ?? 'bg',
          },
        });
      }

      const loginResponse = await msalApp.loginRedirect({
        scopes: [AUTH_SCOPES.OPENID, AUTH_SCOPES.PROFILE],
        extraQueryParameters: {
          ui_locales: localStorage.getItem('language') ?? 'bg',
        },
      });

      if (loginResponse) {
        this.setState({
          account: loginResponse.account,
          isAuthenticated: true,
          error: null,
        });
      }
    }

    onSignOut() {
      msalApp.logout();
    }

    async componentDidMount() {
      msalApp.handleRedirectCallback((error) => {
        if (error) {
          const errorMessage = error.errorMessage ? error.errorMessage : 'Unable to acquire access token.';
          this.setState({
            error: errorMessage,
          });
        }
      });

      const account = msalApp.getAccount();
      this.setState({
        account,
      });

      const now = Math.round(new Date().getTime() / 1000);

      if (account) {
        if (account.idToken.exp > now) {
          this.setState({
            isAuthenticated: true,
          });
        } else {

          


      console.log("AUTH_REQUESTS");

      console.log(AUTH_REQUESTS);


      console.log("AUTH_REQUESTS.REFRESH_TOKEN");

      console.log(AUTH_REQUESTS.REFRESH_TOKEN);


      console.log("process");

      console.log(process);


      console.log("process.env.REACT_APP_CLIENT_ID");

      console.log(process.env.REACT_APP_CLIENT_ID);

      

           this.acquireToken(AUTH_REQUESTS.REFRESH_TOKEN, useRedirectFlow);
        }
      }
    }

    async CheckIsAuthenticated() {
      const account = msalApp.getAccount();
      this.setState({
        account,
      });

      const now = Math.round(new Date().getTime() / 1000);

      if (account) {
        if (account.idToken.exp > now) {
          this.setState({
            isAuthenticated: true,
          });
          return true;
        }
        return this.acquireToken(AUTH_REQUESTS.REFRESH_TOKEN, useRedirectFlow);
      }
      return false;
    }

    render() {
      const authContext = {
        isAuthenticated: this.state.isAuthenticated,
        CheckIsAuthenticated: () => this.CheckIsAuthenticated(),
        account: this.state.account,
        error: this.state.error,
        onSignIn: () => this.onSignIn(useRedirectFlow),
        onSignOut: () => this.onSignOut(),
      };

      return (
        <AuthContext.Provider value={authContext}>
          <C {...this.props} />
        </AuthContext.Provider>
      );
    }
  };