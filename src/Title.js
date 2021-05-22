import React from 'react'
import logo from './images/logo.svg';
import userprofile from './images/userProfile.png';

import AuthProvider from './providers/auth-provider';
import { AuthContext } from "./context/auth-context";


class Title extends React.Component { 
    render() {
      const auth = this.context;

      var loggedInState;
      if (auth.isAuthenticated) {
        let username 
        try { username = auth.account.name; }
        catch { username = ""; }
        
        loggedInState = <div id="userProfile" className="column small-4" onClick={() => auth.onSignOut()}>
                                <div id="userName">{ username } &nbsp; <u>изход</u></div>
                                <div id="userImageHolder"><img src={userprofile} alt="Профил" /></div>
                        </div>;

      } else {
        loggedInState = <div id="userProfile" className="column small-4" onClick={() => auth.onSignIn()}>
                                <div id="userName">Вход</div>
                                <div id="userImageHolder"><img src={userprofile} alt="Профил" /></div>
                        </div>;
      }

      return (   
        <header>

            <div className="row limited">
                <div className="column small-9">
                    <img src={logo} alt="Кулинарен помощник" />         
                    <h1>Кулинарен помощник</h1>
                    <h2>Планирайте своето меню</h2>
                </div>

                { loggedInState }        

            </div> 
        </header>   
    )
  }

}

Title.contextType = AuthContext;

export default AuthProvider(Title);