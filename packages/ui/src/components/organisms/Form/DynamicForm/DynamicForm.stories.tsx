import { DynamicFormV2 } from './DynamicForm';
import { FileUploadShowcaseComponent } from './_stories/FileUploadShowcase';
import { InputsShowcaseComponent } from './_stories/InputsShowcase';

export default {
  component: DynamicFormV2,
};

export const InputsShowcase = {
  render: () => <InputsShowcaseComponent />,
};

export const FileUploadShowcase = {
  render: () => <FileUploadShowcaseComponent />,
};
