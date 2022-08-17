import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';

const GoogleAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const handleClick = () => {
    signInWithGoogle();
  };

  return (
    <Flex direction='column' width='100%' mb={4}>
      <Button variant='googleButton' mb={2} isLoading={loading} onClick={handleClick}>
        <Image src='/images/googlelogo.png' alt='Google logo' height='20px' mr={4} />
        Continue with Google
      </Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};
export default GoogleAuthButtons;
