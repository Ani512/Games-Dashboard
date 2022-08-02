import { Typography } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';
import Top from '../components/Top';

const Games: NextPage = () => {
    return (
        <div>
            <Top />
            <Typography>Games</Typography>
        </div>
    )
}

export default Games;