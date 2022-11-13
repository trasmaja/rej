import './Home.css';
import PropTypes from 'prop-types';
import IndustryView from '../IndustryView/IndustryView';
import PolicyView from '../PolicyView/PolicyView';
import ElcoView from '../ElcoView/ElcoView';
import Voters from '../Voters/Voters';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const { socket } = props;
    const navigate = useNavigate();
    const [sectorIndex, setsectorIndex] = useState(null);

    // Körs varje gång komponenten uppdateras
    useEffect(() => {
        // Skickar till servern att klienten vill ha en sektor
        props.socket.emit("getPlayerSector");
    }, []);


    /// Körs en gång när komponenten mountas
    useEffect(() => {
        // Lyssnar på playerSector och sparar index värdet som serven skickar
        props.socket.on("playerSector", index => {
            setsectorIndex(index);
        });

        // Körs på unmount
        // Säger åt att sluta lyssna på playerSector kanalen
        return () => {
            props.socket.off("playerSector");
        }
    })

    // Alla spelbara sektorer
    const sectors = [<IndustryView socket={socket} sectorName="Industrin" />, <PolicyView socket={socket} sectorName="Politiker" />, <ElcoView socket={socket} sectorName="Elbolag" />, <Voters socket={socket} sectorName="Väljare" />]
    // En switch som renderar olika saker baserat på index
    switch (sectorIndex) {
        case 0:
            navigate("/industri");
            break;
            // return <main className="industryMain">{sectors[0]}</main>
        case 1:
            navigate("/politiker");
            break;
            // return <main className="policyMain">{sectors[1]}</main>
        case 2:
            navigate("/elbolag");
            break;
            // return <main className="elcoMain">{sectors[2]}</main>
        case 3:
            navigate("/valjare");
            break;
            // return <main className="voterMain">{sectors[3]}</main>
        default:
            // Fallback om sectorIndex är något annat än 0,1,2,3
            const random = Math.floor(Math.random() * sectors.length);
            if(random === 0) {
                navigate("/industri");
            } else if (random === 1) {
                navigate("/politiker");
            } else if (random === 2) {
                navigate("/elbolag");
            } else if (random === 3) {
                navigate("/valjare");
            } else {
                navigate("/industri");
            }
    }

}

Home.propTypes = {
    socket: PropTypes.object.isRequired
}

export default Home;
