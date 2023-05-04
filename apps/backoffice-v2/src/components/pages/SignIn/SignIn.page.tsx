import { useSignInMutation } from '../../../lib/react-query/mutations/useSignInMutation/useSignInMutation';
import { FormEventHandler, useCallback } from 'react';
import { useAuthContext } from '../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useIsAuthenticated } from '../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { isErrorWithMessage } from '@ballerine/common';

export const SignIn = () => {
  const { mutate: signIn, error } = useSignInMutation();
  const { signInOptions } = useAuthContext();
  const onSignIn = useCallback(
    body => {
      return signIn({
        redirect: signInOptions?.redirect,
        callbackUrl: signInOptions?.callbackUrl,
        body,
      });
    },
    [signInOptions?.redirect, signInOptions?.callbackUrl, signIn],
  );
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.currentTarget).entries());

      return onSignIn(formData);
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
            {isErrorWithMessage(error) && error?.message === 'Unauthorized (401)' && (
              <div className={`alert alert-error mb-8`}>Invalid credentials</div>
            )}
            <div className="form-control w-full">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name={'email'}
                autoComplete={`off`}
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
                name={'password'}
                type={'password'}
                id={'password'}
                autoComplete={`off`}
                className={`peer input-bordered input focus:invalid:input-error`}
                required
              />
              <span
                className={`label-text-alt invisible pt-2 text-error peer-focus:peer-invalid:visible`}
              >
                Password is a required field.
              </span>
            </div>
          </fieldset>
          <div className={`card-actions mt-auto self-end`}>
            <button className={`btn-primary btn`} type={'submit'}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
