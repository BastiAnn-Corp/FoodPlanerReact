"use client"
import {Button, ButtonProps, Snackbar} from "@mui/material";
import {authApp, firebaseConfig} from "@/lib/firebase/firebase-config";
import {GoogleAuthProvider, signInWithPopup} from "@firebase/auth";
import {Google} from "@mui/icons-material";
import {useState} from "react";

export function LogInButton(props: ButtonProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleLogin () {
    setMessage('')
    setError('')
    console.log(process.env.FIREBASE_API_KEY)
    const provider = new GoogleAuthProvider();
    try {

      await signInWithPopup(authApp, provider);
      setMessage('Conexión exitosa')
    } catch (error) {
      console.error("Error signing in with Google", error);
      setError(`Error de conexión: ${error}`);
    }
  }

  return <Button
    {...props}
    startIcon={<Google/>}
    onClick={() => {handleLogin()}}
  >
    Conectarse
    <Snackbar
      key={'login-button'}
      open={(message !== '' || error !== '')}
      autoHideDuration={6000}
      onClose={()=>{setMessage(''); setError('')}}
      message={message + error}
    />
  </Button>
}