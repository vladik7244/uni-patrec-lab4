import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class App extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { children } = this.props;

        return (
            <div className="container">

                {children}

            </div>
        )
    }
}


export default connect()(App)
