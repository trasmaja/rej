import './Home.css';
import PropTypes from 'prop-types';
import IndustryView from '../IndustryView/IndustryView';
import PolicyView from '../PolicyView/PolicyView';
import ElcoView from '../ElcoView/ElcoView';
import Voters from '../Voters/Voters';
import React, { useState, useEffect } from 'react';

const Home = (props) => {
    const { socket } = props;
    const listOfSectors = ["Industrimagnat", "Politiker", "Elbolag", "Väljare"]
    // const random = 1//Math.floor(Math.random() * listOfSectors.length);
    // const sectorParam = listOfSectors[random];

    const [sector, setSector] = useState(null);

    useEffect(() => {
        props.socket.emit("getPlayerSector");
    }, []);

    useEffect(() => {
        props.socket.on("playerSector", index => {
            console.log(index)
            setSector(index);
        });

        return () => {
            props.socket.off("playerSector");
        }
    })

    console.log(listOfSectors[sector])
    switch (listOfSectors[sector]) {
    // switch ("Elbolag") {
        case "Industrimagnat":
            return <IndustryView socket={socket} sectorName="Industrimagnat" />
        case "Politiker":
            return <main>
                <PolicyView socket={socket} sectorName="Politiker" />
            </main>
        case "Elbolag":
            return <main>
                <ElcoView socket={socket} sectorName="Elbolag" />
            </main>
        case "Väljare":
            return <main>
                <Voters socket={socket} sectorName="Väljare" />
            </main>
        default:
            return <main>
                <h2>Has selected default</h2>
            </main>
    }

}

Home.propTypes = {
    socket: PropTypes.object.isRequired
}

export default Home;
