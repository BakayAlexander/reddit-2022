import React, { useState } from 'react';

import { Flex, Icon, Image, position, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react';
import { NextRouter } from 'next/router';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';

import { Post } from '../../recoil/postAtom';
import moment from 'moment';
import { GrAnalytics } from 'react-icons/gr';

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: () => void;
  onDeletePost: () => void;
  onSelectPost: () => void;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <Flex
      border='1px solid'
      bg='white'
      borderColor='gray.300'
      borderRadius={4}
      _hover={{ borderColor: 'gray.500' }}
      cursor='pointer'
      onClick={onSelectPost}
    >
      <Flex direction='column' align='center' bg='gray.100' p={2} width='40px' borderRadius={4}>
        <Icon
          as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          cursor='pointer'
          fontSize={22}
          onClick={onVote}
        />
        <Text fontSize='9pt'>{post.voteStatus}</Text>
        <Icon
          as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          cursor='pointer'
          fontSize={22}
          onClick={onVote}
        />
      </Flex>
      <Flex direction='column' width='100%'>
        <Stack spacing={1} p='10px'>
          {/* Home page check */}
          <Stack direction='row' spacing={0.6} align='center' fontSize='9pt'>
            <Text>
              Posted by u/{post.creatorDisplayName}{' '}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize='12pt' fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize='10pt'>{post.body}</Text>
          {post.imageUrl && (
            <Flex justify='center' align='center'>
              {loadingImage && <Skeleton height='200px' width='100%' borderRadius={4} />}
              <Image
                src={post.imageUrl}
                alt='Post image'
                maxHeight='460px'
                display={loadingImage ? 'none' : 'unset'}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color='gray.500'>
          <Flex
            align='center'
            p='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize='9pt'>{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align='center'
            p='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize='9pt'>Share</Text>
          </Flex>
          <Flex
            align='center'
            p='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize='9pt'>Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align='center'
              p='8px 10px'
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor='pointer'
              onClick={onDeletePost}
            >
              <Icon as={AiOutlineDelete} mr={2} />
              <Text fontSize='9pt'>Delete</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
