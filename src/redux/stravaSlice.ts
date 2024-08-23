import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface PokeState {
  activityData: any[];
  toggleLoader: boolean;
}

const initialState: PokeState = {
  activityData: [],
  toggleLoader: false,
};

export const stravaSlice: any = createSlice({
  name: 'strava',
  initialState: initialState,
  reducers: {
    setActivityData: (state, action: PayloadAction<any[]>) => {
      state.activityData = action.payload;
    },
    toggleReload: state => {
      state.toggleLoader = !state.toggleLoader;
    },
  },
});

export const {setActivityData, toggleReload} = stravaSlice.actions;

export default stravaSlice.reducer;
