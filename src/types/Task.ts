export type Task = {
  id: number;
  name: string;
  status: 0 | 1 | 2;
  fileNames: string[];
}