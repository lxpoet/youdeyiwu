'use server';

import { type IError, IPage, TQueryParams } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { checkResponseStatus } from '@/app/common/server';
import { ITagGroup } from '@/app/interfaces/tag-groups';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import queryString from 'query-string';

export default async function QueryAllTagGroupAction(
  queryParams?: TQueryParams,
) {
  const _queryParams = queryParams ?? {};
  const { url, str } = {
    url: queryString.stringifyUrl({
      url: process.env.API_SERVER + '/tag-groups',
      query: _queryParams,
    }),
    str: queryString.stringify(_queryParams),
  };

  const response = await fetch(url, {
    headers: AUTHENTICATION_HEADER(),
    next: {
      tags: ['/admin/tag-groups', str],
    },
  });

  const data = (await response.json()) as IPage<ITagGroup[]> | IError;
  if (!response.ok) {
    checkResponseStatus(response.status);
    throw FetchDataException((data as IError).message);
  }

  return data as IPage<ITagGroup[]>;
}
