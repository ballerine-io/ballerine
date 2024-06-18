import React, { FunctionComponent } from 'react';

export const SubtitleAndParagraph: FunctionComponent<{
  subtitle: string;
  paragraph: string;
}> = ({ subtitle, paragraph }) => {
  return (
    <div>
      <h4 className={'mb-4 font-bold'}>{subtitle}</h4>
      <p>{paragraph}</p>
    </div>
  );
};
