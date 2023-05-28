export interface IOpacityColor {
  color: string;
  opacity: number;
}

interface ICSSPropertiesAll {
  margin: string;
  padding: string;
  'font-family': string;
  'font-size': string;
  'font-weight': number;
  'text-align': string;
  'line-height': string;
  'vertical-align': string;
  'box-shadow': string;
  '-webkit-box-shadow': string;
  width: string;
  height: string;
  background?: string | IOpacityColor;
  color?: string;
  'border-radius'?: string;
  border: string;
  display: string;
  cursor: string;
  'align-items': string;
  'justify-content': string;
  'flex-direction': string;
  position: string;
  top: string;
  bottom: string;
  left: string;
  right: string;
  'align-self': string;
  hover: ICSSProperties;
  active: ICSSProperties;
  fill: string;
  'flex-grow': number | string;
  'background-position-y': string;
  outline: string;
  'z-index': string;
}

export type ICSSProperties = Partial<ICSSPropertiesAll>;
