import { CSSProperties } from 'react';

export interface ITheme {
  logo?: string;
  palette: Record<string, { color: string; foreground: string }>;
  elements: Record<string, string | Record<string, string>>;
  ui?: {
    poweredBy?: boolean;
  };
  signup?: {
    companyLogo: {
      imageSrc?: string;
      styles?: CSSProperties;
    };
    background: {
      imageSrc: string;
      styles?: CSSProperties;
    };
    header: {
      headingText: string;
      subheadingText?: string;
    };
    submit: {
      submitText?: string;
    };
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
