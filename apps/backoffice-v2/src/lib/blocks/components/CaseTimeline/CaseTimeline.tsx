import React, { FunctionComponent, useMemo, useState } from 'react';
import { useWorkflowLogs } from '@/domains/workflow-logs/hooks/queries/useWorkflowLogs/useWorkflowLogs';
import type { TWorkflowLog } from '@/domains/workflow-logs/fetchers';

const LOG_TYPE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  STATE_TRANSITION: {
    label: 'State Changed',
    icon: '→',
    color: 'text-blue-600 bg-blue-50',
  },
  PLUGIN_INVOCATION: {
    label: 'Plugin Executed',
    icon: '⚡',
    color: 'text-purple-600 bg-purple-50',
  },
  EVENT_RECEIVED: {
    label: 'Event Received',
    icon: '📨',
    color: 'text-green-600 bg-green-50',
  },
  CONTEXT_CHANGED: {
    label: 'Context Updated',
    icon: '📝',
    color: 'text-orange-600 bg-orange-50',
  },
  ERROR: {
    label: 'Error',
    icon: '❌',
    color: 'text-red-600 bg-red-50',
  },
  INFO: {
    label: 'Info',
    icon: 'ℹ️',
    color: 'text-gray-600 bg-gray-50',
  },
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Events' },
  { value: 'STATE_TRANSITION', label: 'State Transitions' },
  { value: 'PLUGIN_INVOCATION', label: 'Plugin Calls' },
  { value: 'ERROR', label: 'Errors' },
  { value: 'EVENT_RECEIVED', label: 'Events' },
];

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  
return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDuration(current: TWorkflowLog, previous: TWorkflowLog | undefined): string | null {
  if (!previous) {
return null;
}

  const ms = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();

  if (ms < 1000) {
return `${ms}ms`;
}

  if (ms < 60_000) {
return `${(ms / 1000).toFixed(1)}s`;
}

  
return `${Math.round(ms / 60_000)}min`;
}

function getLogDescription(log: TWorkflowLog): string {
  switch (log.type) {
    case 'STATE_TRANSITION':
      return `${log.fromState ?? '?'} → ${log.toState ?? '?'}`;
    case 'PLUGIN_INVOCATION':
      return log.pluginName ?? 'unknown plugin';
    case 'EVENT_RECEIVED':
      return log.eventName ?? log.message ?? 'event';
    case 'ERROR':
      return log.message ?? 'An error occurred';
    case 'CONTEXT_CHANGED':
      return log.message ?? 'Context was updated';
    case 'INFO':
      return log.message ?? '';
    default:
      return log.message ?? log.type;
  }
}

interface CaseTimelineProps {
  workflowId: string;
}

export const CaseTimeline: FunctionComponent<CaseTimelineProps> = ({ workflowId }) => {
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const types = filter === 'all' ? undefined : [filter];

  const { data, isLoading, isError, error } = useWorkflowLogs({
    workflowId,
    page,
    pageSize: 50,
    types,
    orderBy: 'desc',
  });

  const logs = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / 50);

  // Reverse for chronological display within the page (newest first -> render top)
  const sortedLogs = useMemo(() => [...logs], [logs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-gray-400">
        Loading audit trail...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
        Failed to load audit trail: {(error as Error)?.message ?? 'Unknown error'}
      </div>
    );
  }

  if (sortedLogs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-gray-400">
        No audit events recorded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Audit Trail
          <span className="ml-2 text-xs font-normal text-gray-400">({total} events)</span>
        </h3>
        <select
          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600"
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute inset-y-0 left-[15px] w-px bg-gray-200" />

        <ul className="space-y-0">
          {sortedLogs.map((log, idx) => {
            const config = LOG_TYPE_CONFIG[log.type] ?? LOG_TYPE_CONFIG.INFO!;
            const duration = formatDuration(
              log,
              idx < sortedLogs.length - 1 ? sortedLogs[idx + 1] : undefined,
            );

            return (
              <li key={log.id} className="relative flex gap-3 pb-4 pl-9">
                {/* Dot */}
                <div
                  className={`absolute left-[10px] top-[6px] size-[12px] rounded-full border-2 border-white ${config.color}`}
                />

                <div className="flex flex-1 flex-col gap-0.5">
                  {/* Type badge + time */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${config.color}`}
                    >
                      <span>{config.icon}</span>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatTimestamp(log.createdAt)}
                    </span>
                    {duration && <span className="text-[10px] text-gray-300">+{duration}</span>}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600">{getLogDescription(log)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            className="rounded border px-2 py-0.5 text-xs text-gray-500 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            className="rounded border px-2 py-0.5 text-xs text-gray-500 disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
