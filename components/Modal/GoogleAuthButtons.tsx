import { Button, Flex, Image } from '@chakra-ui/react';
import React from 'react';

const GoogleAuthButtons: React.FC = () => {
  return (
    <Flex direction='column' width='100%' mb={4}>
      <Button variant='googleButton' mb={2}>
        <Image src='/images/googlelogo.png' alt='Google logo' height='20px' mr={4} />
        Continue with Google
      </Button>

      <Button variant='googleButton'>Some other Provider</Button>
    </Flex>
  );
};
export default GoogleAuthButtons;
