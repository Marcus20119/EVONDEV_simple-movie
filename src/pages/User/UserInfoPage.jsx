import { useState } from 'react';
import Avatar from '~/pages/User/Avatar';
import { supabase, useFetchAllTable } from '~/supabase';
import { Fragment } from 'react';
import Wallpaper from './Wallpaper';
import { useScrollOnTop } from '~/hooks';
import SectionMainInfo from './SectionMainInfo';
import { useUser } from '~/contexts/userContext';
import { ButtonPrimary } from '~/components/Button';
import { useLocation } from 'react-router-dom';
import SectionTab from './SectionTab';
import { useAuth } from '~/contexts/authContext';

const UserInfoPage = () => {
  useScrollOnTop();
  const { userRow, handleForceGetUserRow } = useUser();
  const { search } = useLocation();
  const section = search.split('=')[1];

  const [loading, setLoading] = useState(false);
  const updateProfile = async newUserRow => {
    try {
      setLoading(true);

      let { error } = await supabase.from('profiles').upsert({
        ...newUserRow,
        updated_at: new Date(),
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách favorite actors

  const {
    tableData: favoriteActorsTable,
    loading: loadingFavoriteActorsTable,
  } = useFetchAllTable({
    table: 'favorite_actors',
    neededLogIn: true,
    match: { user_id: userRow?.id ? userRow.id : '' },
    rerenderCondition: [userRow],
    initialLoading: true,
  });

  return (
    <Fragment>
      {userRow?.email && (
        <div>
          <div aria-live="polite" className="relative w-full">
            <Wallpaper
              url={userRow.wallpaper_url}
              onUpload={url => {
                const newData = { ...userRow, wallpaper_url: url };
                handleForceGetUserRow();
                updateProfile(newData);
              }}
            />

            <div className="absolute top-[300px] left-0 w-full z-10">
              <div className="flex items-end gap-3 px-[60px]">
                <Avatar
                  url={userRow.avatar_url}
                  onUpload={url => {
                    const newData = { ...userRow, avatar_url: url };
                    handleForceGetUserRow();
                    updateProfile(newData);
                  }}
                />
                <div>
                  <SectionMainInfo
                    userRow={userRow}
                    favoriteActorsTable={favoriteActorsTable}
                    loadingFavoriteActorsTable={loadingFavoriteActorsTable}
                  />
                </div>
                <div className="ml-auto mb-[16px]">
                  <ButtonPrimary className="px-3 py-2 rounded-lg font-normal">
                    <i className="bx bxs-edit-alt"></i>
                    <span>Edit Info</span>
                  </ButtonPrimary>
                </div>
              </div>
              <SectionTab section={section} userRow={userRow} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserInfoPage;
