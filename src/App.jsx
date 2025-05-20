
import { BrowserRouter, Outlet } from "react-router-dom";
// import Loader from "./components/Loader";
// import { auth } from './Firebase/firebase'; // Import Firebase authentication
// import { createContext, useEffect, useState } from "react";
// import SideBar from "./Components/sidebar";

import SideNav from "./Components/SideNav"
import { Home, Login } from "@mui/icons-material";
import { LoginPage } from "./Components/LoginPage/Login";
import NavTop from "./Components/NavTop";
import HomePg from "./Components/Dashboard/HomePg";
import './index.css'



// export const ToggledContext = createContext(null);



function App() {
  // const [theme, colorMode] = useState();
  // const [toggled, setToggled] = useState(false);
  // const values = { toggled, setToggled };

  // const [user, setUser] = useState(null); // State to store user
  // const [loading, setLoading] = useState(true); // Loading state for auth check
  // const [showLoader, setShowLoader] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setUser(user); // Set user to state if authenticated
  //     setLoading(false); // Stop loading once the auth state is checked
  //       // Show the loader for 3 seconds after auth state is checked
  //       setTimeout(() => {
  //         setShowLoader(false);
  //       }, 3000);
  //   });

  //   // Cleanup listener on unmount
  //   return () => unsubscribe();
  // }, []);

  // if (loading || showLoader) {
  //   // Optionally, show a loading indicator while checking the auth state
  //    return <Loader />; 
  // }
  

  return (
    <>
    <BrowserRouter>
    {/* <ToggledContext.Provider value={values}>
    <SideBar/>
    </ToggledContext.Provider> */}
    
    <HomePg/>
    
    
    </BrowserRouter>
  
     
    
    </>
  )
}

export default App
