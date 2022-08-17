import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import { auth } from '../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../firebase/firebaseErrors';
import { authModalState } from '../../recoil/authModal';

type LoginFormProps = {};

const LoginForm: React.FC<LoginFormProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signInWithEmailAndPassword, user, loading, userError] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(loginForm => ({
      ...loginForm,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        onChange={handleChangeInput}
        required
        name='email'
        placeholder='email'
        type='email'
        mb={2}
        fontSize='10pt'
        bg='gray.50'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{ outline: 'none', bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
      />
      <Input
        onChange={handleChangeInput}
        required
        name='password'
        placeholder='password'
        type='password'
        fontSize='10pt'
        bg='gray.50'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{ outline: 'none', bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
      />
      {userError && (
        <Text textAlign='center' color='red' fontSize='10pt'>
          {/* Change message type to a new type */}
          {FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button type='submit' width='100%' height='36px' mb={2} mt={2} isLoading={loading}>
        Log In
      </Button>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>New here?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() => {
            setAuthModalState(prev => ({
              ...prev,
              view: 'signup',
            }));
          }}
        >
          Sign Up
        </Text>
      </Flex>
    </form>
  );
};
export default LoginForm;
