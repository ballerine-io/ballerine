import { IRendererProps } from '@/components/organisms/Renderer/types';
import { createRenderedElementKey } from '@/components/organisms/Renderer/utils/create-rendered-element-key';

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

        if (!Component) throw new Error(`Component ${element.element} not found in schema.`);

        if (element.children) {
          return (
            <Component
              key={createRenderedElementKey(element, stack)}
              definition={element}
              stack={stack}
              options={element.options}
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
            definition={element}
            key={createRenderedElementKey(element, stack)}
            stack={stack}
            options={element.options}
          />
        );
      })}
    </>
  );
};
