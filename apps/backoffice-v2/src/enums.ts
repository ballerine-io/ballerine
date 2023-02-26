export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const State = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
  NEW: 'new',
} as const;

export const States = [
  State.APPROVED,
  State.REJECTED,
  State.PENDING,
  State.NEW,
] as const;

export const Action = {
  REJECT: 'REJECT',
  APPROVE: 'APPROVE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
} as const;

export const Resource = {
  END_USER: 'END_USER',
} as const;
