"use server"

import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { parse } from "path";

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

export const sendEmailOTP = async ({email}: {email: string}) => {
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
//   console.log("Existing User Check!!");
//   console.log(existingUser);

  const accountId = await sendEmailOTP({ email });
  
//   console.log("Account ID:" + accountId);
  
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
        
        // return accountId;
    }
    return parseStringify({accountId});
};

export const verifySecret = async ({accountId, password}: {accountId: string; password: string}) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: "strict",
            secure: true
        });

        return parseStringify({sessionId: session.$id});

    } catch (error) {
        handleError(error, "Failed to verify OTP");
    } 
        
}

export const getCurrentUser = async () => {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;
    
    return parseStringify(user.documents[0]);
};