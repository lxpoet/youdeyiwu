import { obtainCredentials } from '@/app/common/server';

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';

export const TK = '_youdeyiwu_tk';

export const SECURE_TK = '__Secure_youdeyiwu_tk';

export const AUTHORIZATION = 'Authorization';

export const BEARER = 'Bearer';

export const LOCATION = 'Location';

export const JSON_HEADER = {
  'Content-Type': 'application/json',
};

export const AUTHENTICATION_HEADER = (tk?: string): Record<string, string> => {
  const _tk = tk ?? obtainCredentials();

  if (_tk) {
    return {
      [AUTHORIZATION]: `${BEARER} ${_tk}`,
    };
  }

  return {};
};

export const TEST_AUTHENTICATION_HEADER = (tk = '') => {
  return {
    [AUTHORIZATION]: tk,
  };
};
