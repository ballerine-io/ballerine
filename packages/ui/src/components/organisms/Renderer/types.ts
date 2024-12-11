export interface IRendererElement {
  id: string;
  element: string;
  children?: IRendererElement[];
  options?: Record<string, unknown>;
}

export type IRendererComponent<
  TDefinition extends IRendererElement,
  TProps extends Record<string, unknown>,
  TBaseProps = {
    stack?: number[];
    children?: React.ReactNode | React.ReactNode[];
    definition: TDefinition;
  },
> = React.FunctionComponent<TProps & TBaseProps>;

export type TRendererElementName = string;

export type TRendererSchema = Record<
  TRendererElementName,
  IRendererComponent<IRendererElement, Record<string, unknown>>
>;

export interface IRendererProps {
  elements: IRendererElement[];
  schema: TRendererSchema;
}
