import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { firestore, storage } from '../../firebase/clientApp';
import { Post } from '../../recoil/postAtom';
import ImageUpload from './ImageUpload';
import TabItem from './TabItem';
import TextInputs from './TextInputs';

type CreatePostFormProps = {
  user: User;
};

const formTabs: TabItem[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ user }) => {
  const [selectedTad, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    //Creating a new post obj
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid!,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    //Store post in firestore. And only in success case storing an image
    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

      //Check if user load an image and store it.
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadUrl = await getDownloadURL(imageRef);

        //Updating post doc by adding imageUrl
        await updateDoc(postDocRef, {
          imageUrl: downloadUrl,
        });
      }
      //Redirect user back to community
      router.back();
    } catch (error: any) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = readerEvent => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    setTextInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Flex direction='column' bg='white' borderRadius={4} mt={2}>
      <Flex width='100%'>
        {formTabs.map(item => (
          <TabItem
            item={item}
            key={item.title}
            selected={item.title === selectedTad}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTad === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTad === 'Images & Video' && (
          <ImageUpload
            onSelectImage={onSelectImage}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <Text mr={2}>Error was appeared while creating post.</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default CreatePostForm;
