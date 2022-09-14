import './Voters.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import EBITChart from '../../components/EBITChart/EBITChart';
import TotalEmissionChart from '../../components/totalEmissionChart/totalEmissionChart';
import CarCosts from '../../components/carCosts/carCosts';
import VoterCosts from '../../components/votersCosts/votersCosts';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#f7c6cc',
            main: '#F6B2BB',
            dark: '#d99ca4',
            contrastText: '#2C3955',
        },
        // secondary: {
        //     light: '#ff7961',
        //     main: '#f44336',
        //     dark: '#ba000d',
        //     contrastText: '#000',
        // },
    },
});

const Voters = (props) => {
    // funktionen som skickar en vote till servern
    const vote = (decisionIndex, qIndex) => {
        props.socket.emit("vote", {
            sector: props.sectorName,
            decisionIndex: decisionIndex,
            question: qIndex,
        });
    }

    // Beslut som Väljare kan göra
    const ratingDec = ["1) Mycket bra", "2) Bra", "3) Dåligt", "4) Mycket dåligt"];
    const carDec = ["1) Elbil", "2) Bränslebil"];

    // staten som håller all speldata
    const [gameData, setGameData] = useState(null);

    // Kallas på varje prop update. Begär att få datan från serven
    useEffect(() => {
        props.socket.emit("getGameData");
    }, []);

    // Lyssnar på gameData kanalen och sparar datan.   
    useEffect(() => {
        props.socket.on("gameData", gameData => {
            console.log(gameData)
            setGameData(gameData);
        });

        // Sluta lyssna på dismount
        return () => {
            props.socket.off("gameData");
        }
    })

    // Initialvärde för turn
    // turn börjar på 1 från servern men behöver att den börjar från 0 här för det används
    // som index därav - 1
    let turn = 0;
    if (gameData && gameData.turn) {
        turn = gameData.turn - 1;
    }

    let mainBody;

    // Det som ska synas på skärmen när spelet är i presentatör läge
    if (gameData && (gameData.state === "presenting" && gameData.turn !== 6)) {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2 className="centerText">Runda avslutad</h2>
            </div>
        );
        // Det som ska synas när man är i vanliga spel läget
    } else if (gameData && (gameData.state === "playing" || gameData.turn === 6)) {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Nulägesrapport</h2>
                <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges CO2-utsläpp" />
                <EBITChart propData={gameData.data} title="Industrins EBIT-margin (%)" lineColor="#F6B2BB" />
                <VoterCosts propData={gameData.data} title="Din ekonomi (tKr)" />
                <CarCosts propData={gameData.data} title="Fordonskostnad (tKr)" />
                <h2>Beslut</h2>
                <h3>Rating av politkernas jobb</h3>
                <DecisionVoteList vote={vote} qIndex={0} decisions={ratingDec} />
                <h3>Vad för bil vill du köpa?</h3>
                <DecisionVoteList vote={vote} qIndex={1} decisions={carDec} />
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
        <div>
            <TimeLine turns={['2022', '2025', '2030', '2035', '2040', '2045']} turn={turn} sectorName={props.sectorName} />
            {mainBody}
        </div>
        </ThemeProvider>
    );
}

Voters.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default Voters;
