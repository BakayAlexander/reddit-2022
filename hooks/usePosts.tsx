import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React from 'react';
import { useRecoilState } from 'recoil';
import { firestore, storage } from '../firebase/clientApp';
import { Post, postState } from '../recoil/postAtom';

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = () => {};

  const onSelectPost = () => {};

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      //check if the image in post exists
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      //delete post document from firestore
      const postDocRef = doc(firestore, 'posts', post.id!);
      await deleteDoc(postDocRef);

      //update recoil state
      setPostStateValue(prev => ({
        ...prev,
        posts: prev.posts.filter(item => item.id !== post.id),
      }));
      return true;
    } catch (error: any) {
      return false;
    }
  };

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};
export default usePosts;
