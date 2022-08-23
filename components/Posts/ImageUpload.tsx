import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: string;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  onSelectImage,
  selectedFile,
  setSelectedTab,
  setSelectedFile,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex direction='column' justify='center' align='center' width='100%'>
      {selectedFile ? (
        <>
          <Image src={selectedFile} alt='Uploaded image' maxWidth='400px' maxHeight='400px' />
          <Stack direction='row' mt={4}>
            <Button height='28px' onClick={() => setSelectedTab('Post')}>
              Back to Post
            </Button>
            <Button variant='outline' height='28px' onClick={() => setSelectedFile('')}>
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          align='center'
          justify='center'
          p={20}
          border='1px dashed'
          borderColor='gray.200'
          borderRadius={4}
          width='100%'
        >
          <Button
            variant='outline'
            height='20px'
            onClick={() => {
              selectedFileRef.current?.click();
            }}
          >
            Upload
          </Button>
          <input ref={selectedFileRef} type='file' hidden onChange={onSelectImage} />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
