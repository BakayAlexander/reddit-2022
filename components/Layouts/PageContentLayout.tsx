import { Flex } from '@chakra-ui/react';
import React from 'react';

type PageContentLayoutProps = {
  children: React.ReactElement[];
};

const PageContentLayout: React.FC<PageContentLayoutProps> = ({ children }) => {
  return (
    <Flex justify='center' py='16px'>
      <Flex width='95%' justify='center' maxWidth='860px'>
        <Flex direction='column' width={{ base: '100%', md: '65%' }} mr={{ base: 0, md: 6 }}>
          {children && children[0]}
        </Flex>
        <Flex direction='column' display={{ base: 'none', md: 'flex' }} flexGrow={1}>
          {children && children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContentLayout;
