import React, { useState } from "react";
import Link from "next/link";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { Add, Save } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';


import '@/app/globals.css';
import "./editRest.css";


function EditRest() {

    const [tablesAndSeats, setTablesAndSeats] = useState<{ table: string; seats: number }[]>([]);

    const [newTable, setNewTable] = useState("");
    const [newSeats, setNewSeats] = useState("");

    const handleAddTable = () => {
        if (newTable && newSeats) {
            setTablesAndSeats([...tablesAndSeats, { table: newTable, seats: parseInt(newSeats) }]);
            setNewTable("");
            setNewSeats("");
        }
    };

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
                    maxWidth: 900,
                    bgcolor: 'grey.300',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1>Create Restaurant</h1>
                <TextField
                    label="Restaurant Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Restaurant Address"
                    type="username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Start Time"
                    type="username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="End Time"
                    type="username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

                <div className="InputTablesAndSeats">
                    <TextField
                        label="Table"
                        value={newTable}
                        onChange={(e) => setNewTable(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Box sx={{ width: '30%', height: 16 }} />
                    <TextField
                        label="Seats"
                        value={newSeats}
                        onChange={(e) => setNewSeats(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />

                    <IconButton onClick={handleAddTable} color="primary">
                        <Add />
                    </IconButton>
                </div>

                <div className="TablesAndSeats" style={{ height: 'auto', minHeight: '50px' }}>
                    {tablesAndSeats.map((item, index) => (
                        <div key={index} className="table-item">
                            <span>{item.table}</span>
                            <span>{item.seats} seats</span>
                        </div>
                    ))}
                </div>
                <br></br>
            </Box>
            <br></br>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                }}
            >
                <TextField
                    label="New Password"
                    type="username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

                <div className="saveAndDelete">
                    <Button variant="contained" color="primary" className="button" startIcon={<Save />}>
                    </Button>
                    <Button variant="contained" color="primary" className="button" startIcon={<DeleteIcon />}>
                    </Button>
                </div>
            </Box>


        </main>
    );
}

export default EditRest;
