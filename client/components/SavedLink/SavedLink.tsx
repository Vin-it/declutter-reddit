import { SavedLinkData, SavedLinks } from '../../utils/reddit-interfaces';
import './SavedLink.css';

interface SavedLinkProps {
  data: SavedLinkData;
}

function SavedLink({ data }: SavedLinkProps) {
  return (
    <div className="SavedLink">
      <div className="img">{renderImage(data)}</div>
      <div className="title">
        <div className="subreddit">{data.subreddit_name_prefixed}</div>
        <div>{data.title}</div>
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

  return <img style={{ maxWidth: '220px' }} src={url.replace(/&amp;/g, '&')} />;
}

export default SavedLink;
