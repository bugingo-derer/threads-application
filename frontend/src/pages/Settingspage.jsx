import { Button, Divider, Text } from '@chakra-ui/react'
import React from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState } from 'recoil';
import useLogout from '../hooks/useLogout';
import soundSettings from '../hooks/useSoundSettings';

const Settingspage = () => {
  const showToast = useShowToast();
  const logout = useLogout();
  const [sound, setSound] = useRecoilState(soundSettings);

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

  const soundConfigure = () => {
    setSound(!sound);
  }

  return (
    <>
      <Text my={1} fontWeight={"bold"}>Freeze your account</Text> 
      <Text my={1}>You can unfreeze your account any time by loggin in</Text> 
      <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>Freeze</Button>

      <Divider my={4} color={'gray.dark'}/>

      <Text my={1} fontWeight={"bold"}>Sound Settings</Text> 
      <Text my={1}>Hear a notification when there is a new message sent.</Text> 
      <Button size={"sm"} colorScheme={sound ? 'blue' : 'red'} onClick={soundConfigure} title={`Click to turn sound ${sound ? "off" : "on"}`}>{sound ? "off" : "on"}</Button>

    </>
  )
}

export default Settingspage