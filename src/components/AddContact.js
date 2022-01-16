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
    TextField,
    Snackbar
} from '@material-ui/core'
import { Add, Cross } from '../assets/CustomIcons'
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
    const [toastVariant, setToastVariant] = useState("success")
    const [toastOpen, setToastOpen] = useState(false)
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [searchResult, setSearchResult] = useState(null)
    const [sentReqExists, setSentReqExists] = useState(false)
    const [recievedReqExists, setRecievedReqExists] = useState(false)
    const [isContact, setIsContact] = useState(false)
    const [reqSuccess, setReqSuccess] = useState(false)

    const handleSearch = async () => {
        setReqSuccess(false)
        const resultArr = []
        const sentReqArr = []
        const recievedReqArr = []
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
        
        const sentReqRef = db.collection("all-users").doc(resultArr[0].uid).collection("recieved-requests")
        await sentReqRef.where("from.uid", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    sentReqArr.push({
                        ...doc.data()
                    })
                });
            })
        
        const recievedReqRef = db.collection("all-users").doc(user.uid).collection("recieved-requests")
        await recievedReqRef.where("from.uid", "==", resultArr[0].uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    recievedReqArr.push({
                        ...doc.data()
                    })
                })
            })
        const contactsRef = db.collection("all-users").doc(user.uid).collection("contacts")
        await contactsRef.doc(resultArr[0].uid).get()
        .then(doc => {
            setIsContact(doc.exists)
        })
        recievedReqArr.length > 0 ? setRecievedReqExists(true) : setRecievedReqExists(false)
        sentReqArr.length > 0 ? setSentReqExists(true) : setSentReqExists(false)
        setSearchResult(resultArr[0])
    }

    const handleSendRequest = async () => {
        await db.collection("all-users").doc(user.uid).collection("sent-requests").add({
            to: {
                name: searchResult.name,
                uid: searchResult.uid,
                email : searchResult.email,
                photoURL : searchResult.photoURL
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        var recievedReqsRef = db.collection("all-users").doc(searchResult.uid).collection("recieved-requests");
        await recievedReqsRef.add({
            from: {
                name: user.displayName,
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(res => {
            setToastOpen(true)
            setToastVariant("success")
            setOpen(false)
            setSearchResult(null);
            setSearchText("")
        })
        .catch(err => {
            setToastOpen(true)
            setToastVariant("error")
            setOpen(false)
            setSearchResult(null);
            setSearchText("")
        })

    }

    return (
        <>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={toastOpen}
                autoHideDuration={3000}
                onClose={() => setToastOpen(false)}
                message={toastVariant === 'success' ? 'Request Sent' : 'Error'}
                action={[
                    <IconButton onClick={() => setToastOpen(false)}>
                        <Cross color="#fff"/>
                    </IconButton>
                ]}
            />
            <IconButton onClick={() => setOpen(true)}><Add color="#fff" /></IconButton>
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
                            <img className={classes.image} src={searchResult.photoURL} />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='subtitle1'>{searchResult.name}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            {!recievedReqExists ? 
                                !isContact ? 
                                <Button disabled={sentReqExists && recievedReqExists} onClick={handleSendRequest}>
                                    {sentReqExists ? `Req Sent` : `Send Req`}
                                </Button>
                                :
                                <Button disabled>
                                    Friends
                                </Button>
                                :
                                <Button disabled>
                                    Check requests
                                </Button>
                            }
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
