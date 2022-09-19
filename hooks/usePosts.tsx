import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { auth, firestore, storage } from '../firebase/clientApp';
import { authModalState } from '../recoil/authModalAtom';
import { communityState } from '../recoil/communityAtom';
import { Post, postState, PostVote } from '../recoil/postAtom';

const usePosts = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommuinty = useRecoilValue(communityState).currentCommuinty;
  const setAuthModalState = useSetRecoilState(authModalState);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    if (!user?.uid) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id);
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`));
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`);

        if (existingVote.voteValue === vote) {
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id);

          batch.delete(postVoteRef);

          voteChange = -1;
        } else {
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIndex = postStateValue.postVotes.findIndex(vote => vote.id === existingVote.id);
          updatedPostVotes[voteIndex] = { ...existingVote, voteValue: vote };

          batch.update(postVoteRef, { voteValue: vote });

          voteChange = 2 * vote;
        }
      }
      const postRef = doc(firestore, 'posts', post.id!);

      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();

      const postIndex = postStateValue.posts.findIndex(item => item.id === post.id);
      updatedPosts[postIndex] = updatedPost;

      setPostStateValue(prev => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
    } catch (error) {
      console.log(error);
    }
  };

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

  const getCommunityPosts = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, 'users', `${user?.uid}/postVotes`),
      where('communityId', '==', communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPostStateValue(prev => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, 'users', `${user?.uid}/postVotes`),
      where('communityId', '==', communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setPostStateValue(prev => ({ ...prev, postVotes: postVotes as PostVote[] }));
  };

  useEffect(() => {
    if (!currentCommuinty?.id || !user) return;
    getCommunityPostVotes(currentCommuinty?.id);
  }, [currentCommuinty, user]);

  useEffect(() => {
    if (!user) {
      setPostStateValue(prev => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};
export default usePosts;
