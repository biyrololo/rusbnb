import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {Typography} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/system';
import { places } from './CitiesData';
import { useNavigate, useLocation } from "react-router-dom";
import { keyframes } from '@mui/system';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const Footer = styled(Box)({
    backgroundColor: '#F5F5F5', height: '4rem', width: '100%', position: 'fixed', bottom: '0',
    borderTop: '1px solid gray', display: 'flex', justifyContent: 'space-between'

}),
SearchElement = styled(Box)({
    backgroundColor: 'white',
    width: '90%',
    margin: '0.5rem auto',
    padding: '1rem 5%'
}),
DDMenuItem = styled(Box)({
    display: 'flex', width: '100%', flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    minHeight: '2rem'
}),
DDMainTypo = styled(Typography)({
    userSelect: 'none', fontWeight: '500', flexBasis: '50%',
    fontSize: '1.1rem'
}),
DDValue = styled(Typography)({
    width: '3rem', textAlign: 'center', userSelect: 'none',
    fontSize: '1.1rem', fontWeight: '500'
}),
DDLine = styled(Box)({
    backgroundColor: '#EBEBEB', width: '100%', height: '2px'
}),
DDBtn = styled(Button)({
    fontSize: '1rem', height: '1.6rem', maxWidth: '2rem', padding: '0', minWidth: '2rem'
});

export default function MobileSearch (){
    
    const [dateArrival, setDateArrival] = React.useState<Dayjs | null>(null);
    const [dateDeparture, setDateDeparture] = React.useState<Dayjs | null>(null);
    const [place, setPlace] = React.useState('');
    const [showErrors, setShowErrors] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [adults, setAdults] = React.useState(0);
    const [children, setChildren] = React.useState(0);

    const disableArriveDates = (date : Dayjs) : boolean =>{
        return date.diff(dayjs(), 'day') < 0;
    };

    const disableDepartureDates = (date : Dayjs) : boolean =>{
        return date.diff(dateArrival || dayjs().add(-1, 'day'), 'day') <= 0;
    };
    return (
        <>
        <SearchElement sx={{borderRadius: '25px 25px 0 0', marginTop: '2rem'}}>
            <Autocomplete
                onChange={(e, v)=>{setPlace(String(v)); console.log(v)}}
                disablePortal
                id="combo-box-demo"
                options={places}
                sx={{ width: '100%'}}
                renderInput={(params) => <TextField {...params} label="Куда"
                error={(place==''||place==String(null))&&showErrors}
                sx={{ width: '100%'}} size="medium"
                color="info"/>}
            />
        </SearchElement>

        <SearchElement>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDatePicker']} sx={{width: '100%'}}>
                    <MobileDatePicker value={dateArrival} onChange={(newValue) => {setDateArrival(newValue);}} 
                        label="Прибытие"
                        slotProps={{ textField: { size: 'medium',
                        color:'info',
                        error: (dateArrival?(dateArrival.diff(dayjs(), 'day') < 0):showErrors)}}} sx={{width: '100%'}}
                        shouldDisableDate={disableArriveDates}/>
                </DemoContainer>
            </LocalizationProvider>
        </SearchElement>

        <SearchElement>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDatePicker']} sx={{width: '100%'}}>
                    <MobileDatePicker value={dateDeparture} onChange={(newValue) => {setDateDeparture(newValue);}}
                        label="Выезд"
                        slotProps={{ textField: { size: 'medium',
                        color:'info',
                        error: (dateDeparture?(dateDeparture.diff(dateArrival, 'day') <= 0):showErrors)}}}
                        shouldDisableDate={disableDepartureDates}/>
                </DemoContainer>
            </LocalizationProvider>
        </SearchElement>

        <SearchElement  sx={{borderRadius: '0 0 25px 25px', minHeight: '10rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
        <DDMenuItem>
                            <DDMainTypo>Взрослые</DDMainTypo>
                            <Box sx={{display: 'flex'}}>
                                <DDBtn
                                size='small'
                                variant="contained"
                                color="secondary"
                                disabled={adults==0}
                            onClick={()=>{if(adults > 0) setAdults(adults-1)}}>
                                &mdash;
                                </DDBtn>
                                <DDValue>
                                    {adults}
                                </DDValue>
                                <DDBtn
                                variant="contained"
                                color="secondary"
                                onClick={()=>{setAdults(adults+1)}}>
                                    +
                                </DDBtn>
                            </Box>
                        </DDMenuItem>
                        <DDLine/>
                        <DDMenuItem>
                            <DDMainTypo>Дети</DDMainTypo>
                            <Box sx={{display: 'flex'}}>
                                <DDBtn
                                size='small'
                                variant="contained"
                                color="info"
                                disabled={children==0}
                                onClick={()=>{if(children > 0) setChildren(children-1)}}>
                                &mdash;
                                </DDBtn>
                                <DDValue>
                                    {children}
                                </DDValue>
                                <DDBtn 
                                size='small'
                                variant="contained"
                                color="info"
                                onClick={()=>{setChildren(children+1)}}>
                                    +
                                </DDBtn>
                            </Box>
                        </DDMenuItem>
        </SearchElement>
        <Footer>

        </Footer>
        </>
    )
}