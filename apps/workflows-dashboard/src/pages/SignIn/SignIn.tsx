import { BallerineLogo } from '@app/components/atoms/icons/BallerineLogo';
import { env } from '@app/common/env/env';
import { SignInForm } from '@app/pages/SignIn/components/SignInForm';
import { useSignIn } from '@app/pages/SignIn/hooks/useSignIn';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRefererUrl } from '@app/common/hocs/withSessionProtected/utils/get-referer-url';
import { clearRefererUrl } from '@app/common/hocs/withSessionProtected/utils/clear-referer-url';
import { useSession } from '@app/common/hooks/useSession';
import { LoadingSpinner } from '@app/components/atoms/LoadingSpinner';

export function SignIn() {
  const navigate = useNavigate();
  const { isLoading: isLoadingSession, isAuthenticated, refresh } = useSession();
  const { isLoading, errorCode, signIn } = useSignIn({
    onSuccess: () => {
      refresh();
      const refUrl = getRefererUrl();
      navigate(refUrl || '/');

      if (refUrl) {
        clearRefererUrl();
      }
    },
  });

  if (isLoadingSession) {
    return (
      <div className={`flex h-full flex-col items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoadingSession && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className={`flex h-full flex-col items-center justify-center`}>
      <div className={`mb-16`}>
        {env.VITE_IMAGE_LOGO_URL ? (
          <img className={`w-40`} src={env.VITE_IMAGE_LOGO_URL} />
        ) : (
          <BallerineLogo />
        )}
      </div>
      <SignInForm
        isSubmitting={isLoading}
        alert={errorCode ? <SignInForm.ErrorAlert errorCode={errorCode} /> : null}
        onSubmit={values => signIn(values)}
      />
    </section>
  );
}
