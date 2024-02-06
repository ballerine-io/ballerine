import { MagnifyingGlassSvg } from '@/common/components/atoms/icons';
import { FilterContainer } from '@/pages/TransactionMonitoringAlerts/components/Filters/FilterContainer';
import { Label } from '@/pages/TransactionMonitoringAlerts/components/Filters/FilterContainer.Label';
import { Title } from '@/pages/TransactionMonitoringAlerts/components/Filters/FilterContainer.Title';
import { DropdownInput } from '@ballerine/ui';

export const Filters = () => {
  return (
    <div className="flex flex-row gap-6">
      <FilterContainer>
        <Title>Search by name</Title>
        <label className="input-group flex h-[32px] items-center rounded-[44px] border">
          <div className={`btn btn-square btn-ghost pointer-events-none`}>
            <MagnifyingGlassSvg className={`!d-4`} />
          </div>
          <input
            type="text"
            className="input input-xs -ml-3 h-[18px] w-full !border-0 pl-0 text-xs !outline-none !ring-0 placeholder:text-base-content"
            placeholder={`Search by user info`}
          />
        </label>
      </FilterContainer>
      <FilterContainer>
        <Title>Filters</Title>
        <Label>Assigneee</Label>
        <div className="w-[185px]">
          <DropdownInput
            name=""
            options={[]}
            onChange={() => {}}
            placeholdersParams={{ placeholder: 'All' }}
            props={{
              trigger: {
                className: 'h-[32px]',
              },
            }}
          />
        </div>
      </FilterContainer>
      <FilterContainer>
        <Title></Title>
        <Label>Alert Type</Label>
        <div className="w-[185px]">
          <DropdownInput
            name=""
            options={[]}
            onChange={() => {}}
            placeholdersParams={{ placeholder: 'All' }}
            props={{
              trigger: {
                className: 'h-[32px]',
              },
            }}
          />
        </div>
      </FilterContainer>
      <FilterContainer>
        <Title></Title>
        <Label>Alert Status</Label>
        <div className="w-[185px]">
          <DropdownInput
            name=""
            options={[]}
            onChange={() => {}}
            placeholdersParams={{ placeholder: 'New' }}
            props={{
              trigger: {
                className: 'h-[32px]',
              },
            }}
          />
        </div>
      </FilterContainer>
    </div>
  );
};
