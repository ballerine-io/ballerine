import { fileStorageContext } from '@app/common/providers/FileStorageProvider/file-storage.context';
import { useContext } from 'react';

export const useFileStorage = () => useContext(fileStorageContext);
