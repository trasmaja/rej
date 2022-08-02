import './Home.css';
import PropTypes from 'prop-types';
import IndustryView from '../IndustryView/IndustryView';
import React from 'react';
const Home = (props) => {
    const { socket } = props;
    // Recieved from server or hard coded in client
    const listOfSectors = ["Industrimagnat", "Politiker", "Stamnätsoperatör", "Väljare"]
    const random = 0//Math.floor(Math.random() * listOfSectors.length);
    const sectorParam = listOfSectors[random];

    switch (sectorParam) {
        case "Industrimagnat":
            return <IndustryView socket={socket} sectorName="Industrimagnat" />
        case "Politiker":
            return <main>
                <h2>Has selected Politiker</h2>
            </main>
        case "Stamnätsoperatör":
            return <main>
                <h2>Has selected Stamnätsoperatör</h2>
            </main>
        case "Väljare":
            return <main>
                <h2>Has selected Väljare</h2>
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
