import { TBaseFields } from '@ballerine/ui';
import { CountryPickerField } from './components/form/CountryPicker';
import { IndustriesPickerField } from './components/form/IndustriesPicker';
import { LocalePickerField } from './components/form/LocalePicker';
import { MCCPickerField } from './components/form/MCCPicker';
import { NationalityPickerField } from './components/form/NationalityPicker';
import { StatePickerField } from './components/form/StatePicker';
import { ColumnElement } from './components/ui/ColumnElement';
import { DescriptionElement } from './components/ui/DescriptionElement';
import { DividerElement } from './components/ui/DividerElement';
import { H1Element } from './components/ui/H1Element';
import { H3Element } from './components/ui/H3Element';
import { H4Element } from './components/ui/H4Element';
import { ROW_UI_ELEMENT_TYPE, RowElement } from './components/ui/RowElement';
import {
  COLUMN_UI_ELEMENT_TYPE,
  COUNTRY_PICKER_FIELD_ELEMENT_TYPE,
  DESCRIPTION_UI_ELEMENT_TYPE,
  DIVIDER_UI_ELEMENT_TYPE,
  H1_UI_ELEMENT_TYPE,
  H3_UI_ELEMENT_TYPE,
  H4_UI_ELEMENT_TYPE,
  INDUSTRIES_PICKER_FIELD_ELEMENT_TYPE,
  LOCALE_PICKER_FIELD_ELEMENT_TYPE,
  MCC_PICKER_FIELD_ELEMENT_TYPE,
  NATIONALITY_PICKER_FIELD_ELEMENT_TYPE,
  STATE_PICKER_FIELD_ELEMENT_TYPE,
} from '@ballerine/common';

const fields = {
  [COUNTRY_PICKER_FIELD_ELEMENT_TYPE]: CountryPickerField,
  [INDUSTRIES_PICKER_FIELD_ELEMENT_TYPE]: IndustriesPickerField,
  [LOCALE_PICKER_FIELD_ELEMENT_TYPE]: LocalePickerField,
  [MCC_PICKER_FIELD_ELEMENT_TYPE]: MCCPickerField,
  [NATIONALITY_PICKER_FIELD_ELEMENT_TYPE]: NationalityPickerField,
  [STATE_PICKER_FIELD_ELEMENT_TYPE]: StatePickerField,
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
