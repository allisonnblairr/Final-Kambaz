/* eslint-disable @typescript-eslint/no-explicit-any */
import {createSlice} from "@reduxjs/toolkit";
import {quizquestions} from "../../Database";

const initialState = {
  quizquestions: quizquestions,
};

const quizQuestionsSlice = createSlice({
  name: "quizQuestions",
  initialState,
  reducers: {
    setQuestions: (state, { payload: questions }) => {
      state.quizquestions = questions;
    },
    addQuestion: (state, {payload: question}) => {
      let answers = [];

      if (question.questionType === "MULTIPLE_CHOICE") {
        answers = (question.answers?.length > 0) ? question.answers : [
          {answerContent: "Option 1", isCorrect: false, questionId: question._id},
          {answerContent: "Option 2", isCorrect: false, questionId: question._id},
          {answerContent: "Option 3", isCorrect: false, questionId: question._id},
          {answerContent: "Option 4", isCorrect: false, questionId: question._id}
        ];
      } else if (question.questionType === "FILL_BLANK") {
        answers = (question.answers?.length > 0) ? question.answers : [
          {answerContent: "", isCorrect: true, questionId: question._id}
        ];
      } else if (question.questionType === "TRUE_FALSE") {
        answers = [
          {answerContent: "True", isCorrect: question.answers?.[0]?.isCorrect || false, questionId: question._id},
          {answerContent: "False", isCorrect: question.answers?.[1]?.isCorrect || false, questionId: question._id}
        ];
      }

      const newQuestion = {
        _id: question._id,
        quizId: question.quizId,
        title: question.title || "New Question",
        content: question.content || "",
        questionType: question.questionType || "MULTIPLE_CHOICE",
        points: question.points || 1,
        answers: answers
      };

      state.quizquestions.push(newQuestion);
    },

    deleteQuestion: (state, {payload: questionId}) => {
      state.quizquestions = state.quizquestions.filter(
        (q: any) => q._id !== questionId
      );
    },

    updateQuestion: (state, {payload: question}) => {
      const index = state.quizquestions.findIndex((q: any) => q._id === question._id);
      if (index !== -1) {
        state.quizquestions[index] = question;
      }
    }
  },
});

export const {
  addQuestion,
  deleteQuestion,
  updateQuestion,
  setQuestions,
} = quizQuestionsSlice.actions;

export default quizQuestionsSlice.reducer;