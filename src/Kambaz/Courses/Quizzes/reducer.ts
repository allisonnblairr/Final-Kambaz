/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { quizzes } from "../../Database";
const initialState = {
  quizzes: quizzes,
};
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    addQuiz: (state, { payload: quiz }) => {
      const newQuiz: any = {
        _id: quiz._id,
        questions: quiz.questions,
        title: quiz.title,
        instructions: quiz.instructions,
        course: quiz.course,
        published: quiz.published,
        availableFrom: quiz.availableFrom,
        availableUntil: quiz.availableUntil,
        due: quiz.due,
        points: quiz.points || "0",
        attempts: quiz.attempts || [],
        quizType: quiz.quizType,
        assignmentGroup: quiz.assignmentGroup || "QUIZZES",
        shuffleAnswers: quiz.shuffleAnswers ?? true,
        hasTimeLimit: quiz.hasTimeLimit ?? true,
        timeLimitLength: quiz.timeLimitLength || "20",
        hasMultipleAttempts: quiz.hasMultipleAttempts ?? false,
        numAttempts: quiz.numAttempts || "1",
        showCorrectAnswers: quiz.showCorrectAnswers ?? false,
        whenToShowCorrectAnswers: quiz.whenToShowCorrectAnswers || "",
        accessCode: quiz.accessCode || "",
        oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
        webcamRequired: quiz.webcamRequired ?? false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering ?? false,
      };
      state.quizzes = [...state.quizzes, newQuiz] as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
    editQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId ? { ...q, editing: true } : q
      ) as any;
    },
  },
});
export const { addQuiz, deleteQuiz, updateQuiz, editQuiz } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;
