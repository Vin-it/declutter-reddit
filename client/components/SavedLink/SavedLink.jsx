import PropTypes from 'prop-types';

import './SavedLink.css';

function SavedLink({ title, thumbnail }) {
  return (
    <div className="SavedLink">
      <div className="img">
        {thumbnail && thumbnail !== 'self' && thumbnail !== 'default' ? (
          <img src={thumbnail} alt="preview" />
        ) : null}
      </div>
      <div className="title">
        <div>{title}</div>
      </div>
    </div>
  );
}

SavedLink.propTypes = {
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
};

export default SavedLink;
