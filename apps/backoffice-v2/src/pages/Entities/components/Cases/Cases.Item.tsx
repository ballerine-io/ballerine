import { motion } from 'framer-motion';
import { FunctionComponent, useMemo } from 'react';

import { ctw } from '../../../../common/utils/ctw/ctw';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar } from '../../../../common/components/atoms/Avatar';
import { IItemProps } from '../../../Entity/components/Case/interfaces';
import { stringToRGB } from '../../../../common/utils/string-to-rgb/string-to-rgb';
import { getTimePastFromNow } from '../../../../common/utils/get-time-past-from-now';
import { ApprovedSvg, RejectedSvg } from '../../../../common/components/atoms/icons';
import { UserAvatar } from '../../../../common/components/atoms/UserAvatar/UserAvatar';
import { createInitials } from '../../../../common/utils/create-initials/create-initials';
import { useEllipsesWithTitle } from '../../../../common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import dayjs from 'dayjs';

/**
 * @description To be used by {@link Cases}, and be wrapped by {@link Cases.List}. Uses li element with default styling to display a single case's data. Navigates to the selected entity on click by setting the entity id into the path param.
 *
 * @see {@link ImageViewer.List}
 * @see {@link BallerineImage}
 * @see {@link getTimePastFromNow} - receives createdAt.
 *
 * @param props
 * @param props.id - The id of the entity, passed into the url on click -> /case-management/individuals/:id.
 * @param props.fullName - The full name of the entity.
 * @param props.createdAt - Expects an ISO date string to calculate the waiting time using {@link getTimePastFromNow}.
 * @param props.assignee - Which operator is now on the entity's case.
 * @param props.avatarUrl - The entity's image url to pass into {@link Avatar} and ${@Link UserAvatar}.
 * @param props.status - Whether the entity is approved or rejected.
 *
 * @constructor
 */
export const Item: FunctionComponent<IItemProps> = ({
  id,
  fullName,
  createdAt,
  assignee,
  avatarUrl,
  status,
}) => {
  const entityInitials = createInitials(fullName);
  const { ref, styles } = useEllipsesWithTitle<HTMLDivElement>();
  const { search } = useLocation();

  const rgb = useMemo(() => stringToRGB(fullName), [fullName]);

  return (
    <li className="h-[64px] w-full px-4">
      <NavLink
        to={`/en/case-management/entities/${id}${search}`}
        className={({ isActive }) =>
          ctw(
            `flex h-[64px] items-center gap-x-4 rounded-lg px-5 py-4 outline-none active:bg-muted-foreground/30 active:text-foreground`,
            {
              'bg-muted': isActive,
            },
          )
        }
      >
        <div className={`indicator`}>
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={ctw(`indicator-center indicator-item indicator-middle`, {
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
            className="pt-1 text-base d-8"
            alt={`${fullName}'s avatar`}
            placeholder={!avatarUrl ? entityInitials : undefined}
            style={{
              color: `rgb(${rgb})`,
              backgroundColor: `rgba(${rgb}, 0.2)`,
            }}
          />
        </div>
        <div className={`max-w-[115px]`}>
          <div ref={ref} className={`mb-[2px] text-sm font-bold`} style={styles}>
            {fullName}
          </div>
          <div className={`text-xs opacity-60`}>
            {dayjs(new Date(createdAt)).format('D MMM YYYY HH:mm')}
          </div>
        </div>
        <div className={`ml-auto mr-1 flex -space-x-2 overflow-hidden`}>
          {!!assignee.id && <UserAvatar fullName={assignee.fullName} avatarUrl={avatarUrl} />}
        </div>
      </NavLink>
    </li>
  );
};
