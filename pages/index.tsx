import { Stack } from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import CreatePostLink from '../components/Community/CreatePostLink';
import Recommendations from '../components/Community/Recomendations';
import PageContentLayout from '../components/Layouts/PageContentLayout';
import PostItem from '../components/Posts/PostItem';
import PostLoader from '../components/Posts/PostLoader';
import { auth, firestore } from '../firebase/clientApp';
import useCommunityData from '../hooks/useCommunityData';
import usePosts from '../hooks/usePosts';
import { communityState } from '../recoil/communityAtom';
import { Post, PostVote } from '../recoil/postAtom';

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { setPostStateValue, postStateValue, onSelectPost, onDeletePost, onVote } = usePosts();
  const { communityStateValue } = useCommunityData();

  const buildUserHomeFeed = async () => {
    setLoading(true);

    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(snippet => snippet.communityId);
        const postQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', myCommunityIds),
          limit(20)
        );

        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue(prev => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        //If user didn't join any community yet show him all posts
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(20)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map(post => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds)
      );
      const postVotesDocs = await getDocs(postVotesQuery);
      const postVotes = postVotesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPostStateValue(prev => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();

    //Clean up func
    return () => {
      setPostStateValue(prev => ({ ...prev, postVotes: [] }));
    };
  }, [user, postStateValue.posts]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map(post => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(item => item.postId === post.id)?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>
        <Recommendations />
      </>
    </PageContentLayout>
  );
};

export default Home;
