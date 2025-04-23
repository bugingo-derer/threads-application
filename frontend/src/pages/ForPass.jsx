import React, { useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Divider,
  useColorMode,
  Spinner,
  Flex,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState } from 'recoil'
import axiosInstance from '../utils/axios.js'
import resetTokenAtom from '../atoms/resetTokenAtom.js'

const ForPass = () => {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false);
  const { colorMode } = useColorMode();
  const showToast = useShowToast();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [resetToken, setResetToken] = useRecoilState(resetTokenAtom);

  const handleSendToken = async () => {
    setSending(true);
    try {
      const validEmail = emailRegex.test(email);
      if (!email || !validEmail) throw new Error('Empty or Invalid email');

      const res = await axiosInstance.post('/users/forgotPassword', { email });
      const data = res.data;
      if (data.error) throw new Error(data.error);

      setResetToken(data.resetUrl.split('/').pop());

      showToast("Success", "Check your email for the password reset link.", "success")
    } catch (error) {
      console.log(error);
      showToast('Error', error.message, 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <Flex minH="50vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.dark')} px={4}>
      <Box maxW="md" w="full" bg={useColorModeValue('white', 'gray.dark')} p={8} borderRadius="xl" boxShadow="2xl">
        <Heading fontSize="2xl" mb={2} textAlign="center">
          Forgot Password
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={6} textAlign="center">
          Enter your email and we’ll send you a link to reset your password
        </Text>

        <FormControl>
          <FormLabel>Email address</FormLabel>
          <InputGroup>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} borderRadius="md"/>
            <InputRightElement onClick={() => setEmail('')} cursor="pointer" borderRadius="md"_hover={{ bg: colorMode === 'light' ? 'blue.500' : 'blue.200', color: 'black', transition: 'all .3s ease',}}>
              <CloseIcon boxSize={3} />
            </InputRightElement>
          </InputGroup>

          <Button mt={4} colorScheme="blue" w="full" onClick={handleSendToken} isDisabled={!email || sending}>
            {sending ? (
              <Flex align="center" justify="center" gap={2}>
                <Spinner size="sm" />
                <Text>Sending...</Text>
              </Flex>
            ) : (
              'Send Token'
            )}
          </Button>

          {resetToken && (
            <Link as={RouterLink} to="/reset" display="block" textAlign="center" mt={4} fontSize="sm" fontWeight="semibold" color="blue.400" _hover={{ color: 'blue.600', textDecoration: 'underline' }}>
              Proceed to reset your password
            </Link>
          )}
        </FormControl>
      </Box>
    </Flex>
  )
}

export default ForPass
