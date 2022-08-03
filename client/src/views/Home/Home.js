import './Home.css';
import PropTypes from 'prop-types';
import IndustryView from '../IndustryView/IndustryView';
import PolicyView from '../PolicyView/PolicyView';
import StamView from '../StamView/StamView';
import Voters from '../Voters/Voters';
import React from 'react';
const Home = (props) => {
    const { socket } = props;
    // Recieved from server or hard coded in client
    const listOfSectors = ["Industrimagnat", "Politiker", "Stamnätsoperatör", "Väljare"]
    const random = 3//Math.floor(Math.random() * listOfSectors.length);
    const sectorParam = listOfSectors[random];

    switch (sectorParam) {
        case "Industrimagnat":
            return <IndustryView socket={socket} sectorName="Industrimagnat" />
        case "Politiker":
            return <main>
                <PolicyView socket={socket} sectorName="Politiker" />
            </main>
        case "Stamnätsoperatör":
            return <main>
                <StamView socket={socket} sectorName="Stamnätsoperatör" />
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
