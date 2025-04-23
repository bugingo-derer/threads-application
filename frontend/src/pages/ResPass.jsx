import {
  Box, Button, Flex, FormControl, FormLabel, Heading, Text,
  Input, useColorModeValue, FormHelperText, Spinner,
  InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import resetTokenAtom from '../atoms/resetTokenAtom';
import useShowToast from '../hooks/useShowToast';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const ResPass = () => {
  const [resetToken, setResetToken] = useRecoilState(resetTokenAtom);
  const [token, setToken] = useState('');
  const [newPass, setNewPass] = useState('');
  const [reseting, setReseting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!token || !newPass) return showToast("Error", "Please enter both token and new password", "error");

    setReseting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/resetPassword/${token}`, {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ password: newPass }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast("Success", "Password reset successfully", "success");
      navigate('/auth');
      setResetToken('');
      
    } catch (error) {
      showToast("Error", error.message || "Failed to reset password", "error");
    } finally {
      setReseting(false);
    }
  };

  return (
    <Flex minH="50vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.dark')} px={4}>
      <Box maxW="md" w="full" bg={useColorModeValue('white', 'gray.dark')} p={8} borderRadius="2xl" boxShadow="xl">
        <Heading fontSize="2xl" mb={2} textAlign="center">
          Reset Your Password
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={6} textAlign="center">
          Please check your email for a reset link and paste the token below.
        </Text>

        <FormControl mb={6}>
          <FormLabel>Confirmation Token</FormLabel>
          <Input
            type="text"
            placeholder="Paste your reset token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            borderRadius="md"
          />
          <FormHelperText>The token was sent to your email.</FormHelperText>
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              borderRadius="md"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label={showPassword ? "Hide password" : "Show password"}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" w="full" onClick={handleResetPassword} isDisabled={reseting}>
          {reseting ? <Spinner size="sm" /> : "Reset Password"}
        </Button>
      </Box>
    </Flex>
  );
};

export default ResPass;
