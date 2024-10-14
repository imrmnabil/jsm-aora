export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.bil.aora",
  projectId: "670a1f6b00025b4f32c9",
  databaseId: "670a2170003bdc729250",
  userCollectionId: "670a21980017122851d7",
  videoCollectionId: "670a21f9002944e2d3c8",
  storageId: "670a23fd00272aa0a411",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

import {
  Client,
  Account,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
import { ID } from "react-native-appwrite";
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createuser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);

    const session = await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userID) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("users", userID),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type!");
    }
    if (!fileUrl) throw new Error(error);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;
  const asset = {
    name:file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri:file.uri,
  };
  console.log(asset);
  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error + "From upload func");
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    console.log(thumbnailUrl, videoUrl);
    const newPost = await databases.createDocument(databaseId,videoCollectionId,ID.unique(),{
      title: form.title,
      thumbnail: thumbnailUrl,
      video:videoUrl,
      prompt:form.prompt,
      users: form.userId,
    })
    return newPost;
  } catch (error) {
    throw new Error(error + "From createVideo func");
  }
};
