import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../recoil/authModal';

type SignupFormProps = {};

const SignupForm: React.FC<SignupFormProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {};

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm(signupForm => ({
      ...signupForm,
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
        mb={2}
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{ outline: 'none', bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
      />
      <Input
        onChange={handleChangeInput}
        required
        name='confirmPassword'
        placeholder='confirm password'
        type='password'
        fontSize='10pt'
        bg='gray.50'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{ outline: 'none', bg: '#fff', border: '1px solid', borderColor: 'blue.500' }}
      />
      <Button type='submit' width='100%' height='36px' mb={2} mt={2}>
        Sign Up
      </Button>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() => {
            setAuthModalState(prev => ({
              ...prev,
              view: 'login',
            }));
          }}
        >
          Log In
        </Text>
      </Flex>
    </form>
  );
};
export default SignupForm;
