import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import PageContentLayout from '../../../components/Layouts/PageContentLayout';
import CreatePostForm from '../../../components/Posts/CreatePostForm';

const SubmitPostPage: React.FC = () => {
  return (
    <PageContentLayout>
      <>
        <Box py='14px' borderBottom='1px solid white'>
          <Text>Create a post</Text>
        </Box>
        <CreatePostForm />
      </>
      <>{/* <AboutCommunity/> */}</>
    </PageContentLayout>
  );
};
export default SubmitPostPage;
