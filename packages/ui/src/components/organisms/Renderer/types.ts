export interface IRendererElement {
  id: string;
  element: string;
  children?: IRendererElement[];
  options?: any;
}

export interface IRendererComponent<
  TDefinition extends IRendererElement,
  TProps extends object,
  TOptions extends object = {},
  TBaseProps = {
    stack?: number[];
    children?: React.ReactNode | React.ReactNode[];
    options?: TOptions;
    definition: TDefinition;
  },
> extends React.FunctionComponent<TProps & TBaseProps> {}

export type TRendererElementName = string;

export type TRendererSchema = Record<
  TRendererElementName,
  IRendererComponent<IRendererElement, any>
>;

export interface IRendererProps {
  elements: IRendererElement[];
  schema: TRendererSchema;
}
