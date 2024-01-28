import { request } from '@/common/utils/request';
import { IFile, UploadFileDto } from '@/domains/storage/types';

export const uploadFile = async (dto: UploadFileDto): Promise<{ id: string }> => {
  const formData = new FormData();
  formData.append('file', dto.file);

  const { id: fileId } = await request
    .post('collection-flow/files', {
      body: formData,
    })
    .json<{
      id: string;
    }>();

  return {
    id: fileId,
  };
};

export const fetchFile = async (fileId: string): Promise<IFile> => {
  const result = await request.get(`collection-flow/files/${fileId}`);

  return result.json<IFile>();
};
