import { Button } from '@chakra-ui/react';
import React from 'react';

const AuthButtons: React.FC = () => {
  return (
    <>
      <Button
        onClick={() => {}}
        variant='outline'
        height='28px'
        mr={2}
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
      >
        Log In
      </Button>
      <Button
        onClick={() => {}}
        height='28px'
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
