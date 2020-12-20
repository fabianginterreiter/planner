import './App.css';
import Recipes from './components/Recipes';
import Recipe from './components/Recipe';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
      <Router className="App">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/recipes">Recipes</Link>
            </li>
            <li>
              <Link to="/calendar">Calendar</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/calendar">
            <div>calendar</div>
          </Route>
          <Route path="/recipes/:id"><Recipe /></Route>
          <Route path="/recipes">
          <div>Rezepte <Recipes /></div>
          </Route>
          <Route path="/">
          <div>default</div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
