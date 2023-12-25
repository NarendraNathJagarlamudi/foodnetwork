import axios from "axios";

export async function getAdminEmails() {
  try {
    const response = await axios.get("/api/emails");
    const adminUsers = response.data;

    return adminUsers.map((user) => user.email);
  } catch (error) {
    console.error(error);
    // Handle the error or return a default value
    return [];
  }
}
