import { BallerineLogo } from '@/components/atoms/icons/BallerineLogo';
import { env } from '@/common/env/env';
import { SignInForm } from '@/pages/SignIn/components/SignInForm';
import { useSignInMutation } from '@/pages/SignIn/hooks/useSignInMutation';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRefererUrl } from '@/common/hocs/withSessionProtected/utils/get-referer-url';
import { clearRefererUrl } from '@/common/hocs/withSessionProtected/utils/clear-referer-url';
import { useSession } from '@/common/hooks/useSession';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

export function SignIn() {
  const navigate = useNavigate();
  const { isLoading: isLoadingSession, isAuthenticated, refresh } = useSession();
  const { isLoading, errorCode, signIn } = useSignInMutation({
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
