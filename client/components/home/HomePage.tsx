import React, { useState, useContext } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { GlobalContext } from '../../pages/_app';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { FormLabel, Grid, TextField } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { TransitionProps } from '@mui/material/transitions';
import GameList from './GameList';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" sx={{ zIndex: 999 }} {...props} />;
});

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const defaultValues = {
    friends: [],
    genre: "",
    players: 0,
}

const genres = [
    'Action',
    'Fantasy',
    'Sports',
];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function HomePage(props: any) {
    const theme = useTheme(); 
    const [personName, setPersonName] = React.useState<string[]>([]);
    const { userName } = useContext(GlobalContext);
    const [open, setOpen] = React.useState(false);
    const [finalGamesList, setFinalGamesList] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    
    const [formValues, setFormValues] = useState(defaultValues);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
      const { target: { value } } = event;
      setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

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

    const handleClickSnack = () => {
        setSnackbarOpen(true);
    };

    const snackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const submitted = {
            friend: personName,
            genre: formValues.genre,
            players: formValues.players,
        }

        if (submitted.friend.length > 0 && submitted.genre.length > 0 && submitted.players > 0) {
            const _user = JSON.parse(userName);
            let friends = ""+_user+",";
            
            for (let i = 0; i < submitted.friend.length; i++) {
                (i === submitted.friend.length-1) ? friends+=submitted.friend[i] : friends=friends+submitted.friend[i]+",";
            }
            const findgames_url = `https://nodejsgamedashbe.herokuapp.com/findgames?friends=${encodeURIComponent(friends)}&players=${encodeURIComponent(submitted.players)}&genre=${encodeURIComponent(submitted.genre)}`;
            
            // Fetch the Filtered JSON response from the database
            await fetch(findgames_url)
            .then((response: { json: () => any; }) => response.json())
            .then(jsonRes => {
                //jsonRes => the filtered games list data
                // console.log(jsonRes);
                setFinalGamesList(jsonRes);
            })
            setOpen(true);
            
            setFormValues(defaultValues);
            setPersonName([]);
        } else {
            handleClickSnack();
            // alert("Please Select Correct Parameters: \n\n Friends > 0 \n Players > 0 \n Genre");   
        }
    }

    return (
        <Grid>
        <form onSubmit={handleFormSubmit}>
                <Grid>
                    <FormControl>
                        <FormLabel id="select-friends" color="secondary" sx={{ color: "#e3e3e3" }}>Friends</FormLabel>
                        <Select
                        sx={{ bgcolor: "#e3e3e3", width: 300 }}
                        id="select-friends"
                        multiple
                        color="secondary"
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-friends" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                        >
                        {props.friends.map((name: any) => (
                            <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                            >
                            {name}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid sx={{ marginTop: 10 }}>
                <FormControl>
                        <FormLabel id="players" color="secondary" sx={{ color: "#e3e3e3" }}>Max Players</FormLabel>
                        <TextField
                            sx={{ bgcolor: "#e3e3e3", color: "#e3e3e3" }}
                            id="players"
                            name="players"
                            type="number"
                            color="secondary"
                            value={formValues.players}
                            onChange={handleInputChange}
                        />
                </FormControl>
                </Grid>
                <Grid sx={{ marginTop: 10 }}>
                    <FormControl>
                    <FormLabel id="genre" color="secondary" sx={{ color: "#e3e3e3" }}>Genre</FormLabel>
                        <Select
                        aria-labelledby="genre"
                        name="genre"
                        value={formValues.genre}
                        onChange={handleInputSelect}
                        color="secondary"
                        sx={{ bgcolor: "#e3e3e3", width: 200 }}
                        >
                            {genres.map((name) => (
                                <MenuItem
                                key={name}
                                value={name}
                                >
                                {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <ColorButton variant="contained" size='large' sx={{ padding: 2, marginTop: 10 }} type="submit">FIND GAMES!</ColorButton>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative', backgroundColor: '#2f2f2f' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon fontSize='large' />
                            </IconButton>
                            <Typography sx={{ flex: 1, textAlign: 'center' }} variant="h6" component="div">
                                Games 
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Grid sx={{ justifyContent: 'center', backgroundColor: '#E6D9D9', height: '100%', overflow: 'hidden' }}>
                        <GameList setOpen={setOpen} games={finalGamesList} />
                    </Grid>
                </Dialog>
            </form>
            <Snackbar open={snackbarOpen} autoHideDuration={1000} onClose={snackbarClose}>
                <Alert onClose={snackbarClose} severity="error" sx={{ width: '100%' }}>
                    Invalid Selections :( Please Try again.
                </Alert>
            </Snackbar>
        </Grid>
    )
}