import { atom } from 'recoil';

export const likesState = atom({
  key: 'likesState',
  default: { postId: '', commentId: '', type: '' },
});
