import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';

type Token = {
  id: string;
  name: string;
  price: number;
};

type User = {
  id: string;
  name: string;
  ownerships: {
    [tokenId: string]: number;
  };
};

export type State = {
  users: User[];
  tokens: Token[];
};

const slice = createSlice({
  name: 'game',
  initialState: {
    users: [],
    tokens: [
      {
        id: '1',
        name: 'BatCoin',
        price: 100,
      },
      {
        id: '2',
        name: 'BatCoin',
        price: 100,
      },
      {
        id: '3',
        name: 'BatCoin',
        price: 100,
      },
      {
        id: '4',
        name: 'BatCoin',
        price: 100,
      },
      {
        id: '5',
        name: 'BatCoin',
        price: 100,
      },
      {
        id: '6',
        name: 'BatCoin',
        price: 100,
      },
      {
        id: '7',
        name: 'BatCoin',
        price: 100,
      },
      {
        id: '8',
        name: 'BatCoin',
        price: 100,
      },
    ],
  } as State,
  reducers: {
    // setNickname(state: State, action: { type: string; payload: string }) {
    //   state.nickname = action.payload;
    // },
  },
  extraReducers: {
    [HYDRATE]: (_: State, action) => action,
    // state.nickname = action.payload.profile.nickname;
  },
});

export default slice.reducer;

// export const { setNickname } = slice.actions;

// export function fetchNickname(name: string): AppThunk {
//   return async (dispatch) => {
//     await pause(1000);

//     dispatch(slice.actions.setNickname(name));
//   };
// }
