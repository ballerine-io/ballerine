import React, { FunctionComponent, useState, useCallback, useRef, useEffect } from 'react';
import { Badge } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';

const PRESET_LABELS = [
  { value: 'HIGH_RISK', color: 'bg-red-100 text-red-700' },
  { value: 'VIP', color: 'bg-amber-100 text-amber-700' },
  { value: 'RETURNING_CUSTOMER', color: 'bg-green-100 text-green-700' },
  { value: 'FLAGGED_FOR_REVIEW', color: 'bg-orange-100 text-orange-700' },
  { value: 'FIRST_TIME', color: 'bg-blue-100 text-blue-700' },
  { value: 'FRAUD_SUSPECTED', color: 'bg-red-200 text-red-800' },
] as const;

function getLabelColor(label: string): string {
  const preset = PRESET_LABELS.find(p => p.value === label);
  return preset?.color ?? 'bg-gray-100 text-gray-600';
}

interface CustomLabelsProps {
  labels: string[];
  onAdd: (label: string) => void;
  onRemove: (label: string) => void;
  isDisabled?: boolean;
}

export const CustomLabels: FunctionComponent<CustomLabelsProps> = ({
  labels,
  onAdd,
  onRemove,
  isDisabled = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const availablePresets = PRESET_LABELS.filter(p => !labels.includes(p.value));

  const handleAddPreset = useCallback(
    (label: string) => {
      onAdd(label);
      setIsDropdownOpen(false);
    },
    [onAdd],
  );

  return (
    <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
      {/* Existing labels */}
      {labels.map(label => (
        <Badge
          key={label}
          className={ctw(
            'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium',
            getLabelColor(label),
          )}
        >
          {label.replace(/_/g, ' ')}
          {!isDisabled && (
            <button
              className="ml-0.5 text-current opacity-60 hover:opacity-100"
              onClick={() => onRemove(label)}
              title={`Remove ${label}`}
            >
              ×
            </button>
          )}
        </Badge>
      ))}

      {/* Add button */}
      {!isDisabled && (
        <button
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-gray-300 text-[10px] text-gray-400 hover:border-gray-400 hover:text-gray-500"
          onClick={() => setIsDropdownOpen(prev => !prev)}
          title="Add label"
        >
          +
        </button>
      )}

      {/* Dropdown */}
      {isDropdownOpen && availablePresets.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-1 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {availablePresets.map(preset => (
            <button
              key={preset.value}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50"
              onClick={() => handleAddPreset(preset.value)}
            >
              <span className={ctw('inline-block h-2 w-2 rounded-full', preset.color)} />
              {preset.value.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
