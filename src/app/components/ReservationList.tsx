import React from "react";
import Link from "next/link";
import "@/app/globals.css";
import {
    Grid2,
    Paper
} from '@mui/material'
import {
    Box,
    Container
} from '@mui/system'


export default function ReservationList({openingHour, closingHour}: {openingHour : number, closingHour:number}){

    const list = []
    
    for(let i=0; i<closingHour-openingHour; i++){
        list.push(<Grid2 key={i} size={1}><Box sx={{borderRadius: 1,bgcolor:'#000000'}}>\</Box></Grid2>);
    }

    return(
       <Grid2 container columns={closingHour-openingHour}>
            {list.map((key)=>(
                <Grid2 size={1}><Box>{openingHour+Number(key.key)}</Box></Grid2>
            ))}
            {list}
       </Grid2>
    );
}