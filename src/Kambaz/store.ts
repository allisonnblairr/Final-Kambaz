import {configureStore} from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import accountReducer from "./Account/reducer";
import enrollmentReducer from "./Courses/reducer";
import quizzesReducer from "./Courses/Quizzes/reducer";
import quizQuestionsReducer from "./Courses/Quizzes/questionsreducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentReducer,
    quizzesReducer,
    quizQuestionsReducer,
  },
});
export default store;
