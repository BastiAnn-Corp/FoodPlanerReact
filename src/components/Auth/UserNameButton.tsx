"use client"
import {ButtonProps} from "@mui/material";
import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "@firebase/auth";
import {authApp} from "@/lib/firebase/firebase-config";
import {LogOutButton} from "@/components/Auth/LogOutButton";
import {LogInButton} from "@/components/Auth/LogInButton";

export function UserNameButton(props: ButtonProps) {
  const [userData, setUserData] = useState<User|null>(null)
  const [userName, setUserName] = useState("")
  useEffect(()=>{
    onAuthStateChanged(authApp, (user) => {
      if (user !== null) {
        setUserData(user)
        // @ts-ignore
        setUserName(user.displayName)
      } else {
        setUserData(null)
        setUserName("")
      }
    });
  }, [])

  return userData !== null ?
    <LogOutButton userName={userName} {...props}/> :
    <LogInButton {...props}/>
}