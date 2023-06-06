export const config = {
  get value() {
    return {
      DEV_URL: process.env.NEXT_PUBLIC_BASEURL,
      APPTOKEN: process.env.NEXT_PUBLIC_SUPPRESS_TOKEN,
      APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    };
  },
};
