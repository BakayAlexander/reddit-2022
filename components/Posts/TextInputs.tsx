import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

type TextInputsProps = {
  textInputs: { title: string; body: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
  handleCreatePost,
  loading,
}) => {
  return (
    <Stack spacing={3} width='100%'>
      <Input
        value={textInputs.title}
        onChange={onChange}
        name='title'
        fontSize='10pt'
        borderRadius={4}
        placeholder='Title'
        _placeholder={{ color: 'gray.500' }}
      />
      <Textarea
        onChange={onChange}
        value={textInputs.body}
        name='body'
        fontSize='10pt'
        borderRadius={4}
        placeholder='Text optional'
        _placeholder={{ color: 'gray.500' }}
        height='100px'
      />
      <Flex justify='flex-end'>
        <Button
          height='34px'
          px='30px'
          disabled={!textInputs.title}
          onClick={handleCreatePost}
          isLoading={loading}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
