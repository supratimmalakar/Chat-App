import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import {
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    makeStyles,
    IconButton,
    Button,
    TextField
} from '@material-ui/core'
import { Add } from '../assets/CustomIcons'
import { db } from '../firebase'

const useStyles = makeStyles({
    dialog: {
        '& .MuiPaper-root': {
            padding: '5px 30px'
        }
    },
    image: {
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        border: '2px solid rgba(0,0,0,0.28)',
        display: 'block'
    }
})

function AddContact({ user }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [searchResult, setSearchResult] = useState(null)

    const handleSearch = async () => {
        const resultArr = []
        await db.collection("all-users").where("email", "==", searchText)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    resultArr.push({
                        ...doc.data(),
                        uid: doc.id
                    })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        setSearchResult(resultArr[0])
    }

    const handleSendRequest = async () => {
        await db.collection("all-users").doc(user.uid).collection("sent-requests").add({
            to : {
                name: searchResult.name,
                uid: searchResult.uid,
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        console.log(searchResult.uid)
        await db.collection("all-users").doc(searchResult.uid).collection("recieved-requests").add({
            from : {
                name: user.name,
                uid: user.uid,  
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <>
            <IconButton onClick={() => setOpen(true)}><Add color="#000000" /></IconButton>
            <Dialog className={classes.dialog} open={open}>
                <DialogTitle>
                    <Typography variant='h6'>Add Contacts</Typography>
                </DialogTitle>
                <TextField type='email' label="email" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <Button onClick={handleSearch}>
                    Search
                </Button>
                {searchResult && !(user.uid === searchResult.uid) &&
                    <Grid container direction='row' xs={12} spacing={1} alignItems='center'>
                        <Grid item xs={2}>
                            <img className={classes.image} src={searchResult.photoUrl} />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='subtitle1'>{searchResult.name}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button onClick={handleSendRequest}>Send Req</Button>
                        </Grid>
                    </Grid>}
                <Button
                    onClick={() => {
                        setOpen(false);
                        setSearchResult(null);
                        setSearchText("")
                    }}
                >
                    Close
                </Button>
            </Dialog>
        </>
    )
}

export default AddContact
