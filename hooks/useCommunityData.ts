import { getDocs, collection, writeBatch, doc, increment } from 'firebase/firestore';
import { Community, communityState, CommunitySnippet } from './../recoil/communityAtom';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/clientApp';

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const joinCommunity = async (communityData: Community) => {
    //Creating a new communitySnippet using transaction batch
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageUrl || '',
      };

      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id),
        newSnippet
      );
      //And updating number of members in community

      batch.update(doc(firestore, 'communities', communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId));

      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(item => item.communityId !== communityId),
      }));
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
    //Check is user sign in. And if not open sign in modal.
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    try {
      setLoading(true);

      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      //Converting snippetDocs to array  of snippets
      const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() }));
      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Get snippets when application loads
  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    handleJoinOrLeaveCommunity,
    loading,
    error,
  };
};

export default useCommunityData;
