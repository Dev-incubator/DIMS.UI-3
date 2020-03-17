import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Select from '../../components/UI/select';
import Button from '../../components/UI/button';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue } from '../helpersPage';

export default class MemberPage extends Component {
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
        },
        { required: true, email: true },
      ),
      education: createControl(
        {
          label: 'Education',
          errorMessage: 'enter education',
        },
        { required: true },
      ),
      birthDate: createControl(
        {
          label: 'Bith date',
          errorMessage: 'enter bith date',
          type: 'date',
        },
        { required: true },
      ),
      universityAverageScore: createControl(
        {
          label: 'University average score',
          errorMessage: 'enter university average score',
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
      address: createControl(
        {
          label: 'Address',
          errorMessage: 'enter address',
        },
        { required: true },
      ),
      mobilePhone: createControl(
        {
          label: 'Mobile phone',
          errorMessage: 'enter mobile phone',
        },
        { required: true },
      ),
      skype: createControl(
        {
          label: 'Skype',
          errorMessage: 'enter skype',
        },
        { required: true },
      ),
      startDate: createControl(
        {
          label: 'Start date',
          errorMessage: 'enter start date',
          type: 'date',
        },
        { required: true },
      ),
    },
    memberSelect: {
      direction: {
        label: 'Direction',
        options: [],
      },
      sex: {
        label: 'Sex',
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
      birthDate: '',
      universityAverageScore: '',
      mathScore: '',
      address: '',
      mobilePhone: '',
      skype: '',
      startDate: '',
      directionId: 'direction1',
      sex: 'sex1',
    },
    userId: null,
    directions: [],
  };

  fetchService = new FetchService();

  componentDidUpdate(prevProps) {
    const { member, directions } = this.props;
    const { direction } = this.state.memberSelect;
    if (member.length) {
      const [{ userId, values }] = member;
      if (direction.options.length === 0) {
        const memberSelect = { ...this.state.memberSelect };
        memberSelect.direction.options = directions;
        this.setState({ memberSelect });
      }
      if (member !== prevProps.member) {
        const memberInput = { ...this.state.memberInput };
        Object.entries(values).forEach(([key, value]) => {
          if (memberInput[key]) {
            memberInput[key].value = value;
            memberInput[key].touched = true;
            memberInput[key].valid = true;
          }
        });
        const memberSelect = { ...this.state.memberSelect };
        Object.keys(memberSelect).forEach((key) => {
          if (key === 'direction') {
            memberSelect[key].options = directions;
            memberSelect[key].options.forEach((direction, index) => {
              if (direction.value === values.directionId) {
                memberSelect[key].options[index].selected = true;
              }
            });
          } else if (key === 'sex') {
            memberSelect[key].options.forEach((sex, index) => {
              if (sex.value === values.sex) {
                memberSelect[key].options[index].selected = true;
              }
            });
          }
        });
        this.setState({ memberInput, memberSelect, userId, isFormValid: true, member: values, directions });
      }
    }
  }

  handleImput = ({ target: { value } }, controlName) => {
    const memberInput = { ...this.state.memberInput };
    const member = { ...this.state.member };
    memberInput[controlName].value = value;
    memberInput[controlName].touched = true;
    memberInput[controlName].valid = validateControl(value, memberInput[controlName].validation);
    member[controlName] = value;
    let isFormValid = true;
    Object.keys(memberInput).forEach((name) => {
      isFormValid = memberInput[name].valid && isFormValid;
    });
    this.setState({ memberInput, member, isFormValid });
  };

  handleSelect = ({ target }) => {
    const member = { ...this.state.member };
    if (target.id === 'direction') {
      member['directionId'] = target.options[target.selectedIndex].value;
    } else {
      member[target.id] = target.options[target.selectedIndex].value;
    }
    this.setState({ member });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  createMemberHandler = async () => {
    const { userId, member, memberInput, directions } = this.state;
    if (!userId) {
      const response = await this.fetchService.setMember(member);
      if (response.statusText) {
        alert(`add new member: ${member.name} ${member.lastName}`);
      }
    } else {
      const response = await this.fetchService.editMember(userId, member);
      if (response.statusText) {
        alert(`edit member: ${member.name} ${member.lastName}`);
      }
    }
    const res = clearOblectValue(memberInput, member);
    this.setState({ memberInput: res.objInputClear, member: res.objElemClear, userId: '' });
    this.props.onRegisterClick(directions);
  };

  buttonCloseClick = () => {
    const { directions, memberInput, member } = this.state;
    const res = clearOblectValue(memberInput, member);
    this.setState({ memberInput: res.objInputClear, member: res.objElemClear, userId: '', isFormValid: false });
    this.props.onRegisterClick(directions);
  };

  renderInputs() {
    return Object.keys(this.state.memberInput).map((controlName, index) => {
      const control = this.state.memberInput[controlName];
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
          onChange={(event) => this.handleImput(event, controlName)}
        />
      );
    });
  }

  renderSelect() {
    return Object.keys(this.state.memberSelect).map((controlName) => {
      const control = this.state.memberSelect[controlName];
      let defaultValue = false;
      let options = [];
      const { directions } = this.props;
      const member = { ...this.state.member };
      if (controlName === 'direction') {
        defaultValue = member.directionId;
        options = directions;
      } else {
        defaultValue = member[controlName];
        options = control.options;
      }
      return (
        <Select
          key={controlName}
          options={options}
          defaultValue={defaultValue}
          label={control.label}
          name={controlName}
          id={controlName}
          onChange={(event) => this.handleSelect(event, controlName)}
        />
      );
    });
  }

  render() {
    const { name, lastName } = this.state.member;
    const { isOpen, title } = this.props;
    return (
      <>
        <div className={!isOpen ? `page-wrap close` : `page-wrap`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            <h1 className='subtitle'>{`${name} ${lastName}`}</h1>
            {this.renderInputs()}
            {this.renderSelect()}
            <div className='form-group row'>
              <Button
                className='btn btn-add'
                disabled={!this.state.isFormValid}
                type='submit'
                onClick={this.createMemberHandler}
                name='Save'
              />
              <Button className='btn btn-close' onClick={this.buttonCloseClick} name='Back to grid' />
            </div>
          </form>
        </div>
        {isOpen && <Backdrop />}
      </>
    );
  }
}
