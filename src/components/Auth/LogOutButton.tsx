import {Button, ButtonProps, Snackbar} from "@mui/material";
import {authApp} from "@/lib/firebase/firebase-config";
import {signOut} from "@firebase/auth";
import {LogoutRounded} from "@mui/icons-material";
import {useState} from "react";

interface LogoutButtonProps extends ButtonProps {
  username: string;
}

export function LogOutButton(props: LogoutButtonProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogout = () => {
    signOut(authApp).then(() => {
      // Sign-out successful.
      console.log("Signed out successfully")
      setMessage('Desconexion exitosa')
    }).catch((error) => {
      // An error happened.
      setError(`Error al desconectar: ${error}`);
    });
  }

  return <Button
    {...props}
    endIcon={<LogoutRounded/>}
    onClick={() => {handleLogout()}}
  >
    {props.username}
    <Snackbar
      key={'logout-button'}
      open={(message !== '' || error !== '')}
      autoHideDuration={6000}
      onClose={()=>{setMessage(''); setError('')}}
      message={message + error}
    />
  </Button>
}