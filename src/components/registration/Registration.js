import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import DisplayNotification from '../displayNotification';
import Input from '../UI/input';
import Button from '../UI/button';
import { createControl, validateControl } from '../../services/helpers';
import { auth } from '../../store/actions/auth';
import imgLogo from '../../assets/images/logo.png';

class Registration extends PureComponent {
  state = {
    isFormValid: false,
    authInput: {
      email: createControl(
        {
          label: 'Email',
          errorMessage: 'enter correct email',
          type: 'email',
        },
        { required: true, email: true },
      ),
      password: createControl(
        {
          label: 'Password',
          errorMessage: 'enter password',
          type: 'password',
        },
        { required: true, minLenght: 6 },
      ),
    },
    base: 'firebase',
  };

  registerHandler = () => {
    const {
      authInput: { email, password },
      base,
    } = this.state;
    this.props.auth(email.value, password.value, base, false);
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  onHandlelInput = (controlName) => (event) => this.handleInput(event, controlName);

  handleInput = ({ target: { value } }, controlName) => {
    const authInput = { ...this.state.authInput };
    authInput[controlName].value = value;
    authInput[controlName].touched = true;
    authInput[controlName].valid = validateControl(value, authInput[controlName].validation);
    let isFormValid = true;
    Object.keys(authInput).forEach((name) => {
      isFormValid = authInput[name].valid && isFormValid;
    });
    this.setState({ authInput, isFormValid });
  };

  renderInputs() {
    const { authInput } = this.state;
    return Object.keys(authInput).map((controlName, index) => {
      const control = authInput[controlName];
      return (
        <Input
          key={controlName + index}
          id={controlName + index}
          type={control.type}
          value={control.value}
          valid={control.valid}
          touched={control.touched}
          label={control.label}
          errorMessage={control.errorMessage}
          shouldValidation={!!control.validation}
          onChange={this.onHandlelInput(controlName)}
        />
      );
    });
  }

  render() {
    const { notification, onNotification, isRegistred } = this.props;
    const { isFormValid } = this.state;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        {isRegistred && <Redirect to='/Auth' />}
        <div className='auth'>
          <div className='auth-img'>
            <img src={imgLogo} with='100px' height='50px' alt='logo' />
          </div>
          <form onSubmit={this.submitHandler}>
            {this.renderInputs()}
            <br />
            <div className='form-group row'>
              <Button
                type='submit'
                id='registration'
                name='Registration'
                disabled={!isFormValid}
                onClick={this.registerHandler}
              />
            </div>
          </form>
        </div>
      </>
    );
  }
}

Registration.propTypes = {
  onNotification: PropTypes.bool.isRequired,
  notification: PropTypes.object.isRequired,
  isRegistred: PropTypes.bool.isRequired,
  auth: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { onNotification, notification, isRegistred } }) => {
  return {
    onNotification,
    notification,
    isRegistred,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, base, isLogin) => dispatch(auth(email, password, base, isLogin)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Registration);