import { useEffect, useState } from "react";
import { statusLabels, type Task } from "../../types/Task";
import { ApiRequests } from "../../requests/api";
import { Link } from "react-router";

type TasksListProps = {
  tasks: Task[];
}
const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <p className="empty">Empty list.</p>
    )
  }

  return (
    <ul className="task-list">
      {
        tasks.map(task => (
          <li key={task.id}>
            <Link to={`/task/${encodeURIComponent(task.id)}`}>
              <span>{task.name}</span>
              <span className={`status status-${task.status}`}>
                {statusLabels[task.status]}
              </span>
            </Link>
          </li>
        ))
      }
    </ul>
  );
};

export const Home: React.FC = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [newTaskName, setNewTaskName] = useState("");
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  async function onAddTaskClick() {
    setIsAddingLoading(true);
    try {
      await ApiRequests.createTask(newTaskName);
    } catch (err) {
      console.error(err);
    }
    setIsAddingLoading(false);
    fetchTasks();
  };

  async function fetchTasks() {
    setIsLoading(true);
    setIsError(false);
    try {
      const fetchedTasks: Task[] = await ApiRequests.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setIsError(true);
      console.error(err);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main>
      <h1>Task List</h1>
      {
        isLoading
          ? (
            <p className="empty">Loading...</p>
          )
          : (
            isError
              ? (
                <p className="empty">Error while loading.</p>
              )
              : (
                <div>
                  <TasksList tasks={tasks} />
                  <div className="form-row">
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={(event) => setNewTaskName(event.target.value)}
                      placeholder="New Task Name"
                    />
                    <button onClick={onAddTaskClick}>
                      Add Task
                    </button>
                    {
                      isAddingLoading && (
                        <p>Adding...</p>
                      )
                    }
                  </div>
                </div>
              )
          )
      }
    </main>
  );
}