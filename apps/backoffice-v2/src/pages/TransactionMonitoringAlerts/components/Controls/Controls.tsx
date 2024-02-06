import { Button } from '@/common/components/atoms/Button/Button';

export const Controls = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h2 className="text-2xl font-bold">Alerts</h2>
      <div className="flex flex-row gap-4">
        <Button variant="outline">Assign</Button>
        <Button variant="outline">Decision</Button>
      </div>
    </div>
  );
};
