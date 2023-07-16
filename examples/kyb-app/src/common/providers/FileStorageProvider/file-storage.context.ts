import { FileStorageContext } from '@app/common/providers/FileStorageProvider/types';
import { createContext } from 'react';

export const fileStorageContext = createContext({} as FileStorageContext);
