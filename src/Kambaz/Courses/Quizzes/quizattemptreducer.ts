/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  quizattempts: [],
};
const quizAttemptSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload: quizattempts }) => {
      state.quizattempts = quizattempts;
    },
    addQuizAttempt: (state, { payload: quizAttempt }) => {
      const newQuizAttempt: any = {
        _id: quizAttempt._id,
        userId: quizAttempt.userId,
        quizId: quizAttempt.quizId,
        score: quizAttempt.score,
        dateTaken: quizAttempt.score,
        answers: quizAttempt.answers,
      };
      state.quizattempts = [...state.quizattempts, newQuizAttempt] as any;
    },
    deleteQuizAttempt: (state, { payload: quizAttemptId }) => {
      state.quizattempts = state.quizattempts.filter(
        (q: any) => q._id !== quizAttemptId
      );
    },
    updateQuizAttempt: (state, { payload: quizAttempt }) => {
      state.quizattempts = state.quizattempts.map((q: any) =>
        q._id === quizAttempt._id ? quizAttempt : q
      ) as any;
    },
    editQuizAttempt: (state, { payload: quizAttemptId }) => {
      state.quizattempts = state.quizattempts.map((q: any) =>
        q._id === quizAttemptId ? { ...q, editing: true } : q
      ) as any;
    },
  },
});
export const {
  setQuizzes,
  addQuizAttempt,
  deleteQuizAttempt,
  updateQuizAttempt,
  editQuizAttempt,
} = quizAttemptSlice.actions;
export default quizAttemptSlice.reducer;
