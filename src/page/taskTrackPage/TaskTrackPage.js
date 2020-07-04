import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DisplayNotification from '../../components/displayNotification';
import Button from '../../components/UI/button';
import Backdrop from '../../components/UI/backdrop';
import DatePicker from '../../components/datePicker';
import { clearOblectValue } from '../helpersPage';
import { h1TaskTrackPage } from '../../components/helpersComponents';
import { withFetchService } from '../../hoc';
import Spinner from '../../components/spinner';
import { statusThePageTrack } from '../../store/actions/statusThePage';

class TaskTrackPage extends Component {
  state = {
    taskTrack: {
      trackDate: new Date(),
      trackNote: '',
      trackProgress: '0',
    },
    disabled: false,
    taskTrackId: null,
    taskId: '',
    onNotification: false,
    notification: {},
    loading: true,
  };

  componentDidUpdate(prevProps) {
    const { track, title, taskId } = this.props;
    let disabled = false;
    if (title !== prevProps.title && title === h1TaskTrackPage.get('Create')) {
      this.setState({ loading: false });
    }
    if (Object.keys(track).length !== 0) {
      if (track !== prevProps.track) {
        const { taskTrackId, ...taskTrack } = track;
        if (title === h1TaskTrackPage.get('Detail')) {
          disabled = true;
        }
        this.setState({
          disabled,
          taskTrack,
          taskTrackId,
          taskId,
          loading: false,
        });
      }
    }
  }

  onHandleChangeDate = (id) => (value) => {
    this.handleChangeDate(value, id);
  };

  handleChangeDate = (value, id) => {
    const { taskTrack } = this.state;
    taskTrack[id] = value;
    this.setState({ taskTrack });
  };

  handleChange = ({ target: { id, value } }) => {
    const { taskTrack } = this.state;
    taskTrack[id] = value;
    this.setState({ taskTrack });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  buttonCloseClick = () => {
    const { taskTrack, taskId } = this.state;
    const { onTrackClick, statusThePageTrack } = this.props;
    const res = clearOblectValue({}, taskTrack);
    this.setState({
      taskTrack: res.objElemClear,
      disabled: false,
      loading: true,
    });
    onTrackClick(taskId);
    statusThePageTrack();
  };

  createTaskTrackHandler = async () => {
    const { taskTrackId, taskTrack, taskId } = this.state;
    const { fetchService, userTaskId, onTrackClick, statusThePageTrack } = this.props;
    taskTrack.userTaskId = userTaskId;
    let notification = '';
    if (!taskTrackId) {
      const response = await fetchService.setTaskTrack(taskTrack);
      if (response) {
        notification = { title: `✔️ Add new task track.` };
      }
    } else {
      const response = await fetchService.editTaskTrack(taskTrackId, taskTrack);
      if (response) {
        notification = { title: `✔️ Task track was edited.` };
      }
    }
    this.setState({ onNotification: true, notification });
    setTimeout(() => this.setState({ onNotification: false, notification: {} }), 5000);
    const res = clearOblectValue({}, taskTrack);
    this.setState({ taskTrack: res.objElemClear, taskTrackId: null });
    onTrackClick(taskId);
    statusThePageTrack();
  };

  render() {
    const { isTrackPageOpen, title } = this.props;
    const {
      taskTrack: { trackDate, trackNote, trackProgress },
      disabled,
      notification,
      onNotification,
      loading,
    } = this.state;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className={`page-wrap ${isTrackPageOpen ? '' : 'close'}`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <div className='icon-close' onClick={this.buttonCloseClick}>
                  &#10006;
                </div>
                <div className='row'>
                  <DatePicker
                    date={trackDate}
                    id='date'
                    label='Date'
                    disabled={disabled}
                    onChange={this.onHandleChangeDate('trackDate')}
                  />
                  <div className={`form-group`}>
                    <label htmlFor='trackProgress'>Progress (%)</label>
                    <input
                      key='trackProgress'
                      type='number'
                      id='trackProgress'
                      value={trackProgress}
                      onChange={this.handleChange}
                      disabled={disabled}
                      placeholder='progress'
                      autoComplete='off'
                      min='0'
                    />
                  </div>
                </div>
                <div className='form-group'>
                  <label htmlFor='trackNote'>Note</label>
                  <textarea
                    key='trackNote'
                    id='trackNote'
                    name='note'
                    disabled={disabled}
                    value={trackNote}
                    rows='7'
                    onChange={this.handleChange}
                  />
                </div>
                <div className='form-group row'>
                  <Button
                    className='btn-add'
                    disabled={disabled}
                    type='submit'
                    name='Save'
                    onClick={this.createTaskTrackHandler}
                  />
                  <Button className='btn-close' name='Back to grid' onClick={this.buttonCloseClick} />
                </div>
              </>
            )}
          </form>
        </div>
        {isTrackPageOpen && <Backdrop className='backdrop-track' />}
      </>
    );
  }
}

TaskTrackPage.propTypes = {
  title: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  userTaskId: PropTypes.string.isRequired,
  isTrackPageOpen: PropTypes.bool.isRequired,
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  track: PropTypes.objectOf(PropTypes.string).isRequired,
  onTrackClick: PropTypes.func.isRequired,
};

const mapStateToProps = ({ statusThePage: { isTrackPageOpen } }) => {
  return {
    isTrackPageOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    statusThePageTrack: () => dispatch(statusThePageTrack()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withFetchService(TaskTrackPage));
