import React from 'react';
import { useRecoilState } from 'recoil';
import { postState } from '../recoil/postAtom';

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = () => {};

  const onSelectPost = () => {};

  const onDeletePost = () => {};
  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};
export default usePosts;
