import axios from "axios";

// this is not used anymore (see a6)
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  await axios.post(`${ENROLLMENTS_API}`, { userId, courseId });
};

export const unenrollUserFromCourse = async (
  userId: string,
  courseId: string
) => {
  await axios.delete(`${ENROLLMENTS_API}/unenroll/${userId}/${courseId}`);
};

export const fetchAllEnrollments = async () => {
  const { data } = await axios.get(ENROLLMENTS_API);
  return data;
};
