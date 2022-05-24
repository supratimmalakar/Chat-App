import React, { useState, useEffect, useRef } from 'react'
import SignOut from './SignOut'
import { db } from '../firebase'
import { Grid, Typography, AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SendMessage from './SendMessage'

const useStyles = makeStyles({
    item: {
        padding: '2px 20px !important',
        background: 'rgba(255, 255, 255, 0.39)'
    },
    messageContainer: {
        height: '78vh',
        overflowY : 'auto',
        
    },
    messageDiv: {
        width : '100%',
        display : 'flex',
        flexDirection : 'column',
        marginTop : 'auto'
    },
    image: {
        width: '25px',
        height: '25px',
        margin: '0 4px',
        borderRadius: '50%',
        border: '1px solid rgba(0, 0, 0, 0.28)'
    },
    heading: {
        padding: '10px',
    },
    dp: {
        width: '50px',
        height: '50px',
        borderRadius: '50%'
    },
})

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

function Chat({ user, selectedChat }) {
    const classes = useStyles()
    const [messages, setMessages] = useState([])
    const [contact, setContact] = useState(null)
    // useEffect(() => {
    //     db.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
    //         setMessages(snapshot.docs.map(doc => doc.data()))
    //     })
    // }, []);
    useEffect(() => {
        if (selectedChat) {
            db.collection('chats').doc(selectedChat.id).collection('messages').orderBy('createdAt')
                .onSnapshot(snapshot => {
                    setMessages(snapshot.docs.map(doc => doc.data()))
                })

            var participants = [...selectedChat.participants];
            var removeIndex = participants.map(participant => participant.uid).indexOf(user.uid)
            participants.splice(removeIndex, 1);
            const contact = participants[0]
            setContact(contact)
        }
    }, [selectedChat])
    return (
        <Grid style={{ background: "linear-gradient(162deg, rgba(190,64,64,0.25) 0%, rgba(110,132,255,0.5) 100%)"}} container xs={12}>
            <Grid container item xs={12}>
                <AppBar className={classes.heading} position='static'>
                    <Grid style={{gap : '10px'}} container xs={12} direction='row' alignItems='center'>
                        <Grid item>
                            <img className={classes.dp} src={contact && contact.photoURL} />
                        </Grid>
                        <Grid item>
                            <Typography style={{ fontFamily: 'Montserrat', fontWeight: '700' }} variant='h4' align='center'>
                                {contact && contact.name}
                            </Typography>
                        </Grid>
                    </Grid>
                </AppBar>
            </Grid>
            <Grid className={classes.messageContainer} id="chat-window-container" direction='column' container xs={12}>
                <div className={classes.messageDiv}>
                    {messages.map(({ text, uid, createdAt, photoURL }) => {
                        return (
                            <Grid container style={{ margin: '5px 0px' }} direction={uid == user.uid ? 'row-reverse' : 'row'} alignItems='center' alignContent='center'>
                                <Grid item>
                                    <img className={classes.image} src={photoURL} />
                                </Grid>
                                <Grid className={classes.item} item style={{ borderRadius: '25px', border: '1px solid rgba(0, 0, 0, 0.28)', maxWidth: '200px' }}>
                                    <Typography style={{ fontFamily: 'Inter' }} align='left' variant='subtitle1'>{text}</Typography>
                                </Grid>
                            </Grid>)
                    }
                    )}
                    <AlwaysScrollToBottom />
                </div>
            </Grid>
            <SendMessage selectedChat={selectedChat} user={user} />
        </Grid>
    )
}

export default Chat
