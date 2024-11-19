import { useContext } from 'react';
import { DependenciesContext } from '../../dependencies-context';

export const useDependencies = () => useContext(DependenciesContext);
