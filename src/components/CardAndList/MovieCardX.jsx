import PropTypes from 'prop-types';
import { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api, genres, route } from '~/utils';
import { MovieTagList } from './MovieTagList';

const MovieCardX = ({ movieData, type }) => {
  type = movieData.title ? 'movie' : 'tv';
  const { vote_average, id } = movieData;
  let neededGenres;
  switch (type) {
    case 'movie':
      neededGenres = genres.movie;
      break;
    case 'tv': {
      neededGenres = genres.tv;
      break;
    }
    default:
      break;
  }

  // Xử lý hover vào tag thì unhover thẻ
  const cardRef = useRef();
  const handleHoverTag = () => {
    if (cardRef?.current) {
      cardRef.current.classList.remove('hover:bg-[rgba(255,_255,_255,_0.2)]');
    }
  };
  const handleUnHoverTag = () => {
    if (cardRef?.current) {
      cardRef.current.classList.add('hover:bg-[rgba(255,_255,_255,_0.2)]');
    }
  };
  return (
    <Fragment>
      {/* For movie and tv, ignore actors*/}
      {!(movieData.media_type === 'person') && (
        <Link
          ref={cardRef}
          to={route.toDetail(type, id)}
          as="li"
          className="flex items-center gap-[10px] w-full p-[10px] rounded-xl bg-[rgba(255,_255,_255,_0.06)] text-white hover:bg-[rgba(255,_255,_255,_0.2)] hover:shadow-md cursor-pointer"
        >
          <div className="relative w-[34%] h-0 pt-[34%] bg-[#ececec4a] rounded-lg overflow-hidden">
            <img
              className="absolute w-full inset-0 block  object-cover object-center"
              src={
                movieData.poster_path
                  ? api.getPoster(movieData.poster_path)
                  : '/imgs/no-poster.jpg'
              }
              alt=""
            />
          </div>
          <div className="flex w-[66%] h-[95%] flex-col justify-between items-start">
            <h5 className="w-full font-bold line-clamp-1 mb-1">
              {movieData.title || movieData.name}
            </h5>
            <div className="w-full flex justify-between items-center text-xs mb-2">
              <span>
                {movieData.release_date || movieData.first_air_date
                  ? new Date(
                      movieData.release_date || movieData.first_air_date
                    ).getFullYear()
                  : 'Unknown year'}
              </span>
              <div className="inline-flex gap-1">
                <span>{vote_average}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path
                    d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"
                    fill="#FFAA01"
                  ></path>
                </svg>
              </div>
            </div>
            <MovieTagList
              movieData={movieData}
              genresData={neededGenres}
              category={type}
              className="!mb-0"
              handleHoverTag={handleHoverTag}
              handleUnHoverTag={handleUnHoverTag}
            />
          </div>
        </Link>
      )}
    </Fragment>
  );
};

MovieCardX.propTypes = {
  movieData: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['movie', 'tv']),
};

export default MovieCardX;
