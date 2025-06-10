import { NavLink } from "react-router-dom"
import "./header.css"
import rupia from '../../assets/rupia-icon.png'
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig";


export const Header = ()=> {

//para contador de gemas en el nav que se actualiza sin tener que refrescar la página
    const { user } = useAuth();
    const [gems, setGems] = useState<number | null>(null);

    useEffect(() => {
        if (!user) return;
    
        const userRef = doc(db, "users", user.uid);
    
        // Escucha cambios en tiempo real
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
            setGems(docSnap.data().gems || 0);
            }
        });
    
        // Limpieza del listener al desmontar
        return () => unsubscribe();
    }, [user]);

    return (
        <header>
                <div>
                    <NavLink className={"header-logo"} to="/shop">HYRULEPEDIA</NavLink>
                </div>
                <div className="header-content">
                    <nav className="header-nav">
                        <NavLink to="/shop">STORE</NavLink>
                        <NavLink to="/collection">COLLECTION</NavLink>
                        <NavLink to="/profile">PROFILE</NavLink>
                    </nav>
                    <div className="user-money">
                        <p>{gems !== null ? gems.toLocaleString() : "..."}</p>
                        <img src={rupia} alt="User gems" />  {/*habra que cambiarlo para que sea dinamico segun las rupias del usuario*/}
                    </div>
                </div>
        </header>  
    )
};