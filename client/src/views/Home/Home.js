import './Home.css';
import PropTypes from 'prop-types';
import IndustryView from '../IndustryView/IndustryView';
import PolicyView from '../PolicyView/PolicyView';
import ElcoView from '../ElcoView/ElcoView';
import Voters from '../Voters/Voters';
import React, { useState, useEffect } from 'react';

const Home = (props) => {
    const { socket } = props;

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
    const sectors = [<IndustryView socket={socket} sectorName="Industrimagnat" />, <PolicyView socket={socket} sectorName="Politiker" />, <ElcoView socket={socket} sectorName="Elbolag" />, <Voters socket={socket} sectorName="Väljare" />]

    // En switch som renderar olika saker baserat på index
    switch (0) {
        case 0:
            return <main className="industryMain">{sectors[0]}</main>
        case 1:
            return <main>{sectors[1]}</main>
        case 2:
            return <main>{sectors[2]}</main>
        case 3:
            return <main>{sectors[3]}</main>
        default:
            // Fallback om sectorIndex är något annat än 0,1,2,3
            const random = Math.floor(Math.random() * sectors.length);
            return <main>{sectors[random]}</main>
    }

}

Home.propTypes = {
    socket: PropTypes.object.isRequired
}

export default Home;
