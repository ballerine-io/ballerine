import { actionsHandlerContext } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/actions-handler.context';
import { useContext } from 'react';

export const useActionsHandlerContext = () => useContext(actionsHandlerContext);
