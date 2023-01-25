import { atom } from 'recoil';

export const deletePostState = atom({
  key: 'deletePostState',
  default: { postId: '', postImage: '', caption: '' },
});
