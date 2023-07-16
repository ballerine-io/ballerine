export interface ITheme {
  pallete: Record<string, { color: string; foreground: string }>;
  elements: Record<string, string>;
}

export interface ISettings {
  logo: string;
  appName: string;
  theme: ITheme;
}
