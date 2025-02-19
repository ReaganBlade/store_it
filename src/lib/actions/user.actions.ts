"use server"

import { AfterContext } from "next/dist/server/after/after-context";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0]: null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};



const sendEmailOTP = async ({email}: {email: string}) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);
        console.log(session);

        return session.userId;
    } catch (error) {
        handleError(error, "OTP not sent!");
    }
};

export const createAccount = async ({fullname, email}: {fullname: string; email: string;}) => {
  const existingUser = await getUserByEmail(email);
  console.log("Existing User Check!!");
  console.log(existingUser);

  const accountId = await sendEmailOTP({ email });
  console.log("Account ID:")
  console.log(accountId);

  if (!accountId) throw new Error("Failed to create an Account!");

  if (!existingUser){
    const {databases} = await createAdminClient();
    console.log("Database Check!!!")
    console.log(databases);

    await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
            fullname,
            email,
            avatar: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
            accountId,
        }
    );

    return parseStringify({accountId});
  }
};
