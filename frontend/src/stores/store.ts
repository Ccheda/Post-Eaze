import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import postsSlice from './posts/postsSlice';
import subscriptionsSlice from './subscriptions/subscriptionsSlice';
import topicsSlice from './topics/topicsSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';
import usersSlice from './users/usersSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    posts: postsSlice,
    subscriptions: subscriptionsSlice,
    topics: topicsSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
    users: usersSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
