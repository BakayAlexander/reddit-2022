import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { authModalState } from '../../recoil/authModal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  const modalState = useRecoilValue(authModalState);

  return (
    <Flex direction='column' align='center' width='100%' mt={4}>
      {modalState.view === 'login' && <LoginForm />}
      {modalState.view === 'signup' && <SignupForm />}
    </Flex>
  );
};
export default AuthInputs;
