import React from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    makeStyles
} from '@material-ui/core'
import AddContact from './AddContact'

const useStyles = makeStyles({
    navbar : {
        padding : '10px'
    },
    displayImage : {
        width : '60px',
        height : '60px',
        borderRadius : '50%'
    },
    headerOptions : {
        display : 'flex',
        flexDirection : 'row'
    }
})

function Header({ user }) {
    const classes = useStyles()
    return (
        <AppBar className={classes.navbar} position='static'>
            <Toolbar>
                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant="h3">Chat App</Typography>
                    <Grid container item xs={2} direction='row' justifyContent='space-between'>
                        <AddContact user={user}/>
                        <img className={classes.displayImage} src={user.photoURL}/>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Header
