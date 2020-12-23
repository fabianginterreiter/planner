import './App.css';
import Recipes from './components/Recipes';
import Recipe from './components/Recipe';
import RecipeEdit from './components/RecipeEdit';
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

        <Switch>
          <Route path="/calendar">
            <div>calendar</div>
          </Route>
          <Route path="/recipes/:id/edit" component={RecipeEdit} />
          <Route path="/recipes/:id" component={Recipe} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/">
          <div>default</div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
