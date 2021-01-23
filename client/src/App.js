import './App.css';
import Recipes from './components/Recipes';
import Recipe from './components/Recipe';
import RecipeEdit from './components/RecipeEdit';
import Ingredients from './components/Ingredients';
import Ingredient from './components/Ingredient';
import Week from './components/Week';
import Units from './components/Units';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";

function App() {
  return (
      <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li className="title">
                <Link to="/">🍲 CookBook</Link>
              </li>
              <li className="nav">
                <NavLink to="/recipes">Recipes</NavLink>
              </li>
              <li className="nav">
                <NavLink to="/calendar">Calendar</NavLink>
              </li>
              <li className="nav right">
                <Link to="/units">☰</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Switch>
            <Route path="/calendar" component={Week} />
            <Route path="/recipes/:id/edit" component={RecipeEdit} />
            <Route path="/recipes/:id" component={Recipe} />
            <Route path="/recipes" component={Recipes} />
            <Route path="/ingredients/:id" component={Ingredient} />
            <Route path="/ingredients" component={Ingredients} />
            <Route path="/units" component={Units} />
            <Route path="/">
            <div>default</div>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
