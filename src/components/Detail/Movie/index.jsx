import { Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { api } from '~/config';
import useMySWR from '~/hooks/useMySWR';
import DetailBackdrop from '../Common/Backdrop';
import DetailPosterSection from '../Common/PosterSection';
import DetailContentSection from '../Common/ContentSection';
import DetailCastsList from '../Common/CastsList';
import TrailerSection from '../Common/TrailerSection';
import '../Detail.scss';
import RecommendSection from './RecommendSection';

const DetailMovie = ({ type }) => {
  const { id } = useParams();
  const { myData: movieData, isLoading: movieLoading } = useMySWR({
    api: api.getDetail(id, type),
  });
  const { myData: creditsData, isLoading: creditsLoading } = useMySWR({
    api: api.getCredits(id, type),
  });
  const { myData: videosData, isLoading: videosLoading } = useMySWR({
    api: api.getTrailer(id, type),
  });
  const { myData: recommendsData, isLoading: recommendsLoading } = useMySWR({
    api: api.getRecommend(id, type),
    max: 20,
  });
  console.log('recommendsData', recommendsData);

  return (
    <div className="relative bg-[#222222] min-h-[150vh] ">
      {!movieLoading && !Array.isArray(movieData) && (
        <Fragment>
          <DetailBackdrop movieData={movieData} />
          <div className="absolute top-[250px] right-0 left-0">
            <div className="flex w-full items-start justify-between gap-5 px-[40px]">
              <DetailPosterSection movieData={movieData} />
              <DetailContentSection movieData={movieData} />
            </div>
            {!creditsLoading &&
              creditsData.cast &&
              creditsData.cast.length > 0 && (
                <DetailCastsList castsData={creditsData.cast} />
              )}
            {!videosLoading && videosData.length > 0 && (
              <TrailerSection videosData={videosData} />
            )}
            {!recommendsLoading && recommendsData.length > 0 && (
              <RecommendSection recommendsData={recommendsData} />
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default DetailMovie;
