import {
  Flex,Box,  Stack, Button,
  FormControl, FormLabel, Input, InputGroup,
  InputRightElement, Heading,Text, Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from "../atoms/authAtom.js"
import userAtom from '../atoms/userAtom.js'
import useShowToast from '../hooks/useShowToast.js'
import { SyncLoader } from 'react-spinners/SyncLoader'
import { useNavigate } from 'react-router-dom'

const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const showToast = useShowToast();
  const [loading, setLoding] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoding(true);
      const res = await fetch("/api/users/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: inputs?.username,
          password: inputs?.password
        })
      });
      const data = await res.json();
      
      if(data.error)
        return showToast("Error", data.error, "error");
      
      localStorage.setItem("User-threads", JSON.stringify(data.user));
      setUser(data.user);
      return showToast("success", data.message, "success");
    } catch (error) {
      return showToast("Error", data.error, "error");
    } finally{
      setLoding(false);
    }
  }

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        <Box 
          rounded={'lg'} boxShadow={'lg'} p={8} 
          bg={useColorModeValue('white', 'gray.dark')} 
          w={{ base: "full", sm: "450px" }}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="email" 
                onChange={e => setInputs({...inputs, username: e.target.value})}
                value={inputs.username}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} 
                  value={inputs.password}
                  onChange={e => setInputs({...inputs, password: e.target.value})}
                />
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
                loadingText="logging in" 
                size="lg" bg={useColorModeValue("gray.600","gray.700")} 
                color={'white'} _hover={{bg: useColorModeValue("gray.700","gray.800")}}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have account? <Link color={'blue.400'}
                 onClick={() => setAuthScreen("signup")}
                >Sign up</Link>
              </Text>
              <Text align={'center'}>
                {/* <Link color={'blue.400'} onClick={() => navigate('/forgot')}>Forgot your password</Link> */}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default LoginCard