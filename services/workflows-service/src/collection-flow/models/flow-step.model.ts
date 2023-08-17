import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class FlowStepModel {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;

  @IsObject()
  @IsNotEmpty()
  uiSchema!: object;

  @IsObject()
  @IsNotEmpty()
  formSchema!: object;

  @IsObject()
  defaultData!: object;
}
