/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizCorrectness: any,
};

const quizCorrectnessSlice = createSlice({
  name: "quizcorrectness",
  initialState,
  reducers: {
    setQuizCorrectness: (state, {payload: quizcorrectness}) => {
      state.quizCorrectness = quizcorrectness;
    }
  },
});

export const { setQuizCorrectness } =
  quizCorrectnessSlice.actions;
export default quizCorrectnessSlice.reducer;
