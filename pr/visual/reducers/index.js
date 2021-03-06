import { routeReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
function entities(state = {}, action) {
    if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities);
    }
    return state;
}


const rootReducer = combineReducers({
    entities,
    routing: routeReducer
});


export default rootReducer
