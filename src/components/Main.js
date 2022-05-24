import { Grid } from '@material-ui/core'
import React, {useState} from 'react'
import Header from './Header'
import ChatList from './ChatList'
import Contacts from './Contacts'
import {makeStyles} from '@material-ui/core'
import Chat from './Chat'

const useStyles = makeStyles({
    mainGrid : {
        height : '91vh'
    }
})

function Main({user}) {
    const classes = useStyles()
    const [selectedChat, setSelectedChat] = useState(null)
    const [selectedContact,setSelectedContact] = useState(null)
    return (
        <Grid container xs={12}>
            <Header user={user}/>
            <Grid className={classes.mainGrid} container item direction='row' xs={12}>
                <Grid item xs={3}>
                    <ChatList 
                        selectedChat={selectedChat} 
                        setSelectedChat={setSelectedChat} 
                        user={user}
                        setSelectedContact={setSelectedContact}
                        selectedContact={selectedContact}
                        />
                </Grid>
                <Grid item xs={6}>
                    <Chat 
                        selectedChat={selectedChat}  
                        user={user}/>
                </Grid>
                <Grid item xs={3}>
                    <Contacts 
                        user={user}
                        setSelectedChat={setSelectedChat} />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Main
