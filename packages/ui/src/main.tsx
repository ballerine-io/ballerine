import ReactDOM from 'react-dom/client';
import { InputsShowcaseComponent } from './components/organisms/Form/DynamicForm/_stories/InputsShowcase';
import './global.css';

const App = () => {
  return <InputsShowcaseComponent />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
