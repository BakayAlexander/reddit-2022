import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Image, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import React from 'react';
import { TiHome } from 'react-icons/ti';
import useDirectory from '../../hooks/useDirectory';
import Communities from './Communities';

const DirectoryMenu: React.FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor='pointer'
        padding='0px 6px'
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
        mr={{ base: 1, md: 2 }}
        ml={{ base: 0, md: 2 }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align='center'
          justify='space-between'
          width={{ base: 'auto', md: '200px' }}
        >
          <Flex align='center'>
            {directoryState.selectedMenuItem.imageUrl ? (
              <Image
                src={directoryState.selectedMenuItem.imageUrl}
                borderRadius='full'
                boxSize='24px'
                mr={2}
                alt='Community image'
              />
            ) : (
              <Icon
                as={directoryState.selectedMenuItem.icon}
                color={directoryState.selectedMenuItem.iconColor}
                fontSize={24}
                mr={{ base: 1, md: 2 }}
              />
            )}

            <Flex display={{ base: 'none', md: 'flex' }}>
              <Text
                fontSize='10pt'
                fontWeight={600}
              >
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
        {/* <Somemore/> */}
      </MenuList>
    </Menu>
  );
};
export default DirectoryMenu;
