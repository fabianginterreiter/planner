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
} from "react-router-dom";
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

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
