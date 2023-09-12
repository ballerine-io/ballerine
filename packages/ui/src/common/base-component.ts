import {Component, createRef, RefObject,} from 'react';
import {Rule, UiEventRule} from "@utils/rule/type";

interface BaseComponentProps {
  name: string;
  rules?: Array<Rule>;
}
export class BaseComponent extends Component<BaseComponentProps> {
  ref: RefObject<HTMLElement>;

  constructor(props: any & { rules?: Array<UiEventRule> }) {
    super(props);
    this.ref = createRef();
  }

  componentDidMount() {
    const { rules, name } = this.props;
rules.forEach((rule) => {
  if (rule.name == 'event'){
    if (name === elementName) {
      const handleEvent = () => {
        onRuleTrue();
      };

      const domElement = this.ref.current;
      if (domElement) {
        domElement.addEventListener(eventType, handleEvent);
      }
    }
  }
  if (rule.name == 'jmespath') {
    domElement.addEventListener(eventType, handleEvent);
  }
})
  }
}
// if case is the orchestrator, then all the actions from the fields should be callbacked back to case.
//


