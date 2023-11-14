export class DocumentValueDestinationParser {
  constructor(private readonly valueDestination: string) {}

  extractRootPath(): string | null {
    const rootPathRegexp = /(documents|.+documents).+/g;
    const match = rootPathRegexp.exec(this.valueDestination);

    if (!match) return null;

    return match[1];
  }

  extractPagePath(): string | null {
    const pagePathRegexp = /documents\[\d+\]\.(.*?pages\[\d+\])/g;
    const match = pagePathRegexp.exec(this.valueDestination);

    if (!match) return null;

    return match[1];
  }

  extractFileIdPath(): string | null {
    const fileIdRegex = /pages(?:\[\d+\])?(?:\.(.+)|(.+))/g;
    const match = fileIdRegex.exec(this.valueDestination);

    if (!match || !match[1]) return null;

    return match[1];
  }
}
