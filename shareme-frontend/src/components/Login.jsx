import { isButtonElement } from 'react-router-dom';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/MainCoon.mp4';
import logo from '../assets/cat2.png';

import { createClient, getClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production', // You may need to adjust this based on your Sanity setup
  token: process.env.REACT_APP_SANITY_TOKEN,
  useCdn: false, // Disable the CDN for development
  apiVersion: '2023-01-01'
});


const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    if (response.profileObj) {
      localStorage.setItem('user', JSON.stringify(response.profileObj));
  
      const { name, googleId, imageUrl } = response.profileObj;
  
      const doc = {
        _id: googleId,
        _type: 'user',
        userName: name,
        image: imageUrl,
      };

      client.createIfNotExists(doc)
        .then(() => {
          navigate('/', { replace: true })
        })
  
      // Now you can do something with the 'doc' object or take further actions
    } else {
      // Handle the case where profileObj is undefined
      console.error('Profile object is undefined in the response');
    }
  };
  



  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      Login
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width="260px" alt='logo' />
          </div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            render={(renderProps) => (
              <button
                type='button'
                className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <FcGoogle className='mr-4' /> Sign in with Google
              </button>
            )}
            onSuccess={(response) => {
              console.log('Google login success:', response);
              responseGoogle(response);
            }}
            onFailure={(response) => {
              console.error('Google login failure:', response);
              responseGoogle(response);
            }}
            cookiePolicy='single_host_origin'
          />

          <div className='shadow-2xl'></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
