const redirectURL = `${window.location.origin}/oauth/callback`;

const redirectToGoogleOauth = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  alert(redirectURL);
  window.location.href = `${BASE_URL}oauth2/authorization/google?redirectURL=${redirectURL}`;
};

const redirectToGithubOauth = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  window.location.href = `${BASE_URL}oauth2/authorization/github?redirectURL=${redirectURL}`;
};

export { redirectToGoogleOauth, redirectToGithubOauth };
