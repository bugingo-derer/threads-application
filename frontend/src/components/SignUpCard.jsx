import {
  Flex, Box, HStack, Stack, Button,
  FormControl, FormLabel, Input, InputGroup,
  InputRightElement, Heading, Text, Link,
  useColorModeValue, useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from "../atoms/authAtom.js"
import useShowToast from '../hooks/useShowToast.js'
import userAtom from '../atoms/userAtom.js'

const SignupCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({ name: "", username: "", email: "", password: "" })
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const [loading, setLoding] = useState(false)

  const handleSignup = async () => {
    try {
      setLoding(true)
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify(inputs)
      })
      const data = await res.json();
      
      if(data.error)
        return showToast('Error', data.error, 'error');
      
      showToast('Success', data.message, 'success');
      localStorage.setItem("User-threads", JSON.stringify(data.newUser));
      setUser(data.newUser);
      
      return showToast('Success', data.message, 'success');
    } catch (error) {
      return showToast('Error', data.error, 'error');
    } finally{
      setLoding(false)
    }
  }
  
  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.dark')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="Full name" isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input type="text" onChange={(e) => setInputs({...inputs, name: e.target.value})} value={inputs.name}/>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" onChange={(e) => setInputs({...inputs, username: e.target.value})} value={inputs.username}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setInputs({...inputs, email: e.target.value})} value={inputs.email}/>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setInputs({...inputs, password: e.target.value})} value={inputs.password}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button 
                loadingText="signing in" 
                size="lg" bg={useColorModeValue("gray.600","gray.700")} 
                color={'white'} _hover={{bg: useColorModeValue("gray.700","gray.800")}}
                onClick={handleSignup}
                isLoading={loading}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}
                onClick={() => setAuthScreen("login")}
              >
                Already a user? <Link color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default SignupCard