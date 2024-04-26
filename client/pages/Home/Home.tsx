import './Home.css';
export const Home = () => {
  return (
    <>
      <div className="user-registration">
        <div className="logo-container-div">
          <div className="logo-text-div">Declutter</div>
          <div className="logo-div">
            <img
              className="reddit-logo"
              src="static/assets/images/reddit-logo.svg"
            />
          </div>
        </div>
        <div className="sign-up-link-dev">
          <a className="signup-anchor">
            <button type="button" className="sign-up-button">
              Import Saved Links
            </button>
          </a>
        </div>
      </div>
    </>
  );
};
