import { Client, Account, ID, Databases, Storage, Query, Permission, Role } from 'appwrite';

// Function to create Appwrite instances
export const createAppwriteInstances = () => {
  const client = new Client();

  if (typeof window !== 'undefined') {
    client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
  }

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  return { client, account, databases, storage };
};

export { ID };

// Database configuration
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const RESUMES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_RESUMES_COLLECTION_ID!;

/**
 * Saves or updates the resume data. If documentId is provided, updates existing document; otherwise creates new one.
 */
export const saveResumeData = async (clientData: any, currentUserId: string, documentId: string | null, databases: Databases, account: Account) => {
  // 1. Input Validation (Ensure we have valid data to save)
  if (!currentUserId || !clientData || !clientData.personalInfo || !clientData.personalInfo.email || !clientData.personalInfo.email.includes('@')) {
    console.warn("Skipping auto-save: User or data is invalid.");
    return;
  }

  // 2. Authentication Guardrail (Crucial fix for session errors)
  try {
    await account.get(); // Check session validity
  } catch (e) {
    console.error("Error saving resume data: User not authenticated or session expired.");
    return; // Halt execution
  }

  // 3. Data Transformation (UI State to FLAT Appwrite Columns)
  const personalInfo = clientData.personalInfo;

  const appwriteData = {
    // FLAT FIELDS (Matching Appwrite Columns)
    full_name: personalInfo.name,
    email: personalInfo.email,
    phone_number: personalInfo.phone,
    location: personalInfo.address,
    title: personalInfo.jobTitle,
    profile: clientData.summary,

    // Redundant Column
    contactInfo: null,

    // Stringifying Array Fields
    experience: JSON.stringify(clientData.experience || []),
    education: JSON.stringify(clientData.education || []),
    skills: JSON.stringify(clientData.skills || []),
    language: JSON.stringify(clientData.languages || []),

    userId: currentUserId, // Links to the authenticated user
  };

  // 4. Permissions: Ensure the authenticated user can READ, UPDATE, and DELETE
  const permissions = [
    Permission.read(Role.user(currentUserId)),
    Permission.update(Role.user(currentUserId)),
    Permission.delete(Role.user(currentUserId)),
  ];

  // 5. Conditional Create/Update Logic
  try {
    if (documentId) {
      // UPDATE: Use provided document ID to update existing resume
      await databases.updateDocument(
        DATABASE_ID, RESUMES_COLLECTION_ID, documentId, appwriteData
      );
      console.log('Resume updated successfully');
      return documentId;
    } else {
      // CREATE: No document ID provided, create new document
      const newDoc = await databases.createDocument(
        DATABASE_ID, RESUMES_COLLECTION_ID, ID.unique(), appwriteData, permissions
      );
      console.log('Resume created successfully');
      return newDoc.$id; // Return new ID for context state
    }
  } catch (error) {
    console.error("Error saving resume data:", error);
  }
};

export const transformAppwriteDataToUI = (appwriteDoc: any) => {
  // Safely parse the JSON strings back to arrays/objects
  const experienceArray = JSON.parse(appwriteDoc.experience || '[]');
  const educationArray = JSON.parse(appwriteDoc.education || '[]');
  const skillsArray = JSON.parse(appwriteDoc.skills || '[]');
  const languagesArray = JSON.parse(appwriteDoc.language || '[]');

  return {
    // Re-create the nested structure for the UI
    personalInfo: {
      name: appwriteDoc.full_name,
      jobTitle: appwriteDoc.title,
      email: appwriteDoc.email,
      phone: appwriteDoc.phone_number,
      address: appwriteDoc.location,
      photo: appwriteDoc.photo || null,
      showPhoto: appwriteDoc.showPhoto || false,
    },

    summary: appwriteDoc.profile,
    experience: experienceArray,
    education: educationArray,
    skills: skillsArray,
    languages: languagesArray,

    // Meta fields
    userId: appwriteDoc.userId,
    documentId: appwriteDoc.$id,
  };
};

/**
 * Loads the single resume document belonging to a given user ID.
 * Returns the transformed UI object or null if none exists.
 */
export const loadResumeData = async (userId: string) => {
  if (!userId) return null;

  try {
    const { databases } = createAppwriteInstances();

    // Query the 'resumes' collection using the 'userId' index (unique, so at most one document)
    const response = await databases.listDocuments(
      DATABASE_ID,
      RESUMES_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );

    if (response.documents.length > 0) {
      // Transform the single document
      return transformAppwriteDataToUI(response.documents[0]);
    }

    console.log("No existing resume found for user.");
    return null; // Return null if no resume exists
  } catch (error) {
    console.error("Error loading resume data:", error);
    return null;
  }
};