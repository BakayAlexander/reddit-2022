import { Flex } from '@chakra-ui/react';
import React from 'react';
import AuthModal from '../Modal/AuthModal';
import AuthButtons from './AuthButtons';
import LogoutButton from './LogoutButton';

type RightContentProps = {
  user: any;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify='center' align='center'>
        {user ? <LogoutButton /> : <AuthButtons />}
      </Flex>
    </>
  );
};
export default RightContent;
