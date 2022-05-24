import React from 'react'
import firebase from 'firebase'
import { Button, Grid, Paper, Typography } from '@material-ui/core'
import { auth } from '../firebase'
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { makeStyles } from '@material-ui/core'
import firechat from '../assets/firechat.png'

const useStyles = makeStyles({
    loginPaper: {
        padding: '40px',
        paddingTop: '10px',
    },
    signUpHeading: {
        fontFamily: 'Inter !important',
        textTransform: 'uppercase',
        fontSize: '20px',
        color: 'rgba(0,0,0,0.8)',
        fontWeight: 500,
        marginBottom : '20px'
    },
    buttonGrid: {
        height: '200px !important'
    },
    paperGrid: {
        height: '100%'
    },
    otherPaper: {
        height: '50vh'
    },
    logo: {
        width: '50px',
        height: '50px'
    }
})

function SignIn() {
    const classes = useStyles();
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
    }

    const signInWithFacebook = () => {
        const provider = new firebase.auth.FacebookAuthProvider()
        auth.signInWithPopup(provider)
    }

    return (
        <Grid container xs={3} justifyContent='center' style={{ height: '100vh', margin: 'auto' }} alignItems='center'>
            <Grid item container xs={12} justifyContent='center' alignItems='center'>
                <Paper className={classes.loginPaper}>
                    <Grid style={{margin : '20px 0'}} container>
                        <img className={classes.logo} src={firechat} />
                        <Typography align="center" style={{ fontFamily: 'Montserrat' }} variant="h3">FireChat</Typography>
                    </Grid>
                    <Grid container xs={12} direction='column' alignItems='center' justifyContent='space-between'>
                        <Typography align="center" className={classes.signUpHeading}>Sign In/Log In</Typography>
                        <Grid style={{ height: '180px' }} container item xs={12} direction='column' justifyContent='space-between'>
                            <GoogleLoginButton onClick={signInWithGoogle} />
                            <FacebookLoginButton onClick={signInWithFacebook} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default SignIn
