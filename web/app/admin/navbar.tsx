'use client';

import styles from '@/app/admin/admin.module.scss';
import clsx from 'clsx';
import MyAdmin from '@/app/admin/my-admin';
import { IUser } from '@/app/interfaces/users';
import { IMenu } from '@/app/interfaces/menus';
import { useContext } from 'react';
import { AdminContext } from '@/app/contexts/admin';
import Nodata from '@/app/common/nodata';
import Link from 'next/link';

export type TTabId =
  | 'Dashboard'
  | 'Sections'
  | 'Posts'
  | 'Tags'
  | 'Tag Groups'
  | 'Section Groups'
  | 'Users'
  | 'Roles'
  | 'Permissions'
  | 'Messages'
  | 'Configs'
  | 'Menus'
  | 'Submenus'
  | 'Actions';

export default function Navbar({
  user,
  menus,
}: {
  user: IUser | null;
  menus: IMenu[];
}) {
  const { selectedMenu, setSelectedMenu } = useContext(AdminContext);

  function onClickItem(item: IMenu) {
    if (selectedMenu?.id === item.id) {
      setSelectedMenu!(undefined);
    } else {
      setSelectedMenu!(item);
    }
  }

  return (
    <div
      className={clsx(
        'vh-100 position-fixed overflow-y-auto overflow-x-hidden',
        styles.box,
      )}
    >
      <div className="d-flex flex-column gap-4">
        <MyAdmin user={user} />

        {menus.map((item, index) => {
          return (
            <Link
              key={item.id}
              href=""
              onClick={() => onClickItem(item)}
              className={clsx(
                'cursor-pointer hstack gap-3 me-4 text-decoration-none',
                styles.item,
                // selectedTabIndex === item.id
                //   ? styles.itemInfoHover
                //   : styles.itemHover,
                {
                  // 'link-info': selectedTabIndex === item.id,
                },
              )}
            >
              <span className="text-start flex-grow-1">{item.name}</span>
              <i
                className={clsx(
                  'bi',
                  selectedMenu?.id === item.id ? 'bi-star-fill' : 'bi-star',
                )}
              ></i>
            </Link>
          );
        })}

        {menus.length === 0 && <Nodata message="The menu is not available" />}
      </div>
    </div>
  );
}
