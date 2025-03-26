import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { WorkflowLog, fetchWorkflowLogs } from '@/domains/workflows/api/workflow-logs';
import { WorkflowLogGraph } from './WorkflowLogGraph';
import { Loader2, Search, Info, ArrowDown, ArrowUp } from 'lucide-react';
import { JSONTree } from 'react-json-tree';
import { Input } from '@/components/atoms/Input';

interface WorkflowLogsModalProps {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Type for column sorting
type SortField = 'id' | 'type' | 'createdAt';
type SortDirection = 'asc' | 'desc';

// Highlight search matches
const highlightText = (text: string, searchQuery: string) => {
  if (!searchQuery) return text;

  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === searchQuery.toLowerCase() ? (
      <mark key={i} className="rounded bg-yellow-200 px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

export const WorkflowLogsModal = ({ workflowId, isOpen, onClose }: WorkflowLogsModalProps) => {
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const pageSize = 100;

  const fetchLogs = useCallback(async () => {
    if (!workflowId) return;

    try {
      setIsLoading(true);
      const result = await fetchWorkflowLogs(workflowId, { page, pageSize });
      setLogs(prevLogs => [...prevLogs, ...result.data]);
      setHasMore(result.data.length === pageSize);
      setError(null);
    } catch (err) {
      setError('Failed to fetch workflow logs');
      console.error('Error fetching workflow logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workflowId, page, pageSize]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setPage(1);
      setHasMore(true);
      setError(null);
      setSearchQuery('');
      setSortField('id');
      setSortDirection('asc');
    }
  }, [isOpen]);

  // Fetch logs when modal opens or page changes
  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, page, fetchLogs]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort logs
  const filteredAndSortedLogs = logs
    .filter(log => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        log.type.toLowerCase().includes(searchLower) ||
        log.message.toLowerCase().includes(searchLower) ||
        (log.eventName && log.eventName.toLowerCase().includes(searchLower)) ||
        (log.pluginName && log.pluginName.toLowerCase().includes(searchLower)) ||
        (log.fromState && log.fromState.toLowerCase().includes(searchLower)) ||
        (log.toState && log.toState.toLowerCase().includes(searchLower)) ||
        String(log.id).includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortField === 'id') {
        comparison = a.id - b.id;
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const theme = {
    scheme: 'monokai',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="!sm:max-w-[95vw] flex h-[90vh] max-h-[95vh] min-h-[90vh] w-[95vw] !max-w-[95vw] flex-col">
        <DialogHeader>
          <DialogTitle>Workflow Logs - {workflowId}</DialogTitle>
        </DialogHeader>

        {isLoading && logs.length === 0 ? (
          <div className="flex flex-grow items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : logs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No logs found for this workflow</div>
        ) : (
          <Tabs defaultValue="visualize" className="flex h-full flex-grow flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
              <TabsTrigger value="raw">Raw Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="visualize" className="h-full flex-grow overflow-hidden">
              <div className="h-full w-full" style={{ height: 'calc(100% - 10px)' }}>
                <WorkflowLogGraph logs={logs} />
              </div>
            </TabsContent>

            <TabsContent value="raw" className="flex-grow overflow-auto">
              <div className="flex h-full flex-col p-2">
                {/* Search and sort bar */}
                <div className="sticky top-0 z-20 mb-2 flex items-center gap-4 border-b bg-white p-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSort('id')}
                      className={sortField === 'id' ? 'bg-gray-100' : ''}
                    >
                      ID {renderSortIndicator('id')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSort('type')}
                      className={sortField === 'type' ? 'bg-gray-100' : ''}
                    >
                      Type {renderSortIndicator('type')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSort('createdAt')}
                      className={sortField === 'createdAt' ? 'bg-gray-100' : ''}
                    >
                      Time {renderSortIndicator('createdAt')}
                    </Button>
                  </div>
                </div>

                {/* Logs table */}
                <div className="relative flex-grow overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="sticky top-0 z-10 bg-gray-50">
                        <th className="w-[60px] px-2 py-2 text-left font-medium text-gray-500">
                          ID
                        </th>
                        <th className="w-[100px] px-2 py-2 text-left font-medium text-gray-500">
                          Type
                        </th>
                        <th className="w-[140px] px-2 py-2 text-left font-medium text-gray-500">
                          Time
                        </th>
                        <th className="px-2 py-2 text-left font-medium text-gray-500">
                          Message / Details
                        </th>
                        <th className="w-[60px] px-2 py-2 text-center font-medium text-gray-500">
                          Info
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedLogs.map(log => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="px-2 py-2 font-mono text-xs">{log.id}</td>
                          <td className="px-2 py-2">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium
                                ${
                                  log.type === 'STATE_TRANSITION'
                                    ? 'bg-orange-100 text-orange-800'
                                    : log.type === 'EVENT_RECEIVED'
                                    ? 'bg-green-100 text-green-800'
                                    : log.type === 'PLUGIN_EXECUTED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {highlightText(log.type, searchQuery)}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="px-2 py-2">
                            <div className="text-sm">{highlightText(log.message, searchQuery)}</div>
                            {/* State transition details */}
                            {log.fromState && log.toState && (
                              <div className="mt-1 flex items-center gap-1 text-xs">
                                <span className="rounded bg-blue-50 px-1 text-blue-700">
                                  {highlightText(log.fromState, searchQuery)}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="rounded bg-green-50 px-1 text-green-700">
                                  {highlightText(log.toState, searchQuery)}
                                </span>
                              </div>
                            )}
                            {/* Event details */}
                            {log.eventName && (
                              <div className="mt-1 flex items-center text-xs">
                                <span className="mr-1 font-medium">Event:</span>
                                <span className="rounded bg-purple-50 px-1 text-purple-700">
                                  {highlightText(log.eventName, searchQuery)}
                                </span>
                              </div>
                            )}
                            {/* Plugin details */}
                            {log.pluginName && (
                              <div className="mt-1 flex items-center text-xs">
                                <span className="mr-1 font-medium">Plugin:</span>
                                <span className="rounded bg-yellow-50 px-1 text-yellow-700">
                                  {highlightText(log.pluginName, searchQuery)}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {Object.keys(log.metadata || {}).length > 0 && (
                              <div className="group relative">
                                <Info className="h-4 w-4 cursor-pointer text-gray-400 group-hover:text-blue-500" />
                                <div className="absolute right-0 z-30 mt-1 hidden w-80 rounded-md border bg-white p-2 shadow-lg group-hover:block">
                                  <div className="mb-1 text-left text-xs font-medium">
                                    Metadata:
                                  </div>
                                  <div className="max-h-60 overflow-auto rounded">
                                    <JSONTree
                                      data={log.metadata}
                                      theme={theme}
                                      invertTheme={true}
                                      hideRoot={true}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* No results message */}
                  {filteredAndSortedLogs.length === 0 && searchQuery && (
                    <div className="p-4 text-center text-gray-500">
                      No logs match your search query.
                    </div>
                  )}

                  {/* Load more button */}
                  {hasMore && !searchQuery && (
                    <div className="flex justify-center p-4">
                      <Button onClick={loadMore} disabled={isLoading} variant="outline">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowLogsModal;
