import { getClient, Webchat, WebchatProvider } from '@botpress/webchat';
import { buildTheme } from '@botpress/webchat-generator';
import { useEffect } from 'react';
import { useAuthenticatedUserQuery } from '../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

// declare const themeNames: readonly ["prism", "galaxy", "dusk", "eggplant", "dawn", "midnight"];
const { theme, style } = buildTheme({
  themeName: 'galaxy',
  themeColor: 'blue',
});

const clientId = '8f29c89d-ec0e-494d-b18d-6c3590b28be6';

const Chatbot = ({
  isWebchatOpen,
  toggleIsWebchatOpen,
}: {
  isWebchatOpen: boolean;
  toggleIsWebchatOpen: () => void;
}) => {
  const client = getClient({ clientId });
  const { data: session } = useAuthenticatedUserQuery();

  useEffect(() => {
    if (session?.user) {
      const { firstName, lastName, email } = session.user;
      void client.updateUser({
        data: {
          firstName,
          lastName,
          email,
        },
      });
    }
  }, [session, client]);

  return (
    <div>
      <style>{style}</style>
      <WebchatProvider
        theme={theme}
        client={client}
        configuration={{
          botName: 'AI Analyst',
          botAvatar: 'https://cdn.ballerine.io/logos/ballerine-logo.png',
          botDescription: 'Your intelligent AI Analyst',
          composerPlaceholder: 'Ask the AI Analyst anything...',
          website: {
            title: 'Visit AI Analyst',
            link: 'https://ballerine.ai',
          },
          email: {
            title: 'Contact Support',
            link: 'mailto:support@ballerine.com',
          },
          privacyPolicy: {
            title: 'Privacy Policy',
            link: 'https://ballerine.com/privacy',
          },
          termsOfService: {
            title: 'Terms of Service',
            link: 'https://ballerine.com/terms',
          },
        }}
        closeWindow={toggleIsWebchatOpen}
      >
        <button
          onClick={toggleIsWebchatOpen}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            padding: 0,
            overflow: 'hidden',
          }}
          aria-label="Toggle AI Analyst chat"
        >
          <img
            src="https://cdn.ballerine.io/logos/ballerine-logo.png"
            alt="AI Analyst"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </button>
        {isWebchatOpen && (
          <div
            style={{
              width: '400px',
              height: '600px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'fixed',
              bottom: '90px', // Increased to leave space for the open button
              right: '20px',
              zIndex: 999, // Decreased to ensure it's below the open button
              boxShadow: '0 5px 40px rgba(0,0,0,0.16)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <Webchat />
          </div>
        )}
      </WebchatProvider>
    </div>
  );
};

export default Chatbot;
