import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../components/spinner';
import DisplayNotification from '../../components/displayNotification';
import Backdrop from '../../components/UI/backdrop';
import Select from '../../components/UI/select';
import Button from '../../components/UI/button';
import DatePicker from '../../components/datePicker';
import { createControl, validateControl, fillControl, formValid } from '../../services/helpers';
import { clearObjectValue, updateInput, renderInputs } from '../helpersPage';
import { h1MemberPage } from '../../components/helpersComponentPageMaking';
import { withFetchService } from '../../hoc';
import imgChart from '../../assets/images/chart.png';

import { statusThePageChart, statusThePageMember } from '../../redux/actions/statusThePage';

class MemberPage extends Component {
  state = {
    isFormValid: false,
    memberInput: {
      name: createControl(
        {
          label: 'Name',
          errorMessage: 'enter user name',
        },
        { required: true },
      ),
      lastName: createControl(
        {
          label: 'Last name',
          errorMessage: 'enter user last name',
        },
        { required: true },
      ),
      email: createControl(
        {
          label: 'Email',
          errorMessage: 'enter correct email',
          placeholder: 'xxxx@xx',
        },
        { required: true, email: true },
      ),
      skype: createControl(
        {
          label: 'Skype',
          errorMessage: 'enter skype',
        },
        { required: true },
      ),
      education: createControl(
        {
          label: 'Education',
          errorMessage: 'enter education',
        },
        { required: true },
      ),
      address: createControl(
        {
          label: 'Address',
          errorMessage: 'enter address',
        },
        { required: true },
      ),
      universityAverageScore: createControl(
        {
          label: 'University score',
          errorMessage: 'enter average score',
          type: 'number',
        },
        { required: true },
      ),
      mathScore: createControl(
        {
          label: 'Math score',
          errorMessage: 'enter math score',
          type: 'number',
        },
        { required: true },
      ),
      mobilePhone: createControl(
        {
          label: 'Mobile phone',
          errorMessage: 'enter mobile phone',
          // placeholder: '+375 xx xxxxxxx',
          pattern: '2-[0-9]{3}-[0-9]{3}',
        },
        { required: true },
      ),
    },
    memberSelect: {
      direction: {
        label: 'Direction',
        name: 'direction',
        options: [],
      },
      sex: {
        label: 'Sex',
        name: 'sex',
        options: [
          {
            name: 'Male',
            value: 'sex1',
          },
          {
            name: 'Female',
            value: 'sex2',
          },
        ],
      },
    },
    member: {
      name: '',
      lastName: '',
      email: '',
      education: '',
      birthDate: new Date('01/01/2000'),
      universityAverageScore: '',
      mathScore: '',
      address: '',
      mobilePhone: '',
      skype: '',
      startDate: new Date(),
      directionId: 'direction1',
      sex: 'sex1',
      index: '',
    },
    userId: null,
    disabled: false,
    loading: true,
    directions: [],
    onNotification: false,
    notification: {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index } = nextProps;
    return {
      member: { ...prevState.member, index },
    };
  }

  componentDidUpdate(prevProps) {
    const { member, directions, title } = this.props;
    const {
      memberSelect: { direction, sex },
    } = this.state;
    let disabled = false;
    if (title !== prevProps.title && title === h1MemberPage.get('Create')) {
      this.setState({ loading: false });
    }
    if (member.length) {
      const [{ userId, ...values }] = member;
      if (!direction.options.length && directions.length) {
        const { memberSelect } = this.state;
        memberSelect.direction.options = directions;
        this.setState({ memberSelect });
      }
      if (member !== prevProps.member) {
        const memberInput = updateInput(this.state.memberInput, values);
        const { memberSelect } = this.state;
        Object.keys(memberSelect).forEach((key) => {
          if (key === direction.name) {
            memberSelect[key].options = directions;
            memberSelect[key].options.forEach((direction, index) => {
              if (direction.value === values.directionId) {
                memberSelect[key].options[index].selected = true;
              }
            });
          } else if (key === sex.name) {
            memberSelect[key].options.forEach((sex, index) => {
              if (sex.value === values.sex) {
                memberSelect[key].options[index].selected = true;
              }
            });
          }
        });
        if (title === h1MemberPage.get('Detail')) {
          disabled = true;
        }
        this.setState({
          memberInput,
          memberSelect,
          userId,
          isFormValid: true,
          member: values,
          directions,
          disabled,
          loading: false,
        });
      }
    }
  }

  onHandleInput = (controlName) => (event) => {
    this.handleInput(event, controlName);
  };

  handleInput = ({ target: { value } }, controlName) => {
    const { memberInput, member } = this.state;
    memberInput[controlName].value = value;
    memberInput[controlName].touched = true;
    member[controlName] = value;
    this.setState({ memberInput, member, isFormValid: formValid(memberInput) });
  };

  onHandleFinishEditing = (controlName) => (event) => {
    this.handleFinishEditing(event, controlName);
  };

  handleFinishEditing = ({ target: { value } }, controlName) => {
    const { memberInput } = this.state;
    memberInput[controlName].valid = validateControl(value, memberInput[controlName].validation);
    this.setState({ memberInput, isFormValid: formValid(memberInput) });
  };

  onHandleFocus = (controlName) => () => {
    this.handleFocus(controlName);
  };

  handleFocus = (controlName) => {
    let { memberInput } = this.state;
    memberInput = fillControl(memberInput, controlName);
    this.setState({ memberInput });
  };

  handleShowChart = () => {
    this.props.statusThePageChart(true);
  };

  onHandleChangeDate = (id) => (value) => {
    this.handleChangeDate(value, id);
  };

  handleChangeDate = (value, id) => {
    const { member } = this.state;
    member[id] = value;
    this.setState({ member });
  };

  onHandleSelect = (controlName) => (event) => {
    this.handleSelect(event, controlName);
  };

  onHandlelSelect = (controlName) => (event) => this.handleSelect(event, controlName);

  handleSelect = ({ target }) => {
    const {
      member,
      memberSelect: { direction },
    } = this.state;
    if (target.id === direction.name) {
      member.directionId = target.options[target.selectedIndex].value;
    } else {
      member[target.id] = target.options[target.selectedIndex].value;
    }
    this.setState({ member });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  createMemberHandler = () => {
    if (!this.state.userId) {
      this.changeMember('add');
    } else {
      this.changeMember('edit');
    }
    this.props.statusThePageMember();
  };

  buttonCloseClick = () => {
    const { directions, memberInput, member } = this.state;
    const { onRegisterClick, statusThePageMember } = this.props;
    const res = clearObjectValue(memberInput, member);
    this.setState({
      memberInput: res.objInputClear,
      member: res.objElemClear,
      userId: '',
      isFormValid: false,
      disabled: false,
      loading: true,
    });
    onRegisterClick(directions);
    statusThePageMember();
  };

  async changeMember(value) {
    const { userId, member, memberInput, directions } = this.state;
    const { fetchService, onRegisterClick } = this.props;
    let notification = '';
    try {
      if (value === 'edit') {
        await fetchService.editMember(userId, member);
        notification = { title: `✔️ Member: ${member.name} ${member.lastName} was edited` };
      } else {
        await fetchService.setMember(member);
        notification = { title: `✔️ New member: ${member.name} ${member.lastName} was added` };
      }
      this.setState({ onNotification: true, notification });
      const res = clearObjectValue(memberInput, member);
      this.setState({ memberInput: res.objInputClear, member: res.objElemClear, userId: '' });
      onRegisterClick(directions);
    } catch ({ message }) {
      this.setState({ onNotification: true, notification: { title: `❗️ ${message}`, status: 'error' } });
    }
    setTimeout(() => this.setState({ onNotification: false, notification: {} }), 5000);
  }

  renderSelect() {
    const { memberSelect, member, disabled } = this.state;
    return Object.keys(memberSelect).map((controlName) => {
      const control = memberSelect[controlName];
      let defaultValue;
      let options;
      const { directions } = this.props;
      if (controlName === memberSelect.direction.name) {
        defaultValue = member.directionId;
        options = directions;
      } else {
        defaultValue = member[controlName];
        options = control.options;
      }
      return (
        <Select
          options={options}
          defaultValue={defaultValue}
          label={control.label}
          name={controlName}
          key={controlName}
          id={controlName}
          disabled={disabled}
          onChange={this.onHandleSelect(controlName)}
        />
      );
    });
  }

  render() {
    const {
      member: { startDate, birthDate },
      disabled,
      loading,
      isFormValid,
      onNotification,
      notification,
      memberInput,
    } = this.state;
    const { isMemberPageOpen, title } = this.props;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className={`page-wrap ${isMemberPageOpen ? '' : 'close'}`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form member'>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <div className='icon-close' onClick={this.buttonCloseClick}>
                  &#10006;
                </div>
                <div className='form-group-members'>
                  {renderInputs(
                    memberInput,
                    disabled,
                    this.onHandleInput,
                    this.onHandleFinishEditing,
                    this.onHandleFocus,
                    'form-group-member',
                  )}
                </div>
                <div className='row'>
                  <DatePicker
                    date={birthDate}
                    id='birthDate'
                    label='Birth date'
                    disabled={disabled}
                    onChange={this.onHandleChangeDate('birthDate')}
                  />
                  <DatePicker
                    date={startDate}
                    id='startDate'
                    label='Start date'
                    disabled={disabled}
                    onChange={this.onHandleChangeDate('startDate')}
                  />
                </div>
                <div className='row'>{this.renderSelect()}</div>
                <div className='form-group row'>
                  {!disabled && (
                    <Button
                      className='btn-add'
                      disabled={disabled || !isFormValid}
                      type='submit'
                      onClick={this.createMemberHandler}
                      name='Save'
                    />
                  )}
                  <Button className='btn-close' onClick={this.buttonCloseClick} name='Back to grid' />
                </div>
                <div className='chart_wrap'>
                  <div className='imgMain-wrap' onClick={this.handleShowChart}>
                    <img src={imgChart} alt='chart icon' />
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
        {isMemberPageOpen && <Backdrop className='backdrop-member' />}
      </>
    );
  }
}

MemberPage.propTypes = {
  title: PropTypes.string.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  isMemberPageOpen: PropTypes.bool.isRequired,
  statusThePageChart: PropTypes.func.isRequired,
  statusThePageMember: PropTypes.func.isRequired,
  member: PropTypes.arrayOf(PropTypes.object).isRequired,
  directions: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

const mapStateToProps = ({ statusThePage: { isMemberPageOpen } }) => ({
  isMemberPageOpen,
});

const mapDispatchToProps = (dispatch) => {
  return {
    statusThePageChart: (status) => dispatch(statusThePageChart(status)),
    statusThePageMember: () => dispatch(statusThePageMember()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withFetchService(MemberPage));
