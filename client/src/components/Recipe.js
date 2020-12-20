import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from "react-router";

class Recipe extends Component {
    componentDidMount() {

        console.log(this.props.match.params.id);
      
        this.callApi()
      .then(res => this.props.setRecipes(res))
      .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/recipes');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        return body;
      };

    render() {
        return <div>
            rezept
            </div>
    }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Recipe))