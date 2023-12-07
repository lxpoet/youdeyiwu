'use server';

import { type IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import { AUTHENTICATION_HEADER, JSON_HEADER, PUT } from '@/app/constants';
import { revalidateTag } from 'next/cache';
import { checkResponseStatus } from '@/app/common/server';

export interface IUpdateSectionActionVariables {
  name?: string;
  cover?: string;
  overview?: string;
  content?: string;
  sort?: number;
}

export default async function UpdateSectionAction({
  id,
  variables,
}: {
  id: number;
  variables: IUpdateSectionActionVariables;
}) {
  const response = await fetch(process.env.API_SERVER + `/sections/${id}`, {
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

  revalidateTag('/admin/sections');
  revalidateTag(`/admin/sections/${id}`);
}
