import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Error403 from '../components/errors/Error403'
import Error404 from '../components/errors/Error404'


class ErrorPage extends Component {
    constructor(props) {
        super(props);
    }


    renderError(code) {
        let result = <p>Hello world!</p>;
        switch (code) {
            case 404:
                result = <Error404 />;
                break;
            case 403:
                result = <Error403 />;
                break;
        }
        return result;
    }

    render() {
        const {route:{status}} = this.props;

        const errorContent = this.renderError(status);

        return (
            <div>
                {errorContent}
            </div>
        )
    }
}


export default ErrorPage
