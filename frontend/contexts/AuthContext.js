/*
* Create Auth context for use through pages
* Spring 2024 project
* Author: @aaronshar (https://github.com/aaronshar)
* Reference: 
 - Firebase Docs(https://firebase.google.com/docs/auth)
*/

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from '../firebase'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    // create user with email and password
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    
    // sign in existing user
    function signIn(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }
    
    // sign out user
    function signOut() {
        return signOut(auth)
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsub
    }, [])

    const value = {
        currentUser,
        signUp,
        signIn,
        signOut
    }
    
    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}