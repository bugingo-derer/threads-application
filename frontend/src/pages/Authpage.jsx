import { useRecoilValue } from "recoil"
import authScreenAtom from "../atoms/authAtom.js"
import LoginCard from "../components/LoginCard.jsx"
import SignupCard from "../components/SignUpCard.jsx"

const Authpage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <>
      {authScreenState == "login" ? <LoginCard /> : <SignupCard />}
    </>
  )
}

export default Authpage