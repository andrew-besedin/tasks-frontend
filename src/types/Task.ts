export type Task = {
  id: number;
  name: string;
  status: 0 | 1 | 2;
  fileNames: string[];
}

export const statusLabels: Record<Task["status"], string> = {
  0: "Not Started",
  1: "In Progress",
  2: "Completed",
};