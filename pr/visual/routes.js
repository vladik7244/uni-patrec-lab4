import React            from 'react'
import { Route, IndexRoute } from 'react-router'
import App              from './containers/App'


import ErrorPage        from './containers/ErrorPage'
import Statistic        from './containers/Statistic'

class Routes {
    constructor(store) {
        this.store = store;

    }

    getRoutes() {
        return (
            <Route component={App}>

                <Route path="/statistic" component={Statistic}/>
                <Route path="*" component={ErrorPage} status={404}/>
            </Route>
        );
    }


}


export default Routes
