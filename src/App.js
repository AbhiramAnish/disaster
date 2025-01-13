import './App.css';
import Home from './pages/Home';
import sendSms from './Constants/twilio';


function App() {
  return (
    <div className="App">
        <Home />
        <sendSms/>
    </div>
  );
}

export default App;
