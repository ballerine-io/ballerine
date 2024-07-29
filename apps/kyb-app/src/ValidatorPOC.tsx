//@ts-nocheck

import { Validator } from '@/components/providers/Validator';
import { pocDefinition } from '@/poc-definition';
import { FieldList } from '@/poc/FieldList';
import { SubmitButton } from '@/poc/SubmitButton';
import { TextInput } from '@/poc/TextInput';

const context = {
  items: [
    {
      subItems: [{}, { subsubItems: [{}] }],
    },
    {},
  ],
};

export const ValidatorPOC = () => {
  return (
    <Validator elements={pocDefinition} context={context}>
      <form
        onSubmit={e => {
          e.preventDefault();
          alert('submitted');
        }}
      >
        <TextInput context={context} element={pocDefinition[0]!} stack={[]} />
        <TextInput context={context} element={pocDefinition[1]!} stack={[]} />
        <div className="pl-8">
          <FieldList context={context} element={pocDefinition[2]!}>
            <div className="flex flex-col">
              <TextInput context={context} element={pocDefinition[2]!.children[0]!} stack={[0]} />
              <TextInput context={context} element={pocDefinition[2]!.children[1]!} stack={[0]} />
            </div>
            <div className="flex flex-col">
              <TextInput context={context} element={pocDefinition[2]!.children[0]!} stack={[1]} />
              <TextInput context={context} element={pocDefinition[2]!.children[1]!} stack={[1]} />
            </div>
            <div className="pl-8">
              <FieldList context={context} element={pocDefinition[2]!.children[2]!} stack={[0]}>
                <div className="flex flex-col">
                  <TextInput
                    context={context}
                    element={pocDefinition[2]!.children[2]!.children[0]!}
                    stack={[0, 0]}
                  />
                  <TextInput
                    context={context}
                    element={pocDefinition[2]!.children[2]!.children[1]!}
                    stack={[0, 0]}
                  />
                </div>
                <div className="flex flex-col">
                  <TextInput
                    context={context}
                    element={pocDefinition[2]!.children[2]!.children[0]!}
                    stack={[0, 1]}
                  />
                  <TextInput
                    context={context}
                    element={pocDefinition[2]!.children[2]!.children[1]!}
                    stack={[0, 1]}
                  />
                </div>
                <FieldList
                  context={context}
                  element={pocDefinition[2]!.children[2]!.children[2]!}
                  stack={[0, 1]}
                >
                  <div className="flex flex-col">
                    <TextInput
                      context={context}
                      element={pocDefinition[2]!.children[2]!.children[2]!.children[0]!}
                      stack={[0, 0]}
                    />
                    <TextInput
                      context={context}
                      element={pocDefinition[2]!.children[2]!.children[2]!.children[1]!}
                      stack={[0, 0]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <TextInput
                      context={context}
                      element={pocDefinition[2]!.children[2]!.children[2]!.children[0]!}
                      stack={[0, 1]}
                    />
                    <TextInput
                      context={context}
                      element={pocDefinition[2]!.children[2]!.children[2]!.children[1]!}
                      stack={[0, 1]}
                    />
                  </div>
                </FieldList>
              </FieldList>
            </div>
          </FieldList>
        </div>
        <SubmitButton />
      </form>
    </Validator>
  );
};
