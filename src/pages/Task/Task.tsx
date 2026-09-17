import { useEffect, useState } from "react";
import { statusLabels, type Task } from "../../types/Task";
import { ApiRequests } from "../../requests/api";
import { Link, useNavigate, useParams } from "react-router";

type TaskContentProps = {
  task: Task;
  taskStatus: Task["status"];
  isStatusUploading: boolean;
  areFilesUploading: boolean;
  onStatusChange: React.ChangeEventHandler<HTMLSelectElement>;
  onStatusUpdateClick: () => void;
  onFilesInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onFilesUploadClick: () => void;
}
const TaskContent: React.FC<TaskContentProps> = ({
  task,
  taskStatus,
  areFilesUploading,
  onStatusChange,
  onStatusUpdateClick,
  isStatusUploading,
  onFilesInputChange,
  onFilesUploadClick,
}) => {

  const isUploading = !!(isStatusUploading || areFilesUploading);

  const uploadedFiles = task.fileNames;

  return (
    <div>
      <h3>{task.name}</h3>
      {isUploading
        ? (
          <p className="empty">Uploading...</p>
        )
        : (
          <div>
            <p>
              Status: <span className={`status status-${task.status}`}>
                {statusLabels[task.status]}
              </span>
            </p>
            <div className="form-row">
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
            <p>Uploaded files:</p>
            <ul>
              {uploadedFiles.length === 0
                ? <li className="empty">No files uploaded.</li>
                : uploadedFiles.map(file => (
                  <li key={file}>
                    <a href={`/uploads/${encodeURIComponent(file)}`} target="_blank">
                      {file}
                    </a>
                  </li>
                ))
              }
            </ul>
            <div className="form-row">
              <input type="file" multiple onChange={onFilesInputChange} />
              <button onClick={onFilesUploadClick}>Upload Files</button>
            </div>
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
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isStatusUploading, setIsStatusUploading] = useState(false);
  const [areFilesUploading, setAreFilesUploading] = useState(false);

  const { taskId } = useParams();

  const onStatusChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setTaskStatus(Number(event.target.value) as Task["status"]);
  }

  const onFilesInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      setFilesToUpload(null);
      return;
    }

    setFilesToUpload(files);
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

  async function onFilesUploadClick() {
    if (!filesToUpload) {
      return;
    }

    setAreFilesUploading(true);
    try {
      await ApiRequests.uploadTaskFiles(taskId || "", filesToUpload);
    } catch (err) {
      console.error(err);
    }
    setAreFilesUploading(false);
    setFilesToUpload(null);
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
    <main>
      <Link className="back-link" to="/">&larr; Back to task list</Link>
      <h1>Task</h1>
      {
        isError
          ? <p className="empty">Error while loading.</p>
          : (
            isLoading
              ? <p className="empty">Loading...</p>
              : (
                (task !== null) && (taskStatus !== null) && (
                  <TaskContent
                    onStatusChange={onStatusChange}
                    onStatusUpdateClick={onStatusUpdateClick}
                    taskStatus={taskStatus}
                    task={task}
                    isStatusUploading={isStatusUploading}
                    areFilesUploading={areFilesUploading}
                    onFilesInputChange={onFilesInputChange}
                    onFilesUploadClick={onFilesUploadClick}
                  />
                )
              )
          )
      }
    </main>
  )
}