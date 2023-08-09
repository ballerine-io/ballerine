import { request } from '@app/common/utils/request';
import { UploadFileDto, UploadFileResult } from '@app/domains/storage/types';

export const uploadFile = async (dto: UploadFileDto): Promise<UploadFileResult> => {
  const formData = new FormData();
  formData.append('file', dto.file);

  const { id: fileId } = await request
    .post('external/storage', {
      body: formData,
    })
    .json<{
      id: string;
    }>();

  return await request.get(`external/storage/${fileId}`).json<UploadFileResult>();
};
