import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Userpage from "./pages/Userpage.jsx";
import Header from "./components/Header.jsx";
import Homepage from "./pages/Homepage.jsx";
import Authpage from "./pages/Authpage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom.js";
import UpdateProfilePage from "./components/UpdateProfilePage.jsx";
import CreatePost from "./components/CreatePost.jsx";
import Postpage from "./pages/Postpage.jsx";
import Chatpage from "./pages/Chatpage.jsx";
import Settingspage from "./pages/Settingspage.jsx";
import ForPass from "./pages/ForPass.jsx";
import ResPass from "./pages/ResPass.jsx";
import resetTokenAtom from "./atoms/resetTokenAtom.js";


function App() {
  const user = useRecoilValue(userAtom);
  const resetToken = useRecoilValue(resetTokenAtom);
  const { pathname } = useLocation();
  
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW={pathname === "/" ? {base: "620px", md: "900px"} : "620px"} >
        <Header />
        <Routes>
          <Route path="/" element={user ? <Homepage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <Authpage /> : <Navigate to="/" />} />
          <Route path="/forgot" element={!user ? <ForPass /> : <Navigate to="/" />} />
          <Route path="/reset" element={!user && resetToken ? <ResPass /> : <Navigate to="/" />} />
          {/* <Route path="/reset" element={!user ? <ResPass /> : <Navigate to="/" />} /> */}
          <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
          <Route path="/:username" element={user ? 
            (
              <>
                <Userpage/>
                <CreatePost/>
              </>
            ):(
              <Userpage />
            )
          } />
          <Route path="/:username/posts/:pid" element={<Postpage />} />
          <Route path="/chat" element={user ? <Chatpage /> : <Navigate to={"/auth"} />} />
          <Route path="/settings" element={user ? <Settingspage /> : <Navigate to={"/auth"} />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
