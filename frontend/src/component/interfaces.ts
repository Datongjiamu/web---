export interface ProjectItemData {
  id: number;
  name: string;
  owner: number;
  type: number;
}

export interface TaskItemData {
  id: number;
  subject: string;
  creator: string;
  create_date: string;
  start_date: string;
  end_date: string;
  description: string;
  type: number;
  project_id: number;
}

export interface UploadFileData {
  id: number;
  file_name: string;
}

export interface CommentItemData {
  id: number;
  username: string;
  message: string;
  timestamp: number;
  project_id: number;
}
