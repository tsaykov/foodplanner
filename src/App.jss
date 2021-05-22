
import './normalize.css';
import './small.css';
import './medium.css';
import './large.css';
import AuthProvider from './providers/auth-provider';

import Title from './Title';


function App() {
  return (
    <div className="App">
        <Title />
        <h1>Hello React</h1>  
    </div>
  );
}

export default AuthProvider(App);


