import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import { getTimePastFromNow } from '../../../utils/get-time-past-from-now';
import { Avatar } from 'components/atoms/Avatar';
import { ApprovedSvg, RejectedSvg } from 'components/atoms/icons';
import { IItemProps } from 'components/organisms/Subject/interfaces';
import { Link } from '@tanstack/react-router';
import { createInitials } from '../../../utils/create-initials/create-initials';
import { ctw } from '../../../utils/ctw/ctw';
import { useEllipsesWithTitle } from 'hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { SubjectsList } from './SubjectsList';

/**
 * @description To be used by {@link SubjectsList}, and be wrapped by {@link SubjectsList.List}. Uses an li element with default styling to display a single subject's data. Navigates to the selected entity on click by setting the entity id into the path param.
 *
 * @see {@link ImageViewer.List}
 * @see {@link BallerineImage}
 * @see {@link getTimePastFromNow} - receives createdAt.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the url on click -> /case-management/individuals/:id.
 * @param props.fullName - The full name of the entity.
 * @param props.createdAt - Expects an ISO date string to calculate the waiting time using {@link getTimePastFromNow}.
 * @param props.operators - Which operators are now on the entity's case.
 * @param props.status - Whether the entity is approved or rejected.
 *
 * @constructor
 */
export const Item: FunctionComponent<IItemProps> = ({
  id,
  fullName,
  createdAt,
  assigneeId,
  assigneeFullName,
  avatarUrl,
  status,
}) => {
  const timePast = getTimePastFromNow(new Date(createdAt));
  const assigneeInitials = createInitials(assigneeFullName);
  const entityInitials = createInitials(fullName);
  const { ref, styles } = useEllipsesWithTitle();

  return (
    <li className={`rounded-md p-2 px-1`}>
      <Link
        to={'/$locale/case-management/individuals/$entityId'}
        params={{
          entityId: id,
          locale: 'en',
        }}
        preload={'intent'}
        activeProps={{
          className: `bg-muted`,
        }}
        className={`flex items-center gap-x-4 rounded-md outline-none`}
      >
        <div className={`indicator`}>
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={ctw(`indicator-center indicator-middle indicator-item`, {
              hidden: status !== 'REJECTED' && status !== 'APPROVED',
              'text-success': status === 'APPROVED',
              'text-error': status === 'REJECTED',
            })}
          >
            {status === 'REJECTED' && <RejectedSvg />}
            {status === 'APPROVED' && <ApprovedSvg />}
          </motion.div>
          <Avatar
            src={avatarUrl}
            placeholder={!avatarUrl ? entityInitials : undefined}
            alt={`${fullName}'s avatar`}
            className={`pt-1.5 d-9`}
          />
        </div>
        <div>
          <div className={'w-[15ch]'}>
            <span ref={ref} style={styles}>
              {fullName}
            </span>
          </div>
          <div className={`text-sm`}>Waiting {timePast}</div>
        </div>
        <div className={`ml-auto mr-1 flex -space-x-2 overflow-hidden`}>
          {!!assigneeId && (
            <Avatar
              key={assigneeId}
              // src={assignedTo}
              src={''}
              placeholder={assigneeInitials}
              alt={`assigned to: ${assigneeFullName}`}
              className={`h-6 w-6 pt-1 text-[0.6rem]`}
            />
          )}
        </div>
      </Link>
    </li>
  );
};
