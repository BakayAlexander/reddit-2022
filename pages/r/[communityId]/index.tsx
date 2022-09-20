import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify';
import About from '../../../components/Community/About';
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Header from '../../../components/Community/Header';
import CommunityNotFound from '../../../components/Community/NotFound';
import PageContentLayout from '../../../components/Layouts/PageContentLayout';
import Posts from '../../../components/Posts/Posts';
import { firestore } from '../../../firebase/clientApp';
import { Community, communityState } from '../../../recoil/communityAtom';

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(communityState);

  useEffect(() => {
    setCommunityStateValue(prev => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, []);

  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export default CommunityPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  //Get community data
  try {
    const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        //Because I'm using a Timestamp from Firebase, Next throw a number of errors for serverside props. To prevent them I use safe json stringify.
        communityData: communityDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
          : '',
      },
    };
  } catch (error) {
    console.log(error);
  }
};
