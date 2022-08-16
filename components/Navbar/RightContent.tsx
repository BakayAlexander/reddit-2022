import { Flex } from '@chakra-ui/react';
import React from 'react';
import AuthModal from '../Modal/AuthModal';
import AuthButtons from './AuthButtons';

type RightContentProps = {
  // user:
};

const RightContent: React.FC<RightContentProps> = () => {
  return (
    <>
      <AuthModal />
      <Flex justify='center' align='center'>
        <AuthButtons />
      </Flex>
    </>
  );
};
export default RightContent;
