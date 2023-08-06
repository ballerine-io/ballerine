import { snapshotContext } from '@app/common/providers/SnapshotProvider/snapshot.context';
import { useContext } from 'react';

export const useSnapshot = () => useContext(snapshotContext);
