/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const axiosWithCredentials = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;
export const deleteQuestion = async (questionId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUESTIONS_API}/${questionId}`
  );
  return response.data;
};
export const updateQuestion = async (question: any) => {
  const { data } = await axiosWithCredentials.put(
    `${QUESTIONS_API}/${question._id}`,
    question
  );
  return data;
};
export const findPossibleAnswersForQuestion = async (questionId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUESTIONS_API}/${questionId}/possibleanswers`
  );
  return response.data;
};
export const createPossibleAnswerForQuestion = async (
  questionId: string,
  possibleAnswer: any
) => {
  const response = await axiosWithCredentials.post(
    `${QUESTIONS_API}/${questionId}/possibleanswers`,
    possibleAnswer
  );
  return response.data;
};
export const findPossibleAnswerForQuestionById = async (
  questionId: string,
  possibleAnswerId: string
) => {
  const response = await axiosWithCredentials.get(
    `${QUESTIONS_API}/${questionId}/possibleanswers/${possibleAnswerId}`
  );
  return response.data;
};
