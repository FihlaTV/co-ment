import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';

import InputAutosuggest from './InputAutosuggest';
import RadioGroup from './RadioGroup';
import {languages, skills, timezones } from '../utils';
import parseSKill from '../utils/skillsparser';

class Profile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      value: '',
    };

    this.onChange = this.onChange.bind(this);
    this.addLanguage = this.addLanguage.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeLanguage = this.removeLanguage.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  componentWillMount() {
    // copy the current profile properties into the editable object
    this.props.actions.setEditProfile(this.props.appState.profile);
}

  handleInput(e) {
    this.props.actions.setFormField(e.target.name, e.target.value);
  }

  handleRadioChange(e) {
    this.props.actions.setFormField('gender', e.target.value);
  }

  addLanguage() {
    const newLang = this.props.profiles.editForm.language;
    for (let i = 0; i < this.props.profiles.editForm.languages.length; i ++ ) {
      if (this.props.profiles.editForm.languages[i] === newLang) {
        this.props.actions.setFormField('language', '');
        return;
      }
    }
    this.props.actions.addLanguage(newLang);
  }

  addSkill() {
    const newSkill = this.props.profiles.editForm.skill;
    for (let i = 0; i < this.props.profiles.editForm.skills.length; i ++ ) {
      if (this.props.profiles.editForm.skills[i] === newSkill) {
        this.props.actions.setFormField('skill', '');
        return;
      }
    }
    this.props.actions.addSkill(parseSKill(newSkill));
  }

    // Add Tags on Comma or Enter
  handleKeyPressAdd(e) {
    if (e.charCode === 44 || e.which === 44 || e.charCode === 13 || e.which === 13) {
      e.preventDefault();
      const type = e.target.name;
      if (type === 'language') {
        this.addLanguage();
      } else if (type === 'skill') {
        this.addSkill();
      }
    }
  }

  handleKeyDownRemove(e) {
    if (e.charCode === 13 || e.which === 13 || e.keyCode === 8 || e.which === 8) {
      const type = e.target.className;
      if (type === 'language') {
        this.removeLanguage(e);
      } else if (type === 'skill') {
        this.removeSkill(e);
      }
    }
  }

 removeLanguage(e) {
  const newArray = this.props.profiles.editForm.languages;
  for (let i = 0; i < this.props.profiles.editForm.languages.length; i ++ ) {
    if (this.props.profiles.editForm.languages[i] === e.target.id) {
      this.props.actions.removeLanguage(i);
      break;
    }
  }
}

  removeSkill(e) {
    const newArray = this.props.profiles.editForm.skills;
    for (let i = 0; i < this.props.profiles.editForm.skills.length; i ++ ) {
      if (this.props.profiles.editForm.skills[i] === e.target.id) {
        this.props.actions.removeSkill(i);
        break;
      }
    }
  }

  validateInputs() {
    let msg = '';
    // if (this.props.profiles.editForm.ghUserName === '') {
    //   msg = 'GitHub UserName is required.  ';
    // }
    if (this.props.profiles.editForm.time_zone === 'Choose your time zone' || this.props.profiles.editForm.time_zone === '') {
      msg = 'Time zone is required.  ';
    }
    if (this.props.profiles.editForm.skills.length === 0) {
      msg += 'At least one skill is required. ';
    }
    if (this.props.profiles.editForm.languages.length === 0) {
        msg += 'At least one language is required. ';
      }
    if (msg.length > 0) {
      this.props.actions.setFormField( 'errMsg', msg);
      this.props.actions.setFormField( 'hideErr', '');
      return false;
    }
    return true;
  }

  handleSubmit() {

    // clear previous errors
    this.props.actions.setFormField('hideErr', 'posts__hidden');

    // if user has entered a tag, but not added it to the array, add it now
    if (this.props.profiles.editForm.skill !== '') {
      this.addSkill();
    }
    if (this.props.profiles.editForm.language !== '') {
      this.addLanguage();
    }

    // check for required fields
    // message will be displayed; exit if validate fails
    if (!this.validateInputs()) { return; }

    const body = {
      ghUserName: this.props.profiles.editForm.ghUserName,
      // name: this.props.profiles.editForm.name,
      languages: this.props.profiles.editForm.languages,
      skills: this.props.profiles.editForm.skills,
      time_zone: this.props.profiles.editForm.time_zone,
      gender: this.props.profiles.editForm.gender,
      // avatarUrl: this.props.profiles.editForm.avatarUrl,
    };

    console.log('sending');
    console.log(body);

    this.props.api.modifyProfile(this.props.appState.authToken, this.props.appState.profile._id, body);

    console.log('162');
    console.log(this.props.api.modifyProfile(this.props.appState.authToken, this.props.appState.profile._id, body));
    console.log(this.props.appState.profile);

    this.props.history.push(`/viewprofile/${this.props.appState.profile._id}`);

  }

  ////// autosuggest functions ///////

   onChange(id, newValue) {
    this.props.actions.setFormField(id, newValue);
  }

  render() {
    let langDisp;
    let skillsDisp;
    let ghProfile;
    let name;
    let avatarUrl;
    const formError = this.props.profiles.editForm.errMsg ? 'error' : 'hidden';
    const msgClass = this.props.profiles.saveError ? 'error' : 'hidden';
    const languageList = languages.map(i => (<option key={i}>{i}</option>));
    const skillsList = skills.map(i => (<option key={i}>{i}</option>));
    const tzList = timezones.map(i => (
      <option key={i[1]} value={`UTC ${i[0]}`}>{`(UTC ${i[0]}) ${i[1]}`}</option>
      ));
    if (this.props.profiles.editForm.skills && this.props.profiles.editForm.languages) {
       skillsDisp = this.props.profiles.editForm.skills.join(', ');
       langDisp = this.props.profiles.editForm.languages.join(', ');
    }

    return (
      <div className="container profile">
        <div className="profile__body">
          <div className="form__header">Update Profile: {this.props.appState.profile.username}</div>
          <div className="form__input-group">
            <label htmlFor="ghUserName" className="form__label">GitHub User Name
            </label>
            <input
              className="form__input"
              type="text"
              id="ghUserName"
              name="ghUserName"
              value={this.props.profiles.editForm.ghUserName}
              onChange={e => this.handleInput(e)}
              placeholder="GitHub User Name"
            />
          </div>
        {/*  <div className="form__input-group">
            <label htmlFor="name" className="form__label">Full name
            </label>
            <input
              className="form__input"
              type="text"
              id="name"
              name="name"
              value={this.props.profiles.editForm.name}
              onChange={e => this.handleInput(e)}
              placeholder="Full name"
            />
          </div> */}
          <div className="form__input-group">
            <label htmlFor="language" className="form__label">Languages you speak fluently
            </label>
          <div className="skill-value__wrapper">
              {this.props.profiles.editForm.languages && this.props.profiles.editForm.languages.map(lang => (
                <span className="skill-value" key={lang}>
                  <span className="skill-value__icon" aria-hidden="true">
                    <span
                      className="language"
                      id={lang}
                      role="button"
                      tabIndex="0"
                      onClick={e => this.removeLanguage(e)}
                      onKeyDown={e => this.handleKeyDownRemove(e)}
                    >
                       &times;
                      </span>
                  </span>
                  <span className="skill-value__label" role="option" aria-selected="true">
                    {lang}
                    <span className="skill-aria-only">&nbsp;</span>
                  </span>
                </span>
               ))}
            </div>
            <InputAutosuggest
              id="language"
              name="language"
              placeholder="Add Languages"
              onChange={this.onChange}
              list={languages}
              onKeyPress={(e) => this.handleKeyPressAdd(e)}
              value={this.props.profiles.editForm.language}
              addTag={this.addLanguage}
              removeTag={this.removeLanguage}
              ref={instance => { this.languageInput = instance; }}
            />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="skills">Skills</label>
            <div className="skill-value__wrapper">
            {this.props.profiles.editForm.skills && this.props.profiles.editForm.skills.map(skill => (
              <span className="skill-value" key={skill}>
                <span className="skill-value__icon" aria-hidden="true">
                  <span
                    className="skill"
                    id={skill}
                    role="button"
                    tabIndex="0"
                    onClick={e => this.removeSkill(e)}
                    onKeyDown={e => this.handleKeyDownRemove(e)}
                  >
                     &times;
                  </span>
                </span>
                <span className="skill-value__label" role="option" aria-selected="true">
                  {skill}
                  <span className="skill-aria-only">&nbsp;</span>
                </span>
              </span>
             ))}
            </div>
            <InputAutosuggest
              id="skill"
              name="skill"
              placeholder="Add Skills"
              onChange={this.onChange}
              list={skills}
              onKeyPress={(e) => this.handleKeyPressAdd(e)}
              value={this.props.profiles.editForm.skill}
              addTag={this.addSkill}
              removeTag={this.removeSkill}
              ref={instance => { this.skillInput = instance; }}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="timezone" className="form__label">Time Zone</label>
            <select
              className="form__input form__input--select"
              id="time_zone"
              name="time_zone"
              value={this.props.profiles.editForm.time_zone || 'Choose your time zone'}
              onChange={e => this.handleInput(e)}
            >
              <option disabled>Choose your time zone</option>
              {tzList}
            </select>
          </div>
          <div className="form__input-group" >
           <RadioGroup
            title={'Gender'}
            setName={'gender'}
            type={'radio'}
            controlFunc={this.handleRadioChange}
            options={['Male', 'Female', 'Other']}
            selectedOptions={this.props.profiles.editForm.gender} />
          </div>
      {/*    <div className="form__input-group">
            <label htmlFor="name" className="form__label">Link to profile image
            </label>
            <input
              className="form__input"
              type="text"
              id="avatarUrl"
              name="avatarUrl"
              value={this.props.profiles.editForm.avatarUrl}
              onChange={e => this.handleInput(e)}
              placeholder="Paste URL or leave blank to use GitHub avatar"
            />
          </div> */}
          <div className="form__input-group">
            <div className={formError}>{this.props.profiles.editForm.errMsg}</div>
          </div>
          <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="form__button pointer" id="btn-edit" onClick={() => this.handleSubmit()}>
            {this.props.profiles.savingProfile ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
        <div className="form__input-group">
            <div className={msgClass}>
            {this.props.profiles.saveError &&
              this.props.profiles.saveError.message }
            </div>
          </div>
        </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
