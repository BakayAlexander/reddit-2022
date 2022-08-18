import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../recoil/authModalAtom';

const AuthButtons: React.FC = () => {
  const setModalState = useSetRecoilState(authModalState);

  return (
    <>
      <Button
        onClick={() => {
          setModalState({ open: true, view: 'login' });
        }}
        variant='outline'
        height='28px'
        mr={2}
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
      >
        Log In
      </Button>
      <Button
        onClick={() => {
          setModalState({ open: true, view: 'signup' });
        }}
        height='28px'
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
