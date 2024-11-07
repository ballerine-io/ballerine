export interface ITheme {
  logo?: string;
  palette: Record<string, { color: string; foreground: string }>;
  elements: Record<string, string | Record<string, string>>;
  ui?: {
    poweredBy?: boolean;
  };
}

export interface ISettings {
  logo: string;
  appName: string;
  title: string;
  subtitle: string;
  contactInformation: string;
  leaveText: string;
  theme: ITheme;
}
