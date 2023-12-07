'use server';

import { type IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, POST } from '@/app/constants';
import { checkResponseStatus } from '@/app/common/server';
import { revalidateTag } from 'next/cache';

export interface ICreateReplyActionVariables {
  content: string;
  commentId?: number;
  replyId?: number;
  postId: number;
}

export default async function CreateReplyAction(
  variables: ICreateReplyActionVariables,
) {
  const response = await fetch(process.env.API_SERVER + '/replies', {
    method: POST,
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

  revalidateTag(`/admin/posts/${variables.postId}/details`);
}
