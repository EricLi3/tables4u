import React, {useState,useEffect} from 'react'
import {Collapse, Typography} from '@mui/material'
import {Box} from '@mui/system'
import ReservationList from './ReservationList';

export default function ReservationCollapse({openingHour, closingHour, restUUID, dateTime, open}: {openingHour : number, closingHour:number, restUUID: string, dateTime: string, open:boolean}){
    const [restList, setRestList] = useState(<div></div>);

    const createRestList = () => {
    if (open) {
        setRestList(<ReservationList openingHour={Number(openingHour)} closingHour={Number(closingHour)} restUUID={restUUID} dateTime={dateTime}/>);
        console.log("Object created:", restList);
    }
    };

    useEffect(()=>{}, [restList])

    return(
        <Collapse in={open} addEndListener={()=>{createRestList()}} timeout="auto" unmountOnExit>
            <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                    Details
                </Typography>
                <Typography variant="body2">
                    Opening Hours: {openingHour} - {closingHour}
                </Typography>
                {restList}
            </Box>
        </Collapse>
    );
    
}
