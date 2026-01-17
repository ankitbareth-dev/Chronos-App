import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import matrixReducer from "../features/matrix/matrixSlice";
import categoryReducer from "../features/categories/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    matrix: matrixReducer,
    category: categoryReducer,
  },
});

export type AppStore = typeof store;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
