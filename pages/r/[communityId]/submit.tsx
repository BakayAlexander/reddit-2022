import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageContentLayout from '../../../components/Layouts/PageContentLayout';
import CreatePostForm from '../../../components/Posts/CreatePostForm';
import { auth } from '../../../firebase/clientApp';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  return (
    <PageContentLayout>
      <>
        <Box py='14px' borderBottom='1px solid white'>
          <Text>Create a post</Text>
        </Box>
        {user && <CreatePostForm user={user} />}
      </>
      <>{/* <AboutCommunity/> */}</>
    </PageContentLayout>
  );
};
export default SubmitPostPage;
