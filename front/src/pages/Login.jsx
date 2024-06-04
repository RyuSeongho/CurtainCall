import React, { useState } from 'react';
import CustomContainer from '../components/ContainerComp/CustomContainer';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import LoginButton from '../components/LoginPageComp/LoginButton'; // Adjust the path accordingly
import UsernameInputForm from '../components/LoginPageComp/IDInputForm'; // Adjust the path accordingly
import PasswordInputForm from '../components/LoginPageComp/PasswordInputForm'; // Adjust the path accordingly
import api from '../axios'
import {useRecoilState} from "recoil";
import {loginState, usernameState} from "../atom/atom";

import ImageSlider from '../components/StartPageComp/ImageSlider';

import slide1 from '../img/slide1.jpg';
import slide2 from '../img/slide2.jpg';

import {
    useMediaQuery,
    useTheme,
} from "@mui/material";


function Login() {
    const navigate = useNavigate();
    const [userId, setuserId] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useRecoilState(loginState);
    const [username, setUsername] = useRecoilState(usernameState);

    const images = [
        slide1,
        slide2,
        // 추가 이미지 경로를 여기에 입력하세요.
      ];

    const fetchUsername = async () => {
            try {
                const response = await api.get('/accounts/dj-rest-auth/user/');
                console.log('API Response:', response.data);
                setUsername(response.data.pk);
            } catch (error) {
                console.error('Failed to fetch username:', error);
            }
    };

    const handleLogin = async () => {
        console.log('Logging in with:', { userId, password });

        try {
            const response = await api.post('accounts/dj-rest-auth/login/', {
                email: userId,
                password: password
            });
            console.log('Login successful:', response.data);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            fetchUsername();
            setLogin(true);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response.data);
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        console.log('Google login successful:', response);
        try {
            const res = await api.post('/auth/complete/google-oauth2/', {
                access_token: response.credential,
                state: response.state  // state 매개변수 포함
            });
            if (res.data.key) {
                navigate('/');
            } else {
                console.error('Login failed:', res.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const maxhe_ = isMobile ? '20%': '67%';

    return (
        <CustomContainer>
            <ImageSlider images={images} interval={9000} maxhe={maxhe_} /> {/* 이미지 슬라이더 컴포넌트를 추가합니다. */}
            <div className="buttonWrapper" style={{ display: 'flex', justifyContent: 'top', flexDirection: 'column', marginLeft: '10px' }}>
                <div style={{ width: '100%', height:'2px', marginBottom:'2.5%'}}></div>
                <UsernameInputForm username={userId} onUsernameChange={setuserId} placeholder="ID" />
                <div style={{ width: '100%', height:'2px', marginBottom:'1.5%'}}></div>
                <PasswordInputForm password={password} onPasswordChange={setPassword} />
                <div style={{ width: '100%', height:'2px', marginBottom:'1.5%'}}></div>

                <LoginButton onClick={handleLogin}>Login</LoginButton>
                <div style={{ width: '100%', height:'2px', marginBottom:'1.5%'}}></div>

                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onFailure={(response) => console.error('Google login failed:', response)}
                />
            </div>

        </CustomContainer>
    );
}

export default Login;
