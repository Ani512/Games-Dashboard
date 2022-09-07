import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box"
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AddGenre from "./AddGenre";
import axios from "axios";
import { GlobalContext } from "../../pages/_app";
import { GamesContext } from "../../pages/games";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultValues = {
    name: "",
    genre: "",
    players: 0,
    rating: 0,
};

export default function AddGameForm(props: any) {
    const [formValues, setFormValues] = useState(defaultValues);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleInputSelect = (event: SelectChangeEvent) => {
        const { name, value } = event.target as HTMLInputElement;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
        setFormValues({
            ...formValues,
            [name]: newValue,
        });
    };

    const { userName } = useContext(GlobalContext);
    const { games, setGames } = useContext(GamesContext);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const newGame = {
            name: formValues.name,
            genre: formValues.genre,
            players: formValues.players,
            rating: formValues.rating,
        }

        const id = {
            gameName: newGame,
            userName: JSON.parse(userName),
        }

        if (formValues.name.length > 0 && formValues.name.charAt(formValues.name.length-1) !== " " && formValues.genre.length > 0 && formValues.players > 0) {
            setSuccess(true);
            handleClickSnack();
            // console.log(id);
            axios.post('https://nodejsgamedashbe.herokuapp.com/addGame', id);
            setGames([...games, id.gameName]);
            setTimeout(() => {
                props.setOpen(false);
            }, 500);
        } else {
            setSuccess(false);
            handleClickSnack();
        }
    };

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleClickSnack = () => {
        setSnackbarOpen(true);
    };

    const snackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    return (
        <Box >
            <Grid container sx={{ marginTop: 2, paddingRight: 2, display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                <AddGenre />
            </Grid>
            <form onSubmit={handleSubmit} >
                <Grid container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid sx={{ margin: '2%', color: "#9C27B0" }}>
                        <TextField
                            id="name-input"
                            name="name"
                            label="Name"
                            type="text"
                            color="secondary"
                            value={formValues.name}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid sx={{ margin: '2%' }}>
                        <TextField
                            id="players-input"
                            name="players"
                            label="Max Players"
                            type="number"
                            color="secondary"
                            value={formValues.players}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid sx={{ margin: '2%' }}>
                        <FormControl>
                            <FormLabel id="genre" color="secondary">Genre</FormLabel>
                            <Select
                                aria-labelledby="genre"
                                name="genre"
                                value={formValues.genre}
                                onChange={handleInputSelect}
                                color="secondary"
                            >
                                <MenuItem key="action" value="Action">
                                    Action
                                </MenuItem>
                                <MenuItem key="windows" value="Sports">
                                    Sports
                                </MenuItem>
                                <MenuItem key="fantasy" value="Fantasy">
                                    Fantasy
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid sx={{ margin: '2%' }}>
                        <div style={{ width: "350px" }}>
                            Rating
                            <Slider
                                value={formValues.rating}
                                onChange={handleSliderChange("rating")}
                                defaultValue={0}
                                color="secondary"
                                step={1}
                                min={0}
                                max={100}
                                marks={[
                                    {
                                        value: 25,
                                        label: "25",
                                    },
                                    {
                                        value: 50,
                                        label: "50",
                                    },
                                    {
                                        value: 75,
                                        label: "75",
                                    },
                                ]}
                                valueLabelDisplay="on"
                            />
                        </div>
                    </Grid>
                    <Button variant="contained" color="secondary" type="submit">
                        Add Game
                    </Button>
                    <Snackbar open={snackbarOpen} autoHideDuration={1000} onClose={snackbarClose}>
                        {success ?
                            <Alert onClose={snackbarClose} severity="success" sx={{ width: '100%' }}>
                                Game Inserted! Enjoy
                            </Alert>
                            : <Alert onClose={snackbarClose} severity="error" sx={{ width: '100%' }}>
                                Invalid Input :( Please Try again.
                            </Alert>}
                    </Snackbar>
                </Grid>
            </form>
        </Box>
    )
}