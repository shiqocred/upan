import "server-only";

import { Client, Databases } from "node-appwrite";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const databases = new Databases(client);

  return {
    databases,
  };
};
