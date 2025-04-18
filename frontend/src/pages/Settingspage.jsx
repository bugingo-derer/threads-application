import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState } from 'recoil';
import useLogout from '../hooks/useLogout';

const Settingspage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if(!window.confirm("Are you sure you want to freeze your account")) return;
    try {
      const res = await fetch("api/users/freezeAccount", {
        method: "PUT",
        headers: {"Content-Type": "application/json"}
      });

      const data = await res.json();
      if(data.error)
        return showToast("Error", data.error, "error")
      
      if(data.success){
        logout();
        return showToast("Success", "Your account has been frozen", "success")
      }


    } catch (error) {
      return showToast("Error", error.message, "error")
    }
  }

  return (
    <>
      <Text my={1} fontWeight={"bold"}>Freeze your account</Text> 
      <Text my={1}>You can unfreeze your account any time by loggin in</Text> 
      <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>Freeze</Button>
    </>
  )
}

export default Settingspage