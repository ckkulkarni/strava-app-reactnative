import {configureStore} from '@reduxjs/toolkit';
import stravaSlice from './stravaSlice';

export const store = configureStore({
  reducer: {
    strava: stravaSlice,
  },
});
