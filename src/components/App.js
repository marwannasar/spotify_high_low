import '../App.css';
import HighLow from './high_low';
import Login from './login';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [accountID, setaccountID] = useState(""); 

  return (
    <div className="App"> 
      <div>
        {accountID ? <HighLow accountID = {accountID}/> : <Login updateID = {(accountID) => setaccountID(accountID)}/>}
      </div>
    </div>
  );
}

export default App;