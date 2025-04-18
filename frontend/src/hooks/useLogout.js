import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const showToast = useShowToast();

  const logout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        }
      });
      const data = await res.json();

      if(data.error)
        return showToast("Error", data.error, 'error');
      
      localStorage.removeItem('User-threads');
      setUser(null);
      return showToast("Success", data.message, 'success')
    } catch (error) {
      return showToast("Error", error.message, 'error')
    }
  };

  return logout
}

export default useLogout