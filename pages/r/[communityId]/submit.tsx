import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import About from '../../../components/Community/About';
import PageContentLayout from '../../../components/Layouts/PageContentLayout';
import CreatePostForm from '../../../components/Posts/CreatePostForm';
import { auth } from '../../../firebase/clientApp';
import useCommunityData from '../../../hooks/useCommunityData';
import { communityState } from '../../../recoil/communityAtom';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();

  return (
    <PageContentLayout>
      <>
        <Box
          py='14px'
          borderBottom='1px solid white'
        >
          <Text>Create a post</Text>
        </Box>
        {user && (
          <CreatePostForm
            user={user}
            communityImageUrl={communityStateValue.currentCommunity?.imageUrl}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContentLayout>
  );
};
export default SubmitPostPage;
