import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AppBar from '../components/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" target="_blank" href="https://github.com/Madhur20/BoardGamesDashBoard">
        Game DashBoard
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const signup: NextPage = () => {
  const router = useRouter();

  if (typeof window !== "undefined") {
    localStorage.setItem("auth", "false");
  }
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const user = {
          userName: data.get('username'),
          password: data.get('password'),
        }
        // console.log(user);
        const check = await axios.post('https://games-dashboard.onrender.com/signup', user);
        console.log(check);

        if (check && check.status === 201) {
          const usernameLocal = user.userName ? user.userName.toString() : "invalid";
          if (typeof window !== "undefined") {
            localStorage.setItem("auth", "true");
            localStorage.setItem("username", JSON.stringify(usernameLocal));
          }
          router.push('/home');
        }
      };
    
      return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <AppBar />
            <Box
              sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                color="secondary"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                sx={{bgcolor: "#eaeaea"}}
                autoFocus
              />
              <TextField
                margin="normal"
                color="secondary"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                sx={{bgcolor: "#eaeaea"}}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                color="secondary"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/" variant="body2">
                    {"Already have an account? Login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
      )
    }

export default signup;