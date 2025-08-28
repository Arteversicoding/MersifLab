export const firebaseConfig = {
  apiKey: "AIzaSyD1I9B7-OeTOGes_bpCjeD7eDRdcoEhuGs",
  authDomain: "mersiflab-63b3c.firebaseapp.com",
  projectId: "mersiflab-63b3c",
  storageBucket: "mersiflab-63b3c.appspot.com",
  messagingSenderId: "842937189045",
  appId: "1:842937189045:web:03c4a5ae96c7026b6ff4fc",
  measurementId: "G-0HZCJ4DCDR"
};

export const geminiApiKey = "AIzaSyAkIyXZk5Xk36eG4hrQ0aKlRlkg6B5gaw8";

// Google Drive API config (fill these from Google Cloud Console)
export const googleDriveConfig = {
  apiKey: "", // e.g. AI... from Google Cloud Console
  clientId: "", // e.g. 1234567890-xxxxxxxx.apps.googleusercontent.com
  scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata",
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  // Optional: upload target folder ID; leave empty to upload to root
  folderId: ""
};