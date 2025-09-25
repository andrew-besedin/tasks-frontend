import { useEffect, useState } from "react";
import type { Task } from "../../types/Task";
import { ApiRequests } from "../../requests/api";
import { Link } from "react-router";

type TasksListProps = {
  tasks: Task[];
}
const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <p>Empty list.</p>
    )
  }

  return (
    <ul>
      {
        tasks.map(task => (
          <li>
            <Link to={`/task/${encodeURIComponent(task.id)}`}>
              {task.name}
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
    <div>
      <h1>Tasks</h1>
      <p>Tasks list:</p>
      {
        isLoading
          ? (
            <p>Loading...</p>
          )
          : (
            isError
              ? (
                <p>Error while loading.</p>
              )
              : (
                <div>
                  <TasksList tasks={tasks} />
                  <div>
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={(event) => setNewTaskName(event.target.value)}
                      placeholder="Task name"
                    />
                    <button onClick={onAddTaskClick}>
                      Add task
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
    </div>
  );
}