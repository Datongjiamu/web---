import React from 'react';
import axios from 'axios';

import IconButton from '@material-ui/core/IconButton';
import { ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';

import { apiUrl, TimeWait } from './Common';

interface UploadListProps {
  file_name: string;
  file_id: number;
  task_id: number;
  fetchUploadList: () => Promise<void>;
  info: (message: string, type: 'error' | 'success') => void;
}

export const UploadItem: React.FC<UploadListProps> = ({ file_name, file_id, task_id, fetchUploadList, info }) => {
  const _downloadFile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/download`, {
        params: {
          file_name: file_name,
          project_id: task_id
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      info('操作成功', 'success');
      await TimeWait(750);
      await fetchUploadList();
    } catch (err) {
      console.error(err);
      info('下载失败!', 'error');
    }
  };

  const _deleteFile = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/task/upload`, { params: { file_id: file_id } });
      if (response.data.success) {
        info('操作成功', 'success');
        await TimeWait(750);
        await fetchUploadList();
      } else {
        info('操作失败!', 'error');
      }
    } catch (err) {
      console.error(err);
      info('操作失败!', 'error');
    }
  };

  return (
    <ListItem>
      <ListItemText primary={file_name} />
      <IconButton edge='end' size={'small'} aria-label='download' onClick={_downloadFile}>
        <FileDownloadIcon className='text-green-500' />
      </IconButton>
      <div className='px-1'></div>
      <IconButton edge='end' size={'small'} aria-label='delete' onClick={_deleteFile}>
        <DeleteIcon className='text-red-400' />
      </IconButton>
    </ListItem>
  );
};
