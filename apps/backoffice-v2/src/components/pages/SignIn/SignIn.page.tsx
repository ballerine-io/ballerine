import { useSignInMutation } from '@/lib/react-query/mutations/useSignInMutation/useSignInMutation';
import { FormEventHandler, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useIsAuthenticated } from '@/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { Button } from '@/components/atoms/Button';

export const SignIn = () => {
  const { mutate: signIn } = useSignInMutation();
  const { signInOptions } = useAuthContext();
  const onSignIn = useCallback(() => {
    return signIn({
      redirect: signInOptions?.redirect,
      callbackUrl: signInOptions?.callbackUrl,
    });
  }, [signInOptions?.redirect, signInOptions?.callbackUrl, signIn]);
  const onSignInToGoogle = useCallback(() => {
    return signIn({
      redirect: signInOptions?.redirect,
      callbackUrl: signInOptions?.callbackUrl,
      provider: 'google',
    });
  }, [signInOptions?.redirect, signInOptions?.callbackUrl, signIn]);
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault();

      return onSignIn();
    },
    [onSignIn],
  );
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) return null;

  return (
    <section className={`flex h-full flex-col items-center justify-center`}>
      <div
        className={`card min-h-[60vh] w-full max-w-lg border border-neutral/10 bg-base-100 shadow-xl theme-dark:border-neutral/60`}
      >
        <form className={`card-body`} onSubmit={onSubmit}>
          <fieldset>
            <legend className={`card-title mb-8 block text-center text-4xl`}>Sign In</legend>
            <Button
              variant={`outline`}
              className={`mb-2`}
              type={`button`}
              onClick={onSignInToGoogle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="me-2 mt-1 h-6 w-6"
              >
                <clipPath id="p.0">
                  <path d="m0 0l20.0 0l0 20.0l-20.0 0l0 -20.0z" clipRule="nonzero" />
                </clipPath>
                <g clipPath="url(#p.0)">
                  <path
                    fill="currentColor"
                    fillOpacity="0.0"
                    d="m0 0l20.0 0l0 20.0l-20.0 0z"
                    fillRule="evenodd"
                  />
                  <path
                    fill="currentColor"
                    d="m19.850197 8.270351c0.8574047 4.880001 -1.987587 9.65214 -6.6881847 11.218641c-4.700598 1.5665016 -9.83958 -0.5449295 -12.08104 -4.963685c-2.2414603 -4.4187555 -0.909603 -9.81259 3.1310139 -12.6801605c4.040616 -2.867571 9.571754 -2.3443127 13.002944 1.2301085l-2.8127813 2.7000687l0 0c-2.0935059 -2.1808972 -5.468274 -2.500158 -7.933616 -0.75053835c-2.4653416 1.74962 -3.277961 5.040613 -1.9103565 7.7366734c1.3676047 2.6960592 4.5031037 3.9843292 7.3711267 3.0285425c2.868022 -0.95578575 4.6038647 -3.8674583 4.0807285 -6.844941z"
                    fillRule="evenodd"
                  />
                  <path
                    fill="currentColor"
                    d="m10.000263 8.268785l9.847767 0l0 3.496233l-9.847767 0z"
                    fillRule="evenodd"
                  />
                </g>
              </svg>
              Sign in with Google
            </Button>
            <div className={`divider text-sm`}>Or continue with email</div>
            <div className="form-control w-full">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                autoComplete={`email`}
                type="email"
                required
                id={'email'}
                className={`peer input-bordered input focus:invalid:input-error`}
              />
              <span
                className={`label-text-alt invisible pt-2 text-error peer-focus:peer-invalid:visible`}
              >
                Email must be a valid email address.
              </span>
            </div>
            <div className="form-control w-full">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={'password'}
                id={'password'}
                autoComplete={'current-password'}
                className={`peer input-bordered input focus:invalid:input-error`}
                required
                pattern={
                  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,255}$'
                }
              />
              <span
                className={`label-text-alt invisible pt-2 text-error peer-focus:peer-invalid:visible`}
              >
                Password must be at least 8 character(s), at most 255 character(s), contain at least
                one uppercase letter, one lowercase letter, one number, and one special
                character(s).
              </span>
            </div>
          </fieldset>
          <div className={`card-actions mt-auto self-end`}>
            <Button className={`btn-primary btn`} type={'submit'}>
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
