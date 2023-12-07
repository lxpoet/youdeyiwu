'use server';

import { type IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { ITag } from '@/app/interfaces/tags';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkResponseStatus } from '@/app/common/server';

export default async function QueryTagAction(variables: {
  id: number | string;
}) {
  const response = await fetch(
    process.env.API_SERVER + `/tags/${variables.id}`,
    {
      headers: AUTHENTICATION_HEADER(),
      next: {
        tags: [`/admin/tags/${variables.id}`],
      },
    },
  );

  const data = (await response.json()) as ITag | IError;
  if (!response.ok) {
    checkResponseStatus(response.status);
    throw FetchDataException((data as IError).message);
  }

  return data as ITag;
}
