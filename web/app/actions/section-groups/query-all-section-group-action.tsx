'use server';

import { type IError, IPage, TQueryParams } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { checkResponseStatus, getQueryParams } from '@/app/common/server';
import { ISectionGroup } from '@/app/interfaces/section-groups';
import { AUTHENTICATION_HEADER } from '@/app/constants';

export default async function QueryAllSectionGroupAction(
  queryParams?: TQueryParams,
) {
  let url = process.env.API_SERVER + '/section-groups';
  if (queryParams) {
    url = url + '?' + getQueryParams(queryParams);
  }

  const response = await fetch(url, {
    headers: AUTHENTICATION_HEADER(),
    next: {
      tags: ['/admin/section-groups'],
    },
  });

  const data = (await response.json()) as IPage<ISectionGroup[]> | IError;
  if (!response.ok) {
    checkResponseStatus(response.status);
    throw FetchDataException((data as IError).message);
  }

  return data as IPage<ISectionGroup[]>;
}
