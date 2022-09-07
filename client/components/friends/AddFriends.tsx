import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios  from 'axios';
import { FriendsContext } from '../../pages/friends';
import { GlobalContext } from '../../pages/_app';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddFriend() {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");

    const { friends, setFriends } = React.useContext(FriendsContext);
    const { userName } = React.useContext(GlobalContext);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target as HTMLInputElement;
        setName(value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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

    const handleSubmit = (name: string) => {
        const id = {
            friendName: name,
            userName: JSON.parse(userName),
        }
        
        if (name.length > 0 && name.charAt(name.length-1) !== " ") {
            // cancelAnimationFrame
            setSuccess(true);
            handleClickSnack();
            axios.post('https://nodejsgamedashbe.herokuapp.com/addFriend', id);
            setFriends([...friends, id.friendName]);
            setTimeout(() => {
                snackbarClose();
                handleClose();
            }, 500);
        } else {
            setSuccess(false);
            handleClickSnack();
            setTimeout(() => {
                snackbarClose();
            }, 1000);
        } 

        setName("");
    };

    return (
        <div>
            <Fab aria-label="add" onClick={handleClickOpen} sx={{ color: "#9C27B0" }}>
                <AddIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Friend</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Adding a new Friend to Play Games with
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        value={name}
                        color="secondary"
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button type="submit" onClick={() => handleSubmit(name)} color="secondary">Add</Button>
                </DialogActions>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={snackbarClose}>
                    {success ?
                        <Alert onClose={snackbarClose} severity="success" sx={{ width: '100%' }}>
                            Friend Added
                        </Alert>
                        : <Alert onClose={snackbarClose} severity="error" sx={{ width: '100%' }}>
                            Invalid Input :( Please Try again.
                        </Alert>}
                </Snackbar>
            </Dialog>
        </div>
    );
}