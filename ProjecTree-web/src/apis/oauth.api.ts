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

// TODO : oauth/callback으로 리다이렉트 될 시 서버로 refresh 쿠키 요청하는 API 전송하기
const getRefreshToken = () => {};

export { redirectToGoogleOauth, redirectToGithubOauth };
