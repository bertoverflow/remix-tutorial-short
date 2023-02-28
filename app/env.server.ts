import invariant from "tiny-invariant";

export function getEnv() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  invariant(ADMIN_EMAIL, "ADMIN_EMAIL should be defined.");
  return {
    ADMIN_EMAIL,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;

  interface Window {
    ENV: ENV;
  }
}
