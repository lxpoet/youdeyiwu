'use client';

import LoadMore from '@/app/home/load-more';
import Box from '@/app/admin/common/box';
import Link from 'next/link';
import { IPage } from '@/app/interfaces';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '@/app/contexts';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import Nodata from '@/app/common/nodata';
import { IRole } from '@/app/interfaces/roles';
import QueryAllRoleAction from '@/app/actions/roles/query-all-role-action';

export default function Roles({ data }: { data: IPage<IRole[]> }) {
  const { toast } = useContext(GlobalContext);
  const [content, setContent] = useState<IRole[]>(data.content);
  const router = useRouter();

  const rolesInfiniteQuery = useInfiniteQuery({
    queryKey: ['/admin', '/roles', 'infinite'],
    queryFn: async (context) => {
      return QueryAllRoleAction({ page: context.pageParam.page + '' });
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.pageable.previous) {
        return;
      }
      return {
        page: Math.max(firstPage.pageable.page - 1, 0),
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pageable.next) {
        return;
      }
      return {
        page: Math.min(lastPage.pageable.page + 1, lastPage.pageable.pages - 1),
      };
    },
    initialData: () => {
      return {
        pages: [data],
        pageParams: [{ page: 0 }],
      };
    },
    initialPageParam: { page: 0 },
  });

  useEffect(() => {
    if (rolesInfiniteQuery.data) {
      setContent(rolesInfiniteQuery.data.pages.flatMap((item) => item.content));
    }
  }, [rolesInfiniteQuery.data]);

  async function onCLickLoadMore() {
    try {
      if (rolesInfiniteQuery.isPending) {
        toast.current.show({
          type: 'danger',
          message: 'Loading',
        });
        return;
      }

      if (!rolesInfiniteQuery.hasNextPage) {
        toast.current.show({
          type: 'info',
          message: 'No more data on the next page',
        });
        return;
      }

      await rolesInfiniteQuery.fetchNextPage({ throwOnError: true });
    } catch (e: any) {
      toast.current.show({
        type: 'danger',
        message: e.message,
      });
    }
  }

  function onClickLink(url: string, e: MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
    e.preventDefault();
    router.push(url);
  }

  return (
    <Box
      header={
        <div className="d-flex align-items-center justify-content-between gap-4">
          <div></div>
          <div>
            <Link
              href={'/admin/roles?type=add'}
              type="button"
              className="btn btn-sm btn-primary"
            >
              Create Role
            </Link>
          </div>
        </div>
      }
      footer={
        <LoadMore
          className="w-100"
          onCLickLoadMore={onCLickLoadMore}
          isLoading={rolesInfiniteQuery.isPending}
        />
      }
    >
      <div className="table-responsive">
        <table className="table align-middle table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Sort</th>
              <th scope="col">Display</th>
              <th scope="col">Overview</th>
              <th scope="col">Operate</th>
            </tr>
          </thead>
          <tbody>
            {content.map((item) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{item.id}</th>
                  <td>{item.name}</td>
                  <td>{item.sort}</td>
                  <td>{item.display + ''}</td>
                  <td>
                    {item.overview ? (
                      item.overview
                    ) : (
                      <span className="text-secondary">No Overview</span>
                    )}
                  </td>
                  <td>
                    <div
                      className="cursor-pointer user-select-none"
                      data-bs-toggle="dropdown"
                    >
                      More
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            onClick={(event) =>
                              onClickLink(`/admin/roles/${item.id}`, event)
                            }
                            className="dropdown-item"
                            href={`/admin/roles/${item.id}`}
                          >
                            Update
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={(event) =>
                              onClickLink(
                                `/admin/roles/${item.id}?type=permissions`,
                                event,
                              )
                            }
                            className="dropdown-item"
                            href={`/admin/roles/${item.id}?type=permissions`}
                          >
                            Update Permissions
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link
                            onClick={(event) =>
                              onClickLink(
                                `/admin/roles/${item.id}?type=del`,
                                event,
                              )
                            }
                            className="dropdown-item text-danger"
                            href={`/admin/roles/${item.id}?type=del`}
                          >
                            Delete
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {content.length === 0 && <Nodata />}
    </Box>
  );
}
