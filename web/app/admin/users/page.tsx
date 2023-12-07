import { type Metadata } from 'next';
import Users from '@/app/admin/users/users';
import QueryAllUserAction from '@/app/actions/users/query-all-user-action';

export const metadata: Metadata = {
  title: 'users - youdeyiwu',
  description: 'query all user page',
};

export default async function Page() {
  return <Users data={await QueryAllUserAction()} />;
}
