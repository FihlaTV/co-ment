import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from './Spinner';
import ModalSm from './ModalSm';
import * as Actions from '../store/actions/emailActions';
import { sendEmail } from '../store/actions/apiActions';
import * as connectActions from '../store/actions/apiConnectionActions';
import { adjustTextArea } from '../utils';

class ConnectionEmail extends React.Component {

  componentDidUpdate() {
    adjustTextArea(this.textInput);
  }

  handleChange(event) {
    if (event.target.id === 'body') {
      if (this.props.connectionEmail.body.length > 620) {
        event.preventDefault();
        return null;
      }
      adjustTextArea(event.target);
    }

    this.props.emailActions.setFormField(event.target.id, event.target.value);
    this.props.emailActions.clearFormError();
  }

  sendMsg = () => {
    // validate inputs (form requires only body)
    if (!this.props.connectionEmail.body) {
      this.props.emailActions.setFormError('Your message must have a body');
      return;
    }

    const token = this.props.appState.authToken;
    let email = {
      recipient: this.props.connectionEmail.recipient,
      sender: this.props.connectionEmail.sender,
      copySender: false,
      subject: this.props.connectionEmail.subject,
      body: this.props.connectionEmail.body,
      type: this.props.connectionEmail.type,
      connectionId: this.props.connectionEmail.connectionId,
    };
    switch(this.props.connectionEmail.type) {
      case 'request':
        // This is a new connection.  Build the connection object from
        // Redux store values
        const connection = {
          mentor: {
            id: this.props.connectionEmail.role === 'mentor' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author_id ,
            name: this.props.connectionEmail.role === 'mentor' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author,
            avatar: this.props.connectionEmail.role === 'mentor' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.author_avatar,
          },
          mentee: {
            id: this.props.connectionEmail.role === 'mentee' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author_id,
            name: this.props.connectionEmail.role === 'mentee' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author,
            avatar: this.props.connectionEmail.role === 'mentee' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.author_avatar,
          },
          initiator: {
            id: this.props.appState.userId,
            name: this.props.profiles.userProfile.username,
          },
          originalPost: {
            id: this.props.posts.currentPost._id,
            title: this.props.posts.currentPost.title,
          },
          status: 'pending',
        };
        // Save the connection object...send email if successful
        this.props.connectActions.connect(token, connection)
          .then((result1) => {
            if (result1.type === 'CONNECTION_SUCCESS') {
              email.connectionId = result1.payload.connectionId;
              this.props.emailActions.sendEmail(token, email)
              .then((result2) => {
                if (result2.type === "SEND_EMAIL_SUCCESS") {
                  this.props.history.push('/connectionresult');
                }
              });
            }
          });
        break;
      case 'accept':
        email.copySender = true;
        this.props.emailActions.sendEmail(token, email)
          .then((result) => {
            if (result.type === "SEND_EMAIL_SUCCESS") {
              this.props.connectActions.updateConnectionStatus(
                token,
                {
                  id: this.props.connectionEmail.connectionId,
                  type: 'ACCEPT',
                },
              );
              this.props.emailActions.setEmailModal({
                class: 'modal__show',
                text: 'Connection Accepted!',
                title: 'SUCCESS',
                type: 'modal__success',
                action: () => {
                  this.props.emailActions.setEmailModal({
                    class: 'modal__hide',
                    text: '',
                    title: '',
                    type: '',
                    action: null,
                  });
                  this.props.history.push('/connections');
                },
              });
            }
          });
        break;

      case 'decline':
        this.props.emailActions.sendEmail(token, email)
          .then((result) => {
            if (result.type === "SEND_EMAIL_SUCCESS") {
              this.props.connectActions.updateConnectionStatus(
                token,
                {
                  id: this.props.connectionEmail.connectionId,
                  type: 'DECLINE',
                },
              );
              this.props.emailActions.setEmailModal({
                class: 'modal__show',
                text: 'Connection Declined',
                title: 'COMPLETE',
                type: 'modal__success',
                action: () => {
                  this.props.emailActions.setEmailModal({
                    class: 'modal__hide',
                    text: '',
                    title: '',
                    type: '',
                    action: null,
                  });
                  this.props.history.push('/connections');
                },
              });
            }
          });
        break;
      case 'deactivate':
        email.copySender = true;
        this.props.emailActions.sendEmail(token, email)
          .then((result) => {
            if (result.type === "SEND_EMAIL_SUCCESS") {
              this.props.connectActions.updateConnectionStatus(
                token,
                {
                  id: this.props.connectionEmail.connectionId,
                  type: 'DEACTIVATE',
                },
              );
              this.props.emailActions.setEmailModal({
                class: 'modal__show',
                text: 'Connection Deactivated',
                title: 'COMPLETE',
                type: 'modal__success',
                action: () => {
                  this.props.emailActions.setEmailModal({
                    class: 'modal__hide',
                    text: '',
                    title: '',
                    type: '',
                    action: null,
                  });
                  this.props.history.push('/connections');
                },
              });
            }
          });
        break;
      default:
        // no-op
    }
  }

  render() {
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__connection-header">{this.props.connectionEmail.type} Connection</div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="recipient">TO:
            </label>
            <input className="form__input form__connection-input" type="text" id="recipient" value={this.props.connectionEmail.recipient} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="sender">FROM:
            </label>
            <input className="form__input form__connection-input" type="text" id="sender" value={this.props.connectionEmail.sender} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="subject">Subject:
            </label>
            <input className="form__input form__connection-input" type="text" id="subject" value={this.props.connectionEmail.subject} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="role">Your Role:
            </label>
            <select className="form__input form__input--select" value={this.props.connectionEmail.role} id="role" onChange={event => this.handleChange(event)} >
              <option value="mentor" id="mentor">Mentor</option>
              <option value="mentee" id="mentee">Mentee</option>
            </select>
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="body">Body:
            </label>
            <textarea className="form__input form__connection-input" id="body" value={this.props.connectionEmail.body} onChange={event => this.handleChange(event)} ref={(input) => { this.textInput = input; }}/>
            {this.props.connectionEmail.body &&
              <div className="character-count"> {620 - this.props.connectionEmail.body.length} characters remaining</div> }
          </div>
          <div className="form__input-group">
            <div className={`${this.props.connectionEmail.formErrorClass}`}>{this.props.connectionEmail.formError}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="form__button pointer" id="btn-add" onClick={() => this.sendMsg()}>Send Request</button>
            </div>
          </div>
        </div>
        <Spinner cssClass={this.props.connectionEmail.emailSpinnerClass} />
        <ModalSm
          modalClass={this.props.connectionEmail.emailModal.class}
          modalText={this.props.connectionEmail.emailModal.text}
          modalTitle={this.props.connectionEmail.emailModal.title}
          modalType={this.props.connectionEmail.emailModal.type}
          action={this.props.connectionEmail.emailModal.action}
          dismiss={
            () => {
              this.props.connectActions.setEmailModal({
                text: '',
                class: 'modal__hide',
                title: '',
                type: '',
                action: null,
              });
            }
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  profiles: state.profiles,
  connectionEmail: state.connectionEmail,
});

const mapDispatchToProps = dispatch => ({
  emailActions: bindActionCreators({ ...Actions, sendEmail }, dispatch),
  connectActions: bindActionCreators(connectActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionEmail);
