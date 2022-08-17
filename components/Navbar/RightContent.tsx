import { Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import AuthModal from '../Modal/AuthModal';
import AuthButtons from './AuthButtons';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify='center' align='center'>
        {user ? <Icons /> : <AuthButtons />}
      </Flex>
      <UserMenu user={user} />
    </>
  );
};
export default RightContent;
