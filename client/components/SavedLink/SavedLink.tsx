import { SavedLinkData, SavedLinks } from '../../utils/reddit-interfaces';
import './SavedLink.css';

interface SavedLinkProps {
  title: string;
  thumbnail: string;
  data: SavedLinkData;
}

function SavedLink({ title, thumbnail, data }: SavedLinkProps) {
  return (
    <div className="u-overflow-hidden bg-white u-round-sm u-shadow-xl mx-2 my-4 u-flex u-flex-column u-flex-row-sm">
      {renderImage(data)}
      <div className="p-2 px-4-sm">
        <div className="tag-container">
          <div className="tag tag--success text-sm u-shadow-xs">
            {data.subreddit_name_prefixed}
          </div>
        </div>

        <p className="lead">{title}</p>
        <p></p>
      </div>
    </div>
  );
}

function isValidImgSrc(thumbnail: undefined | string): boolean {
  return Boolean(
    thumbnail &&
      (thumbnail.indexOf('http') > -1 || thumbnail.indexOf('https') > -1)
  );
}

function getImageSrc(data: SavedLinkData) {
  const mediaMetadata = data.media_metadata;
  if (mediaMetadata) {
    return Object.keys(mediaMetadata).map((k) => mediaMetadata[k].p[2].u);
  }
  const preview = data?.preview?.images[0].source?.url;
  if (preview) {
    return preview;
  }
  if (data.url) {
    return data.url;
  }

  return null;
}

function renderImage(data: SavedLinkData) {
  const imgSrc = getImageSrc(data);
  let url = '';
  if (Array.isArray(imgSrc)) {
    url = imgSrc[0];
  }
  if (typeof imgSrc === 'string') {
    url = imgSrc;
  }

  if (
    url === null ||
    (url.indexOf('.jpg') === -1 &&
      url.indexOf('.jpeg') === -1 &&
      url.indexOf('.png') === -1 &&
      url.indexOf('webp') === -1)
  ) {
    return <></>;
  }

  return (
    <img
      className="img-stretch"
      style={{ maxWidth: '220px' }}
      src={url.replace(/&amp;/g, '&')}
    />
  );
}

export default SavedLink;
