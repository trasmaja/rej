import './Home.css';
import PropTypes from 'prop-types';
import { useSearchParams } from "react-router-dom";
import SelectSector from '../SelectSector/SelectSector';
import IndustryView from '../IndustryView/IndustryView';
import React from 'react';
const Home = (props) => {
    const [searchParams] = useSearchParams();
    // Recieved from server or hard coded in client
    const listOfSectors = ["industri", "policy", "nätbolag"]
    // get the param we care about
    const sectorParam = searchParams.get("sector");
    const hasSelectedSector = listOfSectors.includes(sectorParam);

    if (hasSelectedSector) {
        switch (sectorParam) {
            case "industri":
                return <IndustryView socket={props.socket} sectorName={sectorParam}/>;
            case "policy":
                return <main>
                    <h2>Has selected</h2>
                </main>
            case "nätbolag":
                return <main>
                    <h2>Has selected</h2>
                </main>
            default:
                return <main>
                    <h2>Has selected</h2>
                </main>
        }
    } else {
        return (
            <SelectSector sectors={listOfSectors} />
        );
    }
}

Home.propTypes = {
    socket: PropTypes.object.isRequired
}

export default Home;
