import { CSSProperties } from 'react';

export interface ITheme {
  logo?: string;
  palette: Record<string, { color: string; foreground: string }>;
  elements: Record<string, string | Record<string, string>>;
  ui?: {
    poweredBy?: boolean;
    contactUsText?: string;
  };
  signup?: {
    showJobTitle?: boolean;
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
      containerStyles?: CSSProperties;
    };
    form: {
      containerStyles?: CSSProperties;
      submitText?: string;
    };
    footer: {
      rawHtml?: string;
      styles?: CSSProperties;
    };
  };
  settings: Partial<ISettings>;
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
