import { Button } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../../firebase/clientApp';

const LogoutButton: React.FC = () => {
  return (
    <>
      <Button onClick={() => signOut(auth)}>Log out</Button>
    </>
  );
};
export default LogoutButton;
