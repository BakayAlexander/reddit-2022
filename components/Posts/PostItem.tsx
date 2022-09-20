import React, { useState } from 'react';

import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';

import moment from 'moment';
import { Post } from '../../recoil/postAtom';
import { useRouter } from 'next/router';

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
}) => {
  const router = useRouter();
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState('');

  const singlePostPage = !onSelectPost;

  const handleDelete = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setLoadingDelete(true);
    try {
      const response = await onDeletePost(event, post);
      if (!response) {
        throw new Error('Error deleting post');
      }
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Flex
      border='1px solid'
      bg='white'
      borderColor={singlePostPage ? 'white' : 'gray.300'}
      borderRadius={singlePostPage ? '4px 4px 0px 0px' : 4}
      _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction='column'
        align='center'
        bg={singlePostPage ? 'none' : 'gray.100'}
        p={2}
        width='40px'
        borderRadius={singlePostPage ? '0' : '3px 0px 0px 3px'}
      >
        <Icon
          as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          cursor='pointer'
          fontSize={22}
          onClick={event => onVote(event, post, 1, post.communityId)}
        />
        <Text fontSize='9pt'>{post.voteStatus}</Text>
        <Icon
          as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          cursor='pointer'
          fontSize={22}
          onClick={event => onVote(event, post, -1, post.communityId)}
        />
      </Flex>
      <Flex
        direction='column'
        width='100%'
      >
        {error && (
          <Alert status='error'>
            <AlertIcon />
            <Text mr={2}>Error was appeared while deleting a post.</Text>
          </Alert>
        )}
        <Stack
          spacing={1}
          p='10px'
        >
          {/* Home page check */}
          <Stack
            direction='row'
            spacing={0.6}
            align='center'
            fontSize='9pt'
          >
            <Text>
              Posted by u/{post.creatorDisplayName}{' '}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text
            fontSize='12pt'
            fontWeight={600}
          >
            {post.title}
          </Text>
          <Text fontSize='10pt'>{post.body}</Text>
          {post.imageUrl && (
            <Flex
              justify='center'
              align='center'
            >
              {loadingImage && (
                <Skeleton
                  height='200px'
                  width='100%'
                  borderRadius={4}
                />
              )}
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
        <Flex
          ml={1}
          mb={0.5}
          color='gray.500'
        >
          <Flex
            align='center'
            p='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon
              as={BsChat}
              mr={2}
            />
            <Text fontSize='9pt'>{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align='center'
            p='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon
              as={IoArrowRedoOutline}
              mr={2}
            />
            <Text fontSize='9pt'>Share</Text>
          </Flex>
          <Flex
            align='center'
            p='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon
              as={IoBookmarkOutline}
              mr={2}
            />
            <Text fontSize='9pt'>Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align='center'
              p='8px 10px'
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor='pointer'
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size='sm' />
              ) : (
                <>
                  <Icon
                    as={AiOutlineDelete}
                    mr={2}
                  />
                  <Text fontSize='9pt'>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
