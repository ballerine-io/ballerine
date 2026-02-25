import { motion } from 'framer-motion';
import { FunctionComponent, useMemo } from 'react';

import { ctw } from '../../../../common/utils/ctw/ctw';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar } from '../../../../common/components/atoms/Avatar';
import { IItemProps } from '../../../Entity/components/Case/interfaces';
import { stringToRGB } from '../../../../common/utils/string-to-rgb/string-to-rgb';
import { ApprovedSvg, RejectedSvg } from '../../../../common/components/atoms/icons';
import { UserAvatar } from '../../../../common/components/atoms/UserAvatar/UserAvatar';
import { createInitials } from '../../../../common/utils/create-initials/create-initials';
import { useEllipsesWithTitle } from '../../../../common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import dayjs from 'dayjs';
import { StateTag, TStateTag, valueOrNA } from '@ballerine/common';
import { Badge } from '@ballerine/ui';
import { tagToBadgeData } from '../../../Entity/components/Case/consts';
import { getTimePastFromNow } from '../../../../common/utils/get-time-past-from-now';

// Priority order: most critical states first
const TAG_PRIORITY: TStateTag[] = [
  StateTag.REJECTED,
  StateTag.FLAGGED,
  StateTag.FAILURE,
  StateTag.REVISION,
  StateTag.MANUAL_REVIEW,
  StateTag.PENDING_PROCESS,
  StateTag.COLLECTION_FLOW,
  StateTag.DATA_ENRICHMENT,
  StateTag.APPROVED,
  StateTag.DISMISSED,
  StateTag.RESOLVED,
  StateTag.EDIT,
];

const getActiveTag = (tags: readonly TStateTag[] | undefined): TStateTag | undefined => {
  if (!tags?.length) return undefined;

  for (const priority of TAG_PRIORITY) {
    if (tags.includes(priority)) return priority;
  }

  return tags[0];
};

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
 * @param props.entityAvatarUrl - The entity's image url to pass into {@link Avatar} and ${@Link UserAvatar}.
 * @param props.tags - Whether the case is approved or rejected.
 *
 * @constructor
 */
export const Item: FunctionComponent<IItemProps> = ({
  id,
  fullName,
  createdAt,
  assignee,
  tags,
  entityAvatarUrl,
}) => {
  const entityInitials = createInitials(fullName);
  const { ref, styles } = useEllipsesWithTitle<HTMLDivElement>();
  const { search } = useLocation();
  const rgb = useMemo(() => stringToRGB(fullName), [fullName]);
  const isApproved = tags?.includes(StateTag.APPROVED);
  const isRejected = tags?.includes(StateTag.REJECTED);
  const activeTag = useMemo(() => getActiveTag(tags), [tags]);
  const isTerminal = isApproved || isRejected;

  return (
    <li className="w-full px-2">
      <NavLink
        to={`/en/case-management/entities/${id}${search}`}
        className={({ isActive }) =>
          ctw(
            `flex min-h-[56px] items-center gap-x-3 rounded-lg px-3 py-2.5 outline-none active:bg-muted-foreground/30 active:text-foreground`,
            {
              'bg-muted': isActive,
            },
          )
        }
      >
        <div className={`indicator shrink-0`}>
          <motion.div
            key={tags?.join('-')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={ctw(`indicator-item indicator-center indicator-middle`, {
              hidden: !isRejected && !isApproved,
              'text-success': isApproved,
              'text-error': isRejected,
            })}
          >
            {/*  Early tell if a state has invalids tags and includes both `REJECTED` and `APPROVED` */}
            {isRejected && <RejectedSvg />}
            {isApproved && <ApprovedSvg />}
          </motion.div>
          <Avatar
            src={entityAvatarUrl}
            className="text-base font-semibold d-8"
            alt={`${fullName}'s avatar`}
            placeholder={entityInitials}
            style={{
              color: `rgb(${rgb})`,
              backgroundColor: `rgba(${rgb}, 0.2)`,
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div ref={ref} className="truncate text-sm font-bold" style={styles}>
            {valueOrNA(fullName)}
          </div>
          <div className={`text-xs opacity-60`}>
            {dayjs(new Date(createdAt)).format('D MMM YYYY')}
            <span className="ml-1 opacity-75">
              ({getTimePastFromNow(new Date(createdAt)).trim()})
            </span>
          </div>
        </div>
        <div className={`ml-auto flex shrink-0 items-center gap-2`}>
          {activeTag && !isTerminal && tagToBadgeData[activeTag] && (
            <Badge
              variant={
                tagToBadgeData[activeTag].variant as
                  | 'info'
                  | 'success'
                  | 'warning'
                  | 'destructive'
                  | 'violet'
              }
              className="px-1.5 py-0.5 text-[10px] font-medium"
            >
              {tagToBadgeData[activeTag].text}
            </Badge>
          )}
          {assignee && (
            <div className="flex -space-x-2 overflow-hidden">
              <UserAvatar fullName={assignee.fullName} avatarUrl={assignee.avatarUrl} />
            </div>
          )}
        </div>
      </NavLink>
    </li>
  );
};
