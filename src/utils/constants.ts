export const isDesktop = window.innerHeight <= 800;
export const primaryColor = "#2c7be5";
export const secondaryColor = "#ECB054";
export const LocalStorageKey = "carsafai_admin_";

const serverPort = process.env.REACT_APP_SERVER_PORT || 4000;

const completeConfig = {
  default: {
    serverPort,
    isDevelopment: true,
  },

  development: {
    baseUploadUrl: `http://localhost:${serverPort}/upload/`,
    adminApiBaseUrl: `http://localhost:${serverPort}/admin/v1/`,
    clientWebUrl: `https://carsafai.in`,
  },

  production: {
    isDevelopment: false,
    baseUploadUrl: process.env.REACT_APP_UPLOAD_URL,
    adminApiBaseUrl: process.env.REACT_APP_ADMIN_API_URL,
    clientWebUrl: process.env.REACT_APP_CLIENT_WEB_URL,
  },
};

export const config = {
  ...completeConfig.default,
  ...completeConfig[process.env.REACT_APP_NODE_ENV],
};
