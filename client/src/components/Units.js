import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Units extends Component {
  state = {
    units: []
  }

  componentDidMount() {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `{ 
                units (orderBy: {name:asc}) {id name short used}
            }`})
    }).then((response) => response.json()).then((body) => this.setState({
      units: body.data.units
    }))
  }

  handleChange(unit, index, name, short) {
    this.setState({
      units: this.state.units.map((u, idx) => (u.id === unit.id && index === idx ? { ...u, name, short, edit: true } : u))
    });
  }

  handleDelete(unit, index) {
    if (unit.new) {
      this.setState({
        units: this.state.units.filter((u, idx) => !(u.id === 0 && idx === index))
      })
    } else {
      this.setState({
        units: this.state.units.map((u) => (u.id === unit.id ? { ...u, delete: true } : u))
      });
    }
  }

  handleNewUnit() {
    this.setState({
      units: [...this.state.units, { id: 0, name: '', short: '', new: true }]
    })
  }

  getClassName(unit) {
    if (unit.new) {
      return "new";
    } else if (unit.delete) {
      return "delete";
    } else if (unit.edit) {
      return "edit";
    } else {
      return "";
    }
  }

  handleSave() {
    this.state.units.filter(unit => unit.delete).forEach(unit => fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
              mutation {
                deleteUnit(
                  id: ${unit.id}
                )
              }`})
    }));

    Promise.all(this.state.units.filter(unit => !unit.delete).map((unit) => {
      if (unit.new) {
        console.log("create unit" + unit.name);

        return fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `
                      mutation {
                        createUnit(
                          name: "${unit.name}",
                          short: "${unit.short}"
                        ) {
                          id
                          name
                          short
                          used
                        }
                      }`})
        }).then((e) => e.json()).then((body) => body.data.createUnit);

      } else if (unit.edit) {
        return fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `
                      mutation {
                        editUnit(
                            id: ${unit.id},
                          name: "${unit.name}",
                          short: "${unit.short}"
                        ) {
                          id
                          name
                          short
                          used
                        }
                      }`})
        }).then((e) => e.json()).then((body) => body.data.editUnit)
      }

      return Promise.resolve(unit);
    })).then((units) => this.setState({ units }));
  }

  orderBy(field, asc) {
    this.setState({
      orderBy: field,
      asc: asc,
      units: this.state.units.sort((a, b) => {
        return a[field].localeCompare(b[field]);
      })
    })
  }

  render() {
    return <div>
      <h1>Units</h1>
      <table border={1}>
        <thead>
          <tr>
            <th onClick={() => this.orderBy('name', true)}>Name</th>
            <th>Short</th>
          </tr>
        </thead>
        <tbody>
          {this.state.units.map((unit, idx) => <tr key={`${unit.id}#${idx}`} className={this.getClassName(unit)}>
            <td><input value={unit.name} onChange={(e) => this.handleChange(unit, idx, e.target.value, unit.short)} /></td>
            <td><input value={unit.short} onChange={(e) => this.handleChange(unit, idx, unit.name, e.target.value)} /></td>
            <td><button onClick={(e) => this.handleDelete(unit, idx)} disabled={unit.used}>Delete</button></td>
            <td>{unit.used && <Link to={`/recipes?unitId=${unit.id}`}>Rezepte</Link>}</td>
          </tr>)}
        </tbody>
      </table>
      <button onClick={(e) => this.handleNewUnit()}>New</button>
      <button onClick={(e) => this.handleSave()}>Save</button>
    </div>
  }
}

export default Units;