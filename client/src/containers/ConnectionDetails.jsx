import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as apiActions from '../store/actions/apiConnectionActions';
import * as Actions from '../store/actions/connectionActions';


class ConnectionDetails extends React.Component {

  // Find the connection matching the URL param and set it in redux state.
  componentDidMount() {
    for (let i = 0; i < this.props.connection.connections.length; i += 1) {
      if (this.props.connection.connections[i]._id === this.props.match.params.id) {
        this.props.actions.setViewConnection(this.props.connection.connections[i]);
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.clearViewConnection();
  }

  getActions = () => {
    let actions;
    switch (this.props.connection.viewConnection.status) {
      case 'pending':
        actions = (this.props.connection.viewConnection.initiator.id !== this.props.profiles.userProfile._id) ?
          (<ul className="post-nav">
            <li className="post-nav__item" >
              <span
                className="post-nav__item-link pointer"
                onClick={() =>
                  this.props.api.updateConnectionStatus(
                    this.props.appState.authToken,
                    {
                      id: this.props.connection.viewConnection._id,
                      type: 'ACCEPT',
                    },
                  )
                }
              >
                Accept
              </span>
            </li>
            <li className="post-nav__item" >
              <span
                className="post-nav__item-link pointer"
                onClick={() =>
                  this.props.api.updateConnectionStatus(
                    this.props.appState.authToken,
                    {
                      id: this.props.connection.viewConnection._id,
                      type: 'DECLINE',
                    },
                  )
                }
              >
                Decline
              </span>
            </li>
          </ul>
        ) :
        null;
        break;
      case 'accepted':
        actions = (
          <ul className="post-nav">
            <li className="post-nav__item" >
              <span
                className="post-nav__item-link pointer"
                onClick={() =>
                  this.props.api.updateConnectionStatus(
                    this.props.appState.authToken,
                    {
                      id: this.props.connection.viewConnection._id,
                      type: 'EXPIRE',
                    },
                  )
                }
              >
                Finish
              </span>
            </li>
          </ul>
        );
        break;
      case 'expired':
      case 'declined':
      default:
        actions = null;
    }
    return actions;
  }

  render() {
    console.log(this.props.connection)
    const conn = this.props.connection.viewConnection;
    return (
      <div className="container conn-details">
        <div className="conn-preview">
          <div className="conn-details__text-wrap">
            <div className="conn-details__title">
              Connection Details
            </div>
          </div>
          <div className="conn-details__avatars">
            <div className="conn-details__image-wrap">
              <div  className="conn-details__header">Mentor</div>
              {
                this.props.connection.viewConnection.mentor.avatar ?
                <img className="conn-details__image" src={this.props.connection.viewConnection.mentor.avatar} /> :
                <i className="fa fa-user-circle fa-5x conn-details__default-avatar" aria-hidden="true" />
              }
              <div className="conn-details__text">{this.props.connection.viewConnection.mentor.name}</div>
            </div>
            <div className="conn-details__image-wrap">
              <div className="conn-details__header">Mentee</div>
                {
                  this.props.connection.viewConnection.mentee.avatar ?
                  <img className="conn-details__image" src={this.props.connection.viewConnection.mentee.avatar} /> :
                  <i className="fa fa-user-circle fa-5x conn-details__default-avatar" aria-hidden="true" />
                }
              <div  className="conn-details__text">{this.props.connection.viewConnection.mentee.name}</div>
            </div>
          </div>
          <div className="conn-details__header-wrap">
            <div className="conn-details__header">Initiated By: </div>
            <span className="conn-details__text">{this.props.connection.viewConnection.initiator.name} </span>
          </div>
          <div className="conn-details__header-wrap">
            <div className="conn-details__header">Original Post:</div>
            <Link className="conn-details__text" to={`/viewpost/${this.props.connection.viewConnection.originalPost.id}`}>
              {this.props.connection.viewConnection.originalPost.title}
            </Link>
          </div>
          <div className="conn-details__header-wrap">
            <div className="conn-details__header">Status: </div>
            <span className="conn-details__text">{this.props.connection.viewConnection.status}</span>
          </div>
          <div className="conn-details__header-wrap">
            <div className="conn-details__header">Date Updated: </div>
            <span className="conn-details__text">{this.props.connection.viewConnection.dateStarted}</span>
          </div>
          <div className="single-post__button-wrap">
            { this.getActions() }
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  appState: state.appState,
  connection: state.connection,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionDetails);