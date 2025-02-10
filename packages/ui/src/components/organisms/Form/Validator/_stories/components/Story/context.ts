export const initialContext = {
  firstName: 'John',
  lastName: 'Doe',
  age: 20,
  list: ['item1', 'item2', 'item3'],
  nestedList: [
    {
      value: 'value1',
    },
    {
      value: 'value2',
    },
    {
      value: 'value3',
      sublist: [{ value: 'subitem1' }, { value: 'subitem2' }, { value: 'subitem3' }],
    },
  ],
};
