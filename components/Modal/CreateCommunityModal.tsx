import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { auth, firestore } from '../../firebase/clientApp';
import useDirectory from '../../hooks/useDirectory';

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ open, handleClose }) => {
  const router = useRouter();
  const { toggleMenuOpen } = useDirectory();
  const [communityInput, setCommunityInput] = useState('');
  const [communityType, setCommunityType] = useState('public');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const charsRemaining = 21;

  const handleCommunityTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError('');

    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityInput) || communityInput.length < 3) {
      setError(
        'Community name must be at least 3 characters, and can only contain letters, numbers, and underscores.'
      );
      return;
    }

    setLoading(true);

    try {
      const communityDocRef = doc(firestore, 'communities', communityInput);

      //When user creates a new community, he would add it at his community list. To do this, I take transactions function from firebase.
      await runTransaction(firestore, async transaction => {
        //Checking if community with that name already exists
        const communityDoc = await transaction.get(communityDocRef);

        if (communityDoc.exists()) {
          setError('Community with that name already exists.');
          return;
        }

        //Creating a new community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        //Setting community to a users base and adding him admin rights
        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityInput), {
          communityId: communityInput,
          isModerator: true,
        });
      });
      toggleMenuOpen();
      handleClose();
      router.push(`r/${communityInput}`);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={open}
        onClose={handleClose}
        size='xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display='flex'
            flexDirection='column'
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box px={3}>
            <ModalCloseButton />
            <ModalBody
              display='flex'
              flexDirection='column'
              py={2}
            >
              <Text
                fontWeight={600}
                fontSize={15}
              >
                Name
              </Text>
              <Text
                fontSize={11}
                color='gray.500'
              >
                Community names including capitalization cannot be changed.
              </Text>
              {/* I use this wierd method to not use absolute position */}
              <Text
                position='relative'
                top='28px'
                left='10px'
                width='20px'
                color='gray.400'
              >
                r/
              </Text>
              <Input
                size='sm'
                pl='22px'
                position='relative'
                color='gray.700'
                value={communityInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value.length > charsRemaining) return;
                  setCommunityInput(e.target.value);
                }}
              />
              <Text
                color='gray.500'
                fontSize='9pt'
              >
                {charsRemaining - communityInput.length} Characters remaining
              </Text>
              <Text
                fontSize='9pt'
                color='red'
                pt={1}
              >
                {error}
              </Text>
              <Box my={4}>
                <Text
                  fontWeight={600}
                  fontSize={15}
                >
                  Community type
                </Text>
                {/* <Checkbox/> */}
                <Stack spacing={2}>
                  <Checkbox
                    name='public'
                    isChecked={communityType === 'public'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex align='center'>
                      <Icon
                        as={BsFillPersonFill}
                        color='gray.500'
                        mr={2}
                      />
                      <Text
                        fontSize='10pt'
                        mr={1}
                      >
                        Public
                      </Text>
                      <Text
                        fontSize='8pt'
                        color='gray.500'
                      >
                        Anyone can can view posts and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name='restricted'
                    isChecked={communityType === 'restricted'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex align='center'>
                      <Icon
                        as={BsFillEyeFill}
                        color='gray.500'
                        mr={2}
                      />
                      <Text
                        fontSize='10pt'
                        mr={1}
                      >
                        Restricted
                      </Text>
                      <Text
                        fontSize='8pt'
                        color='gray.500'
                      >
                        Anyone can can view this community, but only approved users can post.
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name='private'
                    isChecked={communityType === 'private'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex align='center'>
                      <Icon
                        as={HiLockClosed}
                        color='gray.500'
                        mr={2}
                      />
                      <Text
                        fontSize='10pt'
                        mr={1}
                      >
                        Private
                      </Text>
                      <Text
                        fontSize='8pt'
                        color='gray.500'
                      >
                        Only approved users can view and submit to this community.
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter
            bg='gray.100'
            borderRadius='0px 0px 10px 10px'
          >
            <Button
              variant='outline'
              height='30px'
              colorScheme='blue'
              mr={3}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              height='30px'
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
