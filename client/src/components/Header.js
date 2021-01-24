import React, { Component } from 'react';
import {
  Link,
  NavLink
} from "react-router-dom";

class Header extends Component {
  state = {
    open: false
  }

  render() {
    return <header>
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
          <li className="nav right dropdown">
            <span onClick={() => this.setState({
              open: true
            })}>☰</span>
            {this.state.open && <ul onClick={() => this.setState({ open: false })}>
              <li><Link to="/units">Einheiten</Link></li>
              <li><Link to="/ingredients">Zutaten</Link></li>
            </ul>}
            {this.state.open && <div className="area" onClick={() => this.setState({ open: false })} />}
          </li>
        </ul>
      </nav>
    </header>
  }
}

export default Header;