import React from "react";
import Link from "next/link";
import { Box, TextField, Button } from "@mui/material";

import '@/app/globals.css';

function ManagerLogin() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="top-left-button">
                <Link href="/">
                    <img src="../logo.png" alt="Home Button" className="logo" />
                </Link>
            </div>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 700,
                    bgcolor: 'grey.300',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1>Tables4u - Manager Login</h1>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Login
                </Button>
            </Box>

        </main>
    );
}

export default ManagerLogin;
