import { useEffect } from "react";

export default function AuthCallback() {

    useEffect(() => {

        console.log("Retour de Google");

    }, []);

    return <h2>Connexion en cours...</h2>;
}