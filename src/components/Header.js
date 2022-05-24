import React, { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    makeStyles,
    IconButton,
    Menu,
    MenuItem,
} from '@material-ui/core'
import AddContact from './AddContact'
import Requests from './Requests'
import { auth } from '../firebase'
import { LogoutIcon } from '../assets/CustomIcons'
import firechat from '../assets/firechat.png'

const useStyles = makeStyles({
    navbar: {
        padding: '10px',
        height: '9vh'
    },
    displayImage: {
        width: '60px',
        height: '60px',
        borderRadius: '50%'
    },
    headerOptions: {
        display: 'flex',
        flexDirection: 'row'
    },
    logo : {
        width : '50px',
        height : '50px'
    }
})

function Header({ user }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const classes = useStyles()
    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => auth.signOut()}>
                    <LogoutIcon color="rgba(0,0,0,0.5)" />
                    Logout
                </MenuItem>
            </Menu>
            <AppBar className={classes.navbar} position='static'>
                <Toolbar>
                    <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                        <Grid style={{gap : '10px'}} item container direction='row' xs={10}>
                            <img className={classes.logo} src={firechat}/>
                            <Typography style={{ fontFamily: 'Montserrat' }} variant="h3">FireChat</Typography>
                        </Grid>
                        <Grid container item xs={2} direction='row' justifyContent='space-between'>
                            <AddContact user={user} />
                            <Requests user={user} />
                            <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
                                <img className={classes.displayImage} src={user.photoURL} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </>

    )
}

export default Header
