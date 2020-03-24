import axios from 'axios';
export default class FetchService {
  api_base = process.env.REACT_APP_API_BASE;

  getSource = async (url) => {
    try {
      return await axios.get(`${this.api_base}${url}`);
    } catch (error) {
      console.log(error);
    }
  };

  setSource = async (url, body) => {
    try {
      return await axios.post(`${this.api_base}${url}`, body);
    } catch (error) {
      console.log(error);
    }
  };

  editSource = async (url, body) => {
    try {
      return await axios.put(`${this.api_base}${url}`, body);
    } catch (error) {
      console.log(error);
    }
  };

  deleteSource = async (url) => {
    try {
      return await axios.delete(`${this.api_base}${url}`);
    } catch (error) {
      console.log(error);
    }
  };

  getAllMember = async () => {
    const response = await this.getSource(`/UserProfile.json`);
    const members = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [userId, values] = key;
        members.push({
          userId,
          values,
          fullName: `${values.name} ${values.lastName}`,
          checked: false,
        });
      });
    }
    return members;
  };

  getAllTask = async () => {
    const response = await this.getSource(`/Task.json`);
    const tasks = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [taskId, values] = key;
        const { name, description, startDate, deadlineDate } = values;
        tasks.push({
          taskId,
          name,
          description,
          startDate,
          deadlineDate,
        });
      });
    }
    return tasks;
  };

  getTask = async (id) => {
    const response = await this.getSource(`/Task/${id}.json`);
    return response;
  };

  getAllUserTasks = async () => {
    const response = await this.getSource(`/UserTask.json`);
    const userTasks = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [userTaskId, values] = key;
        const { taskId, userId, stateId } = values;
        userTasks.push({
          userTaskId,
          taskId,
          userId,
          stateId,
        });
      });
    }
    return userTasks;
  };

  getTaskState = async (id) => {
    const response = await this.getSource(`/TaskState/${id}.json`);
    return response;
  };

  getDirection = async () => {
    const response = await this.getSource(`/Direction.json`);
    const direction = [];
    if (response && response.data) {
      Object.entries(response.data).forEach((key) => {
        const [value, { name }] = key;
        direction.push({
          value,
          name,
        });
      });
    }
    return direction;
  };

  setMember = async (body) => {
    return await this.setSource(`/UserProfile.json`, body);
  };

  setTask = async (body) => {
    return await this.setSource(`/Task.json`, body);
  };

  setUserTask = async (body) => {
    return await this.setSource(`/UserTask.json`, body);
  };

  setTaskState = async (body) => {
    return await this.setSource(`/TaskState.json`, body);
  };

  setTaskTrack = async (body) => {
    return await this.setSource(`/TaskTrack.json`, body);
  };

  editMember = async (memberId, body) => {
    return await this.editSource(`/UserProfile/${memberId}.json`, body);
  };

  editTask = async (taskId, body) => {
    return await this.editSource(`/Task/${taskId}.json`, body);
  };

  editTaskState = async (taskId, body) => {
    return await this.editSource(`/TaskState/${taskId}.json`, body);
  };

  delMember = async (memberId) => {
    return await this.deleteSource(`/UserProfile/${memberId}.json`);
  };

  delTask = async (taskId) => {
    return await this.deleteSource(`/Task/${taskId}.json`);
  };

  delUserTask = async (userTaskId) => {
    return await this.deleteSource(`/UserTask/${userTaskId}.json`);
  };

  delTaskState = async (taskStateId) => {
    return await this.deleteSource(`/TaskState/${taskStateId}.json`);
  };
}
