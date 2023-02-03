/* eslint-disable no-labels */
import { Fragment, useEffect, useState } from 'react';
import LoadingSkeleton from '~/components/Base/Loading/Skeleton';
import { useUser } from '~/contexts/userContext';
import { convertDate } from '~/helpers';
import { supabase } from '~/supabase';
import { getBucketURL } from '~/supabase/bucketURL';

const PostedStatus = ({ status, likesTable, handleForceGetLikes }) => {
  const { userRow } = useUser();
  const [quantityLike, setQuantityLike] = useState(status.like_count);
  const [quantityDislike, setQuantityDislike] = useState(status.dislike_count);

  // Khởi tạo trạng thái like post của user
  const [likeRow, setLikeRow] = useState();
  const [likeStatus, setLikeStatus] = useState();
  useEffect(() => {
    if (userRow?.id) {
      const initialLikeRow = likesTable.find(
        item => item.status_id === status.id
      );
      if (initialLikeRow) {
        setLikeRow(initialLikeRow);
        setLikeStatus(initialLikeRow.like_status);
      } else {
        setLikeRow({
          user_id: userRow.id,
          status_id: status.id,
          like_status: 0,
        });
        setLikeStatus(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likesTable, userRow]);

  const handleReset = async currentStatus => {
    block: try {
      if (currentStatus === 'like') {
        setQuantityLike(prev => prev - 1);
        const { error } = await supabase
          .from('statuses')
          .upsert({ ...status, like_count: quantityLike - 1 });
        if (error) {
          console.error(error);
          break block;
        }
      } else if (currentStatus === 'dislike') {
        setQuantityDislike(prev => prev - 1);
        const { error } = await supabase
          .from('statuses')
          .upsert({ ...status, dislike_count: quantityDislike - 1 });
        if (error) {
          console.error(error);
          break block;
        }
      }
      setLikeStatus(0);
      const { error } = await supabase
        .from('likes')
        .upsert({ ...likeRow, like_status: 0 });
      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSingleUpdate = async newStatus => {
    block: try {
      if (newStatus === 'like') {
        setQuantityLike(prev => prev + 1);
        setLikeStatus(1);
        const { error } = await supabase
          .from('statuses')
          .upsert({ ...status, like_count: quantityLike + 1 });
        if (error) {
          console.error(error);
          break block;
        }
      } else if (newStatus === 'dislike') {
        setQuantityDislike(prev => prev + 1);
        setLikeStatus(-1);
        const { error } = await supabase
          .from('statuses')
          .upsert({ ...status, dislike_count: quantityDislike + 1 });
        if (error) {
          console.error(error);
          break block;
        }
      }
      const { error } = await supabase
        .from('likes')
        .upsert({ ...likeRow, like_status: newStatus === 'like' ? 1 : -1 });
      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDoubleUpdate = async newStatus => {
    block: try {
      if (newStatus === 'like') {
        setQuantityLike(prev => prev + 1);
        setQuantityDislike(prev => prev - 1);
        setLikeStatus(1);
        const { error } = await supabase.from('statuses').upsert({
          ...status,
          like_count: quantityLike + 1,
          dislike_count: quantityDislike - 1,
        });
        if (error) {
          console.error(error);
          break block;
        }
      } else if (newStatus === 'dislike') {
        setQuantityLike(prev => prev - 1);
        setQuantityDislike(prev => prev + 1);
        setLikeStatus(-1);
        const { error } = await supabase.from('statuses').upsert({
          ...status,
          like_count: quantityLike - 1,
          dislike_count: quantityDislike + 1,
        });
        if (error) {
          console.error(error);
          break block;
        }
      }
      const { error } = await supabase
        .from('likes')
        .upsert({ ...likeRow, like_status: newStatus === 'like' ? 1 : -1 });
      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full p-3 bg-mainSection rounded-lg">
      <div className="flex justify-between items-start w-full">
        <div className="inline-flex items-center gap-2">
          <img
            src={
              status?.user_avatar
                ? getBucketURL('avatars', status.user_avatar)
                : '/imgs/no-face.jpg'
            }
            alt={status?.user_avatar ? 'Avatar' : 'No image'}
            className="block w-[40px] h-[40px] rounded-full overflow-hidden object-cover object-center"
          />
          <div className="flex flex-col justify-between py-[1px]  text-white80">
            <h4 className="text-lg font-bold">{status.user_name}</h4>
            <span className="text-sm italic opacity-70">
              {convertDate(status.created_at, 'tz')}
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 !text-primary text-[22px]">
          <div className="flex items-center border-r !border-r-[#cccccc50] pr-2">
            <button>
              {!likeStatus && (
                <i
                  className="flex justify-center items-center bx bx-like pr-2 py-[2px]"
                  onClick={() => handleSingleUpdate('like')}
                ></i>
              )}
              {likeStatus === 1 && (
                <i
                  className="flex justify-center items-center bx bxs-like pr-2 py-[2px]"
                  onClick={() => handleReset('like')}
                ></i>
              )}
              {likeStatus === -1 && (
                <i
                  className="flex justify-center items-center bx bx-like pr-2 py-[2px]"
                  onClick={() => handleDoubleUpdate('like')}
                ></i>
              )}
            </button>
            <span className="text-base text-white80 cursor-default">
              {quantityLike}
            </span>
          </div>
          <div className="flex items-center">
            <button>
              {!likeStatus && (
                <i
                  className="flex justify-center items-center bx bx-dislike pr-2 py-[2px]"
                  onClick={() => handleSingleUpdate('dislike')}
                ></i>
              )}
              {likeStatus === 1 && (
                <i
                  className="flex justify-center items-center bx bx-dislike pr-2 py-[2px]"
                  onClick={() => handleDoubleUpdate('dislike')}
                ></i>
              )}
              {likeStatus === -1 && (
                <i
                  className="flex justify-center items-center bx bxs-dislike pr-2 py-[2px]"
                  onClick={() => handleReset('dislike')}
                ></i>
              )}
            </button>
            <span className="text-base text-white80 cursor-default">
              {quantityDislike}
            </span>
          </div>
        </div>
      </div>
      <p className="text-white80">{status.content}</p>
    </div>
  );
};

export default PostedStatus;
