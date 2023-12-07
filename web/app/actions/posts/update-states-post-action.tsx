'use server';

import { type IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, PUT } from '@/app/constants';
import { ISectionState } from '@/app/interfaces/sections';
import { revalidateTag } from 'next/cache';
import { IPostReviewState, IPostSortState } from '@/app/interfaces/posts';
import { checkResponseStatus } from '@/app/common/server';

export interface IUpdateStatesPostActionVariables {
  states?: ISectionState[];
  allows?: number[];
  blocks?: number[];
  accessKey?: string;
  reviewState: IPostReviewState;
  sortState: IPostSortState;
}

export default async function UpdateStatesPostAction({
  id,
  variables,
}: {
  id: number;
  variables: IUpdateStatesPostActionVariables;
}) {
  const response = await fetch(process.env.API_SERVER + `/posts/${id}/states`, {
    method: PUT,
    headers: {
      ...AUTHENTICATION_HEADER(),
      ...JSON_HEADER,
    },
    body: JSON.stringify(variables),
    cache: 'no-store',
  });

  if (!response.ok) {
    const data = (await response.json()) as IError;
    checkResponseStatus(response.status);
    throw FetchDataException(data.message);
  }

  revalidateTag('/admin/posts');
  revalidateTag(`/admin/posts/${id}`);
}
