import { UserAgentApplication } from 'msal';

export const requiresInteraction = (errorMessage) => {
  if (!errorMessage || !errorMessage.length) {
    return false;
  }

  return (
    errorMessage.indexOf('consent_required') > -1 ||
    errorMessage.indexOf('interaction_required') > -1 ||
    errorMessage.indexOf('login_required') > -1
  );
};

export const fetchMsGraph = async (url, accessToken) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
};

export const isIE = () => {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ') > -1;
  const msie11 = ua.indexOf('Trident/') > -1;

  // If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
  // const isEdge = ua.indexOf("Edge/") > -1;

  return msie || msie11;
};

export const AUTH_SCOPES = {
  OPENID: 'openid',
  OFFLINE_ACCESS: 'offline_access',
  PROFILE: 'profile'
};

export const AUTH_REQUESTS = {
  LOGIN: {
    scopes: [AUTH_SCOPES.OPENID, AUTH_SCOPES.PROFILE],
  },
  EMAIL: {
    scopes: [],
  },
  REFRESH_TOKEN: {
//    scopes: [process.env.REACT_APP_CLIENT_ID],
    scopes: ["07b60443-8a9d-4ff4-b105-248185360cae"],
  },
};

export const msalApp = new UserAgentApplication({
  auth: {
    clientId: '07b60443-8a9d-4ff4-b105-248185360cae',
    authority: 'https://foodplanner.b2clogin.com/tfp/foodplanner.onmicrosoft.com/B2C_1_SignupOrSignin/',
    validateAuthority: false,
    //redirectUri: 'http://localhost:3000',
    //postLogoutRedirectUri: 'http://localhost:3000',
    //redirectUri: 'https://foodplannerweb.blob.core.windows.net/web/index.html',
    //postLogoutRedirectUri: 'https://foodplannerweb.blob.core.windows.net/web/index.html',
    redirectUri: 'https://purple-water-065604103.azurestaticapps.net',
    postLogoutRedirectUri: 'https://purple-water-065604103.azurestaticapps.net',
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: isIE(),
  },
  system: {
    navigateFrameWait: 0,
  },
});
