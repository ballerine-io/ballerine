import { IRendererProps } from './types';
import { createRenderedElementKey } from './utils/create-rendered-element-key';

export const Renderer: React.FunctionComponent<IRendererProps & { stack?: number[] }> = ({
  schema,
  elements,
  stack,
}) => {
  return (
    <>
      {elements.map((element, index) => {
        const Component = schema[element.element];

        if (!element.element)
          throw new Error(`Element name is missing in definition ${JSON.stringify(element)}`);

        if (!Component) {
          console.warn(`Component ${element.element} not found in schema.`);

          return null;
        }

        if (element.children) {
          return (
            <Component
              key={createRenderedElementKey(element, stack)}
              element={element}
              stack={stack}
              options={element.options as unknown as any}
            >
              <Renderer
                schema={schema}
                elements={element.children}
                stack={[...(stack || []), index]}
              />
            </Component>
          );
        }

        return (
          <Component
            element={element}
            key={createRenderedElementKey(element, stack)}
            stack={stack}
            options={element.options as unknown as any}
          />
        );
      })}
    </>
  );
};
