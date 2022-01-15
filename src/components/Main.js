import { Grid } from '@material-ui/core'
import React from 'react'
import Header from './Header'
import ChatList from './ChatList'

function Main({user}) {
    return (
        <Grid container xs={12}>
            <Header user={user}/>
            <Grid container item direction='row' xs={12}>
                <Grid item xs={5}>
                    <ChatList user={user}/>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Main
