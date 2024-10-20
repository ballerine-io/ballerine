export interface ITheme {
  logo?: string;
  palette: Record<string, { color: string; foreground: string }>;
  elements: Record<string, string | Record<string, string>>;
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
