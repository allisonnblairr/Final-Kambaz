/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizquestions: [] as any[],
};

const quizQuestionsSlice = createSlice({
  name: "quizquestions",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      const filteredQuestions = state.quizquestions.filter(
        (q: any) => q.quizId !== (action.payload[0]?.quizId || "")
      );
      state.quizquestions = [...filteredQuestions, ...action.payload];
    },
    addQuestion: (state, action) => {
      state.quizquestions.push(action.payload);
    },
    updateQuestion: (state, action) => {
      const index = state.quizquestions.findIndex(
        (q: any) => q._id === action.payload._id
      );
      if (index !== -1) {
        state.quizquestions[index] = action.payload;
      }
    },
    deleteQuestion: (state, action) => {
      state.quizquestions = state.quizquestions.filter(
        (q: any) => q._id !== action.payload
      );
    },
  },
});

export const { addQuestion, updateQuestion, deleteQuestion, setQuestions } =
  quizQuestionsSlice.actions;
export default quizQuestionsSlice.reducer;
