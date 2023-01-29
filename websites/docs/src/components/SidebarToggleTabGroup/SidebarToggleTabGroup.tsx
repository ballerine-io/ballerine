import { createSignal } from 'solid-js';
import { Tabs, TTab } from '../../types';
import './TabGroup.css';

export interface Props {
  defaultActiveTab: TTab;
  labels: Record<TTab, string>;
}

const SidebarToggleTabGroup = ({ defaultActiveTab, labels }: Props) => {
  const [activeTab, setActiveTab] = createSignal(defaultActiveTab);

  const toggleType = (type: TTab) => {
    // Remove active class from all nav groups
    const activeNavGroups = document.querySelectorAll(`li.nav-group`);

    activeNavGroups.forEach(el => el.classList.remove(`active`));

    // Add active class to the nav group that matches the active tab
    const inactiveNavGroup = document.querySelectorAll(`li.nav-group.${type}`);

    inactiveNavGroup.forEach(el => el.classList.add(`active`));

    // Set the active tab
    setActiveTab(type);
  };
  return (
    <div class="TabGroup">
      {Tabs.map(type => (
        <button class={activeTab() === type ? `active` : ``} onClick={() => toggleType(type)}>
          {labels[type]}
        </button>
      ))}
    </div>
  );
};

export default SidebarToggleTabGroup;
