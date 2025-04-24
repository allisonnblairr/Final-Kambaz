/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosWithCredentials = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`
  );
  return response.data;
};
export const updateQuiz = async (quiz: any) => {
  const {data} = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return data;
};
export const findQuizAttemptsForQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/quizattempts`
  );
  return response.data;
};
export const createQuizAttemptForQuiz = async (
  quizId: string,
  quizAttempt: any
) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/quizattempts`,
    quizAttempt
  );
  return response.data;
};
export const findQuestionsForQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/questions`
  );
  return response.data;
};

export const deleteQuizQuestion = async (questionId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUESTIONS_API}/${questionId}`
  );
  return response.data;
}

export const findPossibleAnswersForQuestion = async (questionId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUESTIONS_API}/${questionId}/possibleanswers`
  );
  return response.data;
};

export const findPossibleAnswerById = async (questionId: string, paId: string) => {
  const response = await axiosWithCredentials.get(
    `${QUESTIONS_API}/${questionId}/possibleanswers/${paId}`
  );
  return response.data;
};

export const createPossibleAnswer = async (questionId: string, possibleAnswer: any) => {
  const response = await axiosWithCredentials.post(
    `${QUESTIONS_API}/${questionId}/possibleanswers`,
    possibleAnswer
  );
  return response.data;
};

export const createQuestionForQuiz = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return response.data;
};

export const updateQuestion = async (questionId: string, question: any) => {
  const response = await axiosWithCredentials.put(
    `${QUESTIONS_API}/${questionId}`,
    question
  );
  return response.data;
};

export const deleteQuestion = async (questionId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUESTIONS_API}/${questionId}`
  );
  return response.data;
};

export const deletePossibleAnswer = async (answerId: string) => {
  const response = await axiosWithCredentials.delete(
    `${REMOTE_SERVER}/api/possibleanswers/${answerId}`
  );
  return response.data;
};