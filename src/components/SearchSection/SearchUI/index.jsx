import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withErrorBoundary } from 'react-error-boundary';

import LoadingBounce from '~/components/Base/Loading/Bounce';
import ButtonPlay from '~/components/Button/Play';
import MovieCardListX from '~/components/CardAndList/CardListX';
import { api } from '~/config';
import useMySWR from '~/hooks/useMySWR';
import ErrorFallBack from '~/components/Base/ErrorFallBack';

const SearchUI = ({ type, query }) => {
  // const searchApi = api.getSearch(
  //   query ? query : 'spiderman no way home',
  //   type,
  //   1
  // );
  const searchApi = api.getSearchMulti(
    query ? query : 'spiderman no way home',
    1
  );
  const { myData: searchData, isLoading: searchLoading } = useMySWR({
    api: searchApi,
  });
  return (
    <div className="flex flex-col w-full gap-[10px] overflow-y-auto scrollbar-hide">
      {searchLoading || !searchData || searchData.length === 0 ? (
        <LoadingBounce />
      ) : (
        <Fragment>
          <MovieCardListX moviesData={searchData} type={type} />
          <ButtonPlay message="See more" displayIcon={false} widthType="full" />
        </Fragment>
      )}
    </div>
  );
};

SearchUI.propTypes = {
  type: PropTypes.oneOf(['movie', 'tv']).isRequired,
  query: PropTypes.any.isRequired,
};

export default withErrorBoundary(SearchUI, {
  FallbackComponent: ErrorFallBack,
});
