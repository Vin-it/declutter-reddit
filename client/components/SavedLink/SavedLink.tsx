import './SavedLink.css';

interface SavedLinkProps {
  title: string;
  thumbnail: string;
}

function SavedLink({ title, thumbnail }: SavedLinkProps) {
  return (
    <div className="SavedLink">
      <div className="img">
        {thumbnail && thumbnail.indexOf('http') > -1 ? (
          <img src={thumbnail} alt="preview" />
        ) : null}
      </div>
      <div className="title">
        <div>{title}</div>
      </div>
    </div>
  );
}

export default SavedLink;
