import React, { useEffect, useState } from 'react'
import "./Login.css"
import TextCarousel from "./textcarousel";
import InputField from '../InputField';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/firebase';
import { signInWithEmailAndPassword ,sendPasswordResetEmail} from 'firebase/auth'; 


export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        console.log('User logged in successfully!');
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err.message);
      setError('Invalid email or password. Please try again.');
    }
  };

   // Handle password reset request
   const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth,resetEmail);
      alert('Password reset link sent! Check your inbox.');
      setShowResetModal(false); // Close modal
    } catch (err) {
      console.error('Error sending password reset email:', err.message);
      alert('Error sending reset email. Please try again.');
    }
  };
  return (
    <>
    <div className='login-page'>
        <div className='left-part bg-[#005899] w-[60vw] h-[100vh] '>
          <div className='header-container flex  '>
          <div className='flex justify-center items-center'>
          <img src='/images/AcctAbility_transparent.png' alt='AcctAbility Logo' className="acct-logo" />

          </div>
          
          <div className=' flex flex-col justify-center items-start h-[200px]'>
            <h1 className="brand-title flex justify-center items-center text-white">
          AcctAbility 
        </h1>
        <span className="amplify-line flex justify-center items-center">Automate the Boring.</span>
            <span className='amplify-line'>Amplify the Smart.</span>
          </div>
          </div>
          <div className=' text-block flex flex-col justify-start items-center w-[100%]'>
          
        
         <div className="amp-line ">
        Make your compliances fantastic!
      </div>
      <TextCarousel/>
      
    
          </div>
          </div>
        
        <div className='right-part w-[40vw] '>

        <div className="login-wrapper">
    <div className="login-container">
      <div className="form-section">
        <h2 className="form-title">Log in</h2>
        <p className="separator"><span></span></p>
        
        <form  onSubmit={handleLogin} className="login-form">
          <InputField
            type="email"
            placeholder="Email address"
            // icon="mail"
            
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
          <InputField
            type="password"
            placeholder="Password"
            // icon="lock"
            // value={password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <a href="#" className="forgot-password-link" onClick={() => setShowResetModal(true)}>
            Forgot password?
          </a>
          <button type="submit" className="login-button">Log In</button>
        </form>
        
        <p className="signup-prompt">
          Don&apos;t have an account? <Link to="#" className="signup-link">Contact-ADMIN</Link>
        </p>
        
        <p className="license-agreement">
          By clicking Sign In, you agree to our <Link to="/license" className="license-link">License Agreement</Link>.
        </p>
        
        <div className="footer">
          <p>Copyright © 2025 AcctAbility Outsourcing Private Limited. All rights reserved.</p>
        </div>
        
        <p className="text-center text-xs text-gray-600 mt-2">
          Your data is protected and secured under our privacy policy. We value your privacy and ensure your information is handled with utmost care.
        </p>
      </div>
      
    </div>
  </div>
        </div>

         {/* Modal for Password Reset */}
  {showResetModal && (
    <div className="modal ">
      <div className="modal-content flex flex-col justify-around items-center gap-2 w-[35vw]">
        <h2 className='text-2xl '>Reset Your Password</h2>
        <input
          type="email"
          placeholder="Enter your email address"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
        <span className='w-[100%] flex justify-center items-center gap-4'>
        <button onClick={handlePasswordReset}>Send Reset Link</button>
        <button onClick={() => setShowResetModal(false)}>Close</button>
        </span>
      </div>
    </div>
  )}
</div>
          
        
    
    </>
  )
}
