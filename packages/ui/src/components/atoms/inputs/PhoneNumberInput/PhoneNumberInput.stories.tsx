import { PhoneNumberInput } from './PhoneNumberInput';

export default {
  component: PhoneNumberInput,
};

export const Default = { render: PhoneNumberInput };

export const WithSearch = { render: () => <PhoneNumberInput enableSearch /> };

export const WithInitialCountry = { render: () => <PhoneNumberInput country={'us'} /> };

export const AllTogether = { render: () => <PhoneNumberInput enableSearch country="us" /> };
