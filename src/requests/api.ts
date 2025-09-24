import axios from "axios";
import type { Task } from "../types/Task";

export class ApiRequests {
  private static axiosInstance = axios.create({ baseURL: '/api' });

  static async getTasks() {
    return this.axiosInstance.get('/tasks').then(res => res.data);
  }

  static async createTask(taskName: string) {
    return this.axiosInstance.post('/tasks', { taskName }).then(res => res.data);
  }

  static async getTask(taskId: string) {
    return this.axiosInstance.get(
      `/task/${encodeURIComponent(taskId)}`,
      {
        validateStatus: (status) => status >= 200 && status < 500,
      },
    );
  }

  static async updateTaskStatus(taskId: string, status: Task["status"]) {
    return this.axiosInstance.patch(`/task/${encodeURIComponent(taskId)}/status`, { newStatus: status }).then(res => res.data);
  }
}