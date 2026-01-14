import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import matrixReducer from "../features/matrix/matrixSlice";
import categoryReducer from "../features/categories/categorySlice";
import matrixDataReducer from "../features/matrix/matrixDataSlice";
import cellReducer from "../features/matrix/cellSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    matrix: matrixReducer,
    category: categoryReducer,
    matrixData: matrixDataReducer,
    cell: cellReducer,
  },
});

export type AppStore = typeof store;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
