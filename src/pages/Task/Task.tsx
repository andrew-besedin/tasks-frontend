import { useEffect, useState } from "react";
import type { Task } from "../../types/Task";
import { ApiRequests } from "../../requests/api";
import { useNavigate, useParams } from "react-router";

type TaskContentProps = {
  task: Task;
  taskStatus: Task["status"];
  isStatusUploading: boolean;
  onStatusChange: React.ChangeEventHandler<HTMLSelectElement>;
  onStatusUpdateClick: () => void;
}
const TaskContent: React.FC<TaskContentProps> = ({
  task,
  taskStatus,
  onStatusChange,
  onStatusUpdateClick,
  isStatusUploading
}) => {

  return (
    <div>
      <h3>{task.name}</h3>
      {isStatusUploading 
        ? (
          <p>Uploading...</p>
        )
        : (
          <div>
            <p>Status:</p>
            <select
              id="select"
              value={taskStatus}
              onChange={onStatusChange}
            >
              <option value="0">Not Started</option>
              <option value="1">In Progress</option>
              <option value="2">Completed</option>
            </select>
            <button onClick={onStatusUpdateClick}>
              Update Status
            </button>
          </div>
        )
      }
    </div>
  )
}

export const TaskPage: React.FC = () => {
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [taskStatus, setTaskStatus] = useState<Task["status"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isStatusUploading, setIsStatusUploading] = useState(false);

  const { taskId } = useParams();

  const onStatusChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setTaskStatus(Number(event.target.value) as Task["status"]);
  }

  async function onStatusUpdateClick() {
    setIsStatusUploading(true);
    try {
      await ApiRequests.updateTaskStatus(taskId || "", taskStatus || 0);
    } catch (err) {
      console.error(err);
    }
    setIsStatusUploading(false);
    await fetchTask();
  }

  async function fetchTask() {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await ApiRequests.getTask(taskId || "");
      if (response.status === 404) {
        navigate('/');
      } else {
        const fetchedTask = response.data;
        setTask(fetchedTask);
        setTaskStatus(fetchedTask.status);
      }
    } catch (err) {
      setIsError(true);
      console.error(err);
    }
    setIsLoading(false);
  }

  async function onPageLoad() {
    if (!taskId) {
      return navigate('/');
    }

    await fetchTask();
  }

  useEffect(() => {
    onPageLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Task</h1>
      {
        isError
          ? <p>Error while loading.</p>
          : (
            isLoading
              ? <p>Loading...</p>
              : (
                (task !== null) && (taskStatus !== null) && (
                  <TaskContent
                    onStatusChange={onStatusChange}
                    onStatusUpdateClick={onStatusUpdateClick}
                    taskStatus={taskStatus}
                    task={task}
                    isStatusUploading={isStatusUploading}
                  />
                )
              )
          )
      }
    </div>
  )
}