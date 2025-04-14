import { FunctionComponent } from 'react';

// This is a placeholder component as Botpress has been removed
const Chatbot: FunctionComponent<{
  isWebchatOpen: boolean;
  toggleIsWebchatOpen: () => void;
  botpressClientId: string;
}> = () => {
  // Return null instead of rendering the chatbot
  return null;
};

export default Chatbot;
