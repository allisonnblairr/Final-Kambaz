/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const axiosWithCredentials = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZATTEMPT_API = `${REMOTE_SERVER}/api/quizattempts`;
export const deleteQuizAttempt = async (quizAttemptId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZATTEMPT_API}/${quizAttemptId}`
  );
  return response.data;
};
export const updateQuizAttempt = async (quizAttempt: any) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZATTEMPT_API}/${quizAttempt._id}`,
    quizAttempt
  );
  return data;
};
