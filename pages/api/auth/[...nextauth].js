import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import firebase from "@/components/firebase";
import CredentialsProvider from "next-auth/providers/credentials";

// Custom Firebase Provider
const FirebaseCredentials = CredentialsProvider({
  // Provider name, used for identification purposes
  name: "FirebaseCredentials",

  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },

  // The function that will be called to authorize the user
  authorize: async (credentials) => {
    try {
      // Implement Firebase's signInWithEmailAndPassword method here
      // Use credentials.email and credentials.password to sign in the user
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(credentials.email, credentials.password);
      const user = userCredential.user;

      if (user) {
        // Add any custom user data you want to be available in session
        const { uid, email } = user;

        // Return the user data, NextAuth will handle the JWT creation
        return Promise.resolve({ id: uid, email });
      }
    } catch (error) {
      // Handle authentication error
      console.error("Authentication error:", error);
      return Promise.resolve(null); // Return null if authentication fails
    }
  },
});

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FirebaseCredentials, // Add the custom Firebase provider here
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Assign the user's email from the Firebase provider to the JWT token
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the token data to the session
      if (token) {
        session.user = token;
        return session;
        // if (adminEmails.includes(session?.user?.email)) {
        //   return session;
        // }
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
