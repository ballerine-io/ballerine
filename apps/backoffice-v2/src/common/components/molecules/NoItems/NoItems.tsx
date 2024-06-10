import { FunctionComponent } from 'react';

export const NoItems: FunctionComponent<{
  /**
   * i.e. "products", "cases"
   */
  resource: string;
  /**
   * i.e. "system", "queue"
   */
  resourceMissingFrom: string;
  /**
   * What the user can do to resolve the issue
   */
  suggestions: string[];
  /**
   * An SVG to display above the title
   */
  illustration: JSX.Element;
}> = ({ resource, resourceMissingFrom, suggestions, illustration }) => {
  return (
    <div className="flex items-center justify-center p-4 pb-64">
      <div className="inline-flex flex-col  items-start gap-4 rounded-md border-[1px] border-[#CBD5E1] p-6">
        <div className="flex w-[464px] items-center justify-center">{illustration}</div>

        <div className="flex w-[464px] flex-col items-start gap-2">
          <h2 className="text-lg font-[600]">No {resource} found</h2>

          <div className="text-sm leading-[20px]">
            <p className="font-[400]">
              It looks like there aren&apos;t any {resource} in your {resourceMissingFrom} right
              now.
            </p>

            <div className="mt-[20px] flex flex-col">
              <span className="font-[700]">What can you do now?</span>

              <ul className="list-disc pl-6 pr-2">
                {suggestions?.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
