import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE,
  CONNECTION_REQUEST, CONNECTION_SUCCESS, CONNECTION_FAILURE,
  GET_CONNECTION_REQUEST, GET_CONNECTION_SUCCESS, GET_CONNECTION_FAILURE,
} from '../actions/apiActions';

const INITIAL_STATE = {
  contact_loading: false,
  contact_error: null,
  connect_loading: false,
  connect_error: null,
  getConnectionsLoading: false,
  getConnectionsError: null,
  connections: [],
};

function connection(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case CONTACT_REQUEST:
      return Object.assign({}, state, { contact_loading: true, contact_error: null });

    case CONTACT_SUCCESS:
      return Object.assign({}, state, { contact_loading: false, contact_error: null });

    case CONTACT_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { contact_loading: false, contact_error: error });

    case CONNECTION_REQUEST:
      return Object.assign({}, state, { connect_loading: true, connect_error: null });

    case CONNECTION_SUCCESS:
      return Object.assign({}, state, { connect_loading: false, connect_error: null });

    case CONNECTION_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { connect_loading: false, connect_error: error });

    case GET_CONNECTION_REQUEST:
      return Object.assign({}, state, { getConnectionsLoading: true, getConnectionsError: null });

    case GET_CONNECTION_SUCCESS:
    console.log(action)
      return Object.assign({}, state, { connections: action.payload.connections, getConnectionsLoading: false, getConnectionsError: null });

    case GET_CONNECTION_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { getConnectionsLoading: false, getConnectionsError: error });

    default:
      return state;
  }
}

export default connection;