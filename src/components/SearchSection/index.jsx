import PropTypes from 'prop-types';

import useSearch from '~/hooks/useSearch';
import NonSearchUI from './NonSearchUI';
import SearchUI from './SearchUI';
import SearchBar from '../SearchBar';

const SearchSection = ({ type }) => {
  const { input, handleSetInput, isFocus, setIsFocus } = useSearch();

  return (
    <div className="relative">
      <div className="fixed top-0 bottom-0 right-0 left-[80%] gap-[20px] flex flex-col bg-[#181818] py-[24px] px-[20px] text-[rgba(255,_255,_255,_0.4)]">
        <SearchBar
          input={input}
          handleSetInput={handleSetInput}
          isFocus={isFocus}
          setIsFocus={setIsFocus}
        />
        {input ? (
          <SearchUI type={type} query={input} />
        ) : (
          <NonSearchUI type={type} />
        )}
      </div>
    </div>
  );
};

SearchUI.SearchSection = {
  type: PropTypes.oneOf(['movie', 'tv']).isRequired,
};

export default SearchSection;
