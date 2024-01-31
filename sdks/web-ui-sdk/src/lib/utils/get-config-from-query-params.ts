/**
 * @description Gets config-specific query params as an object
 */
export const getConfigFromQueryParams = () => {
  // Make sure non-unrelated query params are passed to the config
  const {
    b_uid,
    b_cid,
    b_t,
    b_fn,
    b_ln,
    b_fid,
    b_ph,
    b_em,
    b_lang,
    b_eut,
    // /?b_uid=&b_cid= --> { b_uid: '', b_cid: '' };
  } = Object.fromEntries(new URLSearchParams(window.location.search));

  const queryParamsConfig = {
    flowName: b_fid,
    clientId: b_cid,
    id: b_uid,
    token: b_t,
    firstName: b_fn,
    lastName: b_ln,
    phone: b_ph,
    email: b_em,
    language: b_lang,
    type: b_eut,
  };

  // Make sure no empty strings are passed to the config
  return Object.entries(queryParamsConfig).reduce((acc, [key, value]) => {
    if (!value) {
      return acc;
    }

    // @TODO: Remove casting and fix the type
    acc[key as keyof typeof queryParamsConfig] = value;

    return acc;
  }, {} as typeof queryParamsConfig);
};
