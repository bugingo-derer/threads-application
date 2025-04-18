import { Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement,
  Stack, useColorModeValue, Avatar, Center,
  Spinner,} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import usePreviewImg from '../hooks/usePreviewImg'
import useShowToast from '../hooks/useShowToast'

const UpdateProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({ 
    name: user.name, 
    username:user.username, 
    email: user.email, 
    bio: user.bio, 
    password: ""
  });
  const initialInputs = { name: user.name, username: user.username, email: user.email, bio: user.bio, password: "",};
  const fileref = useRef(null);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl}  = usePreviewImg();
  
  const handleCancel = () => setInputs(initialInputs);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify({...inputs, profilePic:imgUrl})
      });
      const data = await res.json();

      if(data.error){
        return showToast("Error", data.error, "error")
      }
      showToast("Success", data.message, "success") 
      setUser(data.user);
      localStorage.setItem("User-threads", JSON.stringify(data.user));

    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'} my={6}>
        <Stack spacing={4} w={'full'} maxW={'md'} bg={useColorModeValue('white', 'gray.dark')} rounded={'xl'} boxShadow={'lg'} p={6} my={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>User Profile Edit</Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileref.current.click()}>Change Avatar</Button>
                <Input type='file' cursor={"pointer"} hidden ref={fileref} onChange={handleImageChange}/>
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input placeholder="John Doe" _placeholder={{ color: 'gray.500' }} type="text" value={inputs.name} onChange={e => setInputs({...inputs, name: e.target.value}) } />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
              <Input placeholder="johndoe" _placeholder={{ color: 'gray.500' }} type="text" value={inputs.username} onChange={e => setInputs({...inputs, username: e.target.value}) }/>
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input placeholder="johndoe@gmail.com" _placeholder={{ color: 'gray.500' }} type="email" value={inputs.email} onChange={e => setInputs({...inputs, email: e.target.value}) }/>
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input placeholder="your bio..." _placeholder={{ color: 'gray.500' }} type="text" value={inputs.bio} onChange={e => setInputs({...inputs, bio: e.target.value}) }/>
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input  placeholder="password" _placeholder={{ color: 'gray.500' }} type={showPassword ? 'text' : 'password'} value={inputs.password} onChange={e => setInputs({...inputs, password: e.target.value}) } />
              <InputRightElement h={'full'}>
                <Button variant={'ghost'} onClick={() => setShowPassword((showPassword) => !showPassword)}>{showPassword ? <ViewIcon /> : <ViewOffIcon />}</Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button bg={'red.400'} color={'white'} w="full" _hover={{bg: 'red.500',}} onClick={handleCancel}>Cancel</Button>

            <Button bg={'green.400'} color={'white'} w="full" _hover={{bg: 'green.500',}} type='submit' isDisabled={loading}>
              {/* {loading ? (<Spinner size={"sm"} speed={'0.65s'}/>) : "Update"} */}
              {loading ? (<Spinner size="md" />) : "Update"}
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  )
}

export default UpdateProfilePage