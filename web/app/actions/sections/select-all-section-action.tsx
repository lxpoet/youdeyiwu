'use server';

import { type IError } from '@/app/interfaces';
import FetchDataException from '@/app/exception/fetch-data-exception';
import type { ISection } from '@/app/interfaces/sections';
import { AUTHENTICATION_HEADER } from '@/app/constants';
import { checkResponseStatus } from '@/app/common/server';

export default async function SelectAllSectionAction() {
  const response = await fetch(
    process.env.API_SERVER + '/sections/select-all',
    {
      headers: AUTHENTICATION_HEADER(),
      next: {
        tags: ['/sections/select-all'],
      },
    },
  );

  const data = (await response.json()) as ISection[] | IError;
  if (!response.ok) {
    checkResponseStatus(response.status);
    throw FetchDataException((data as IError).message);
  }

  return data as ISection[];
}
