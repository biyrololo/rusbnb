import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Input } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Footer from './MobileFooter';
import {setTitle, titles, checkUserParams} from './Functions';

const CurButton = styled(Button)({
    width: '50%', borderRadius: '0', backgroundColor: 'white', ":hover": {backgroundColor: 'white'},
    fontSize: '1em',
    height: '2.5em'
}),
OtherButton = styled(Button)({
    width: '50%', borderRadius: '0',
    fontSize: '1em',
    height: '2.5e'
}),
LoginButton = styled(Button)({
    width: '75%',
    marginTop: '5em',
    fontSize: '1em'
}),
MainBox = styled(Box)({
    width: '85vw', margin: 'auto', marginTop: '10vh', borderRadius: '15px', backgroundColor: 'white',minHeight: '30vh',
    paddingBottom: '2rem',
    minWidth: '250px',
}),
InputsBox = styled(Box)({
    display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center'
}),
InputsFormControl = styled(FormControl)({
    width: '80%'
}),
SwitchBox = styled(Box)({
    display: 'flex', marginBottom: '3rem'
});

/**
 * Страница с входом/регистрацией для мобильных устройств
 */
export default function MobileLoginPage(){
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [login, setLogin] = React.useState(true);
    localStorage.setItem('isLogin', 'false');
    localStorage.setItem('username', '');
    localStorage.setItem('password', '');
    localStorage.setItem('userId', '');

    const [username, setUN] = React.useState('');
    const [password, setPass] = React.useState('');

    React.useEffect(()=>{setTitle(titles.login)}, []);

    /**
     * Выполняет вход в аккаунт
     */
    const loginAcc = ()=>{
        if(checkUserParams(username, password)) return;
        axios.post('/login', { 
                'username': username,
                'password': password
            })
        .then(res=>{    
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('userId', String(res.data.access_token));
            navigate('/', {state: {loggedIn: true}});
        })
        .catch((error) => {
            if(!error.response) toast.error('Ошибка на сервере. '+error)
            else if (error.response!.status === 401){
                toast.error(`Неверные данные`);
            }
            else{
                toast.error('Ошибка на сервере. '+error)
            }
          });
    };
    
    /**
     * Регестрирует пользователя
     */
    const register = ()=>{
        if(checkUserParams(username, password)) return;
        axios.post('/register', {
                'username': username,
                'password': password
            })
        .then(res=>{    
            toast.success('Пользователь зарегистрирован')
        })
        .catch((error) => {
            if(!error.response) toast.error('Ошибка на сервере. '+error)
            else if (error.response!.status === 400){
                toast.error(`Пользователь с таким именем уже существует`);
            }
            else{
                toast.error('Ошибка на сервере. '+error)
            }
          });
    }

    return (
        <>
    <MainBox>

        <SwitchBox>
            {
                login?(
                    <>
                    <CurButton sx={{borderTopLeftRadius: '15px'}} variant="outlined" color="secondary">Вход</CurButton>
                    <OtherButton sx={{borderTopRightRadius: '15px'}} variant="contained" onClick={()=>{setLogin(false)}} color="secondary" id="switch-to-register-btn">Регистрация</OtherButton></>):
                    (
                    <>
                    <OtherButton sx={{borderTopLeftRadius: '15px'}} variant="contained" onClick={()=>{setLogin(true)}} color="secondary" id="switch-to-login-btn">Вход</OtherButton>
                    <CurButton sx={{borderTopRightRadius: '15px'}} variant="outlined" color="secondary">Регистрация</CurButton>
                    </>
                    )
            }

        </SwitchBox>
        <InputsBox>
            <Typography sx={{fontSize: '1.5rem'}}>{login?'Вход':'Регистрация'}</Typography>
            <InputsFormControl variant="standard">
            <InputLabel htmlFor="username-input" sx={{fontSize: '1em'}} color="secondary">Имя пользователя</InputLabel>
            <Input
                onChange={(e)=>{setUN(e.target.value)}}
                id="username-input"
                type='text'
            />
            </InputsFormControl>
            <InputsFormControl variant="standard">
            <InputLabel htmlFor="password-input" color="secondary">Пароль</InputLabel>
            <Input
                onChange={(e)=>{setPass(e.target.value)}}
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
            />
            </InputsFormControl>
            {login?(<LoginButton variant="contained" onClick={loginAcc} color="secondary" id='login-btn'>Войти</LoginButton>):
            (<LoginButton variant="contained" onClick={register} color="secondary" id='register-btn'>Зарегистрироваться</LoginButton>)}
            
        </InputsBox>
    </MainBox>
    <Footer/>
    </>
    )
}