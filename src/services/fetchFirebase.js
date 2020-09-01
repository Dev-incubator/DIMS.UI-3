import axios from 'axios';

export default class FetchFirebase {
  apiBase = process.env.REACT_APP_API_BASE_FIREBASE;

  getSource = (url) => {
    return axios.get(`${this.apiBase}${url}`);
  };


  setSource = (url, body) => {
    return axios.post(`${this.apiBase}${url}`, body);
  };

  editSource = (url, body) => {
    return axios.put(`${this.apiBase}${url}`, body);
  };

  deleteSource = (url) => {
    return axios.delete(`${this.apiBase}${url}`);
  };

  getAllMember = async () => {
    const response = await this.getSource(`/UserProfile.json`);
    let members = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [userId, values] = key;
        members = members.concat({
          userId,
          ...values,
          fullName: `${values.name} ${values.lastName}`,
          checked: false,
        });
      });
    }
    return members;
  };

  getAllTask = async () => {
    const response = await this.getSource(`/Task.json`);
    let tasks = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [taskId, values] = key;
        tasks = tasks.concat({
          taskId,
          ...values,
        });
      });
    }
    return tasks;
  };

  getTask = async (id) => {
    const response = await this.getSource(`/Task/${id}.json`);
    let tasks = [];
    if (response && response.data) {
      response.data.taskId = id;
      tasks = tasks.concat(response.data);
    }
    return tasks;
  };

  getAllUserTasks = async () => {
    const response = await this.getSource(`/UserTask.json`);
    let userTasks = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [userTaskId, values] = key;
        userTasks = userTasks.concat({
          userTaskId,
          ...values,
        });
      });
    }
    return userTasks;
  };

  getTaskState = async (id) => {
    const response = await this.getSource(`/TaskState/${id}.json`);
    return response;
  };

  getAllUserTaskTrack = async () => {
    const response = await this.getSource(`/TaskTrack.json`);
    let taskTrack = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [taskTrackId, values] = key;
        taskTrack = taskTrack.concat({
          taskTrackId,
          ...values,
        });
      });
    }
    return taskTrack;
  };

  getDirection = async () => {
    const response = await this.getSource(`/Direction.json`);
    let direction = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [value, { name }] = key;
        direction = direction.concat({
          value,
          name,
        });
      });
    }
    return direction;
  };

  setMember = (body) => {
    return this.setSource(`/UserProfile.json`, body);
  };

  setTask = (body) => {
    return this.setSource(`/Task.json`, body);
  };

  setUserTask = (body) => {
    return this.setSource(`/UserTask.json`, body);
  };

  setTaskState = (body) => {
    return this.setSource(`/TaskState.json`, body);
  };

  setTaskTrack = (body) => {
    return this.setSource(`/TaskTrack.json`, body);
  };

  editMember = (memberId, body) => {
    return this.editSource(`/UserProfile/${memberId}.json`, body);
  };

  editTask = (taskId, body) => {
    return this.editSource(`/Task/${taskId}.json`, body);
  };

  editTaskTrack = (taskTrackId, body) => {
    return this.editSource(`/TaskTrack/${taskTrackId}.json`, body);
  };

  editTaskState = (taskId, body) => {
    return this.editSource(`/TaskState/${taskId}.json`, body);
  };

  delMember = (memberId) => {
    return this.deleteSource(`/UserProfile/${memberId}.json`);
  };

  delTask = (taskId) => {
    return this.deleteSource(`/Task/${taskId}.json`);
  };

  delUserTask = (userTaskId) => {
    return this.deleteSource(`/UserTask/${userTaskId}.json`);
  };

  delTaskTrack = (taskTrackId) => {
    return this.deleteSource(`/TaskTrack/${taskTrackId}.json`);
  };

  delTaskState = (taskStateId) => {
    return this.deleteSource(`/TaskState/${taskStateId}.json`);
  };
}
