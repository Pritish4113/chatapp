import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import './App.css';
import ChatPage from './components/ChatPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <div className="App">
      <Route exact path = "/" component = {HomePage}></Route>
      <Route exact path = "/chats" component = {ChatPage}></Route>
    </div>
  );
}

export default App;
