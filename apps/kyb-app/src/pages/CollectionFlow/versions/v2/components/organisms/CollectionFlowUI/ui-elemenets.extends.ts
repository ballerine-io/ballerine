import { TBaseFields } from '@ballerine/ui';
import { COUNTRY_PICKER_FIELD_TYPE, CountryPickerField } from './components/form/CountryPicker';
import {
  INDUSTRIES_PICKER_FIELD_TYPE,
  IndustriesPickerField,
} from './components/form/IndustriesPicker';
import { LOCALE_PICKER_FIELD_TYPE, LocalePickerField } from './components/form/LocalePicker';
import { MCC_PICKER_FIELD_TYPE, MCCPickerField } from './components/form/MCCPicker';
import {
  NATIONALITY_PICKER_FIELD_TYPE,
  NationalityPickerField,
} from './components/form/NationalityPicker';
import { STATE_PICKER_FIELD_TYPE, StatePickerField } from './components/form/StatePicker';
import { COLUMN_UI_ELEMENT_TYPE, ColumnElement } from './components/ui/ColumnElement';
import {
  DESCRIPTION_UI_ELEMENT_TYPE,
  DescriptionElement,
} from './components/ui/DescriptionElement';
import { DIVIDER_UI_ELEMENT_TYPE, DividerElement } from './components/ui/DividerElement';
import { H1_UI_ELEMENT_TYPE, H1Element } from './components/ui/H1Element';
import { H3_UI_ELEMENT_TYPE, H3Element } from './components/ui/H3Element';
import { H4_UI_ELEMENT_TYPE, H4Element } from './components/ui/H4Element';
import { ROW_UI_ELEMENT_TYPE, RowElement } from './components/ui/RowElement';

const fields = {
  [COUNTRY_PICKER_FIELD_TYPE]: CountryPickerField,
  [INDUSTRIES_PICKER_FIELD_TYPE]: IndustriesPickerField,
  [LOCALE_PICKER_FIELD_TYPE]: LocalePickerField,
  [MCC_PICKER_FIELD_TYPE]: MCCPickerField,
  [NATIONALITY_PICKER_FIELD_TYPE]: NationalityPickerField,
  [STATE_PICKER_FIELD_TYPE]: StatePickerField,
};

const uiElements = {
  [H1_UI_ELEMENT_TYPE]: H1Element,
  [H3_UI_ELEMENT_TYPE]: H3Element,
  [H4_UI_ELEMENT_TYPE]: H4Element,
  [DESCRIPTION_UI_ELEMENT_TYPE]: DescriptionElement,
  [DIVIDER_UI_ELEMENT_TYPE]: DividerElement,
  [COLUMN_UI_ELEMENT_TYPE]: ColumnElement,
  [ROW_UI_ELEMENT_TYPE]: RowElement,
};

export const formElementsExtends = {
  ...fields,
  ...uiElements,
};

export type TCollectionFlowElements = keyof typeof formElementsExtends;

export type TElements = TCollectionFlowElements | TBaseFields;
