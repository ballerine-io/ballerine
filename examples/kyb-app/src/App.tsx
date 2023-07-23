import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
// import { KYBView } from '@app/components/organisms/KYBView';
import { queryClient } from '@app/common/utils/query-client';
import { Stepper } from '@app/components/atoms/Stepper';
import { VerticalLayout } from '@app/components/atoms/Stepper/layouts/Vertical';
import { Item } from '@app/components/atoms/Stepper/Item';
import { IStep, useStepper } from '@app/common/hooks/useStepper';

const _steps: IStep[] = [
  {
    index: 0,
    label: 'Step - 1',
    status: 'current',
  },
  {
    index: 1,
    label: 'Step - 2',
    status: 'idle',
  },
];

export const App = () => {
  const { steps, completeCurrent, prevStep, nextStep } = useStepper(_steps, {});

  return (
    <QueryClientProvider client={queryClient}>
      {/* <KYBView /> */}
      <div>
        <button type="button" onClick={prevStep}>
          prev
        </button>
        <button type="button" onClick={nextStep}>
          next
        </button>
        <button type="button" onClick={() => completeCurrent()}>
          complete
        </button>
      </div>
      <div className="h-[400px]">
        <Stepper>
          <VerticalLayout>
            {steps.map(step => (
              <Item
                key={`step-${step.index}`}
                status={step.status}
                label={step.label}
                onClick={() => completeCurrent()}
              />
            ))}
          </VerticalLayout>
        </Stepper>
      </div>
    </QueryClientProvider>
  );
};
2;
