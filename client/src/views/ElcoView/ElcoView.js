import './ElcoView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import SupplyDemandGraph from '../../components/supplyDemandGraph/supplyDemandGraph';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import EBITChartEl from '../../components/EBITChartEl/EBITChartEl';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#BFE5DA',
            main: '#57B998',
            dark: '#3d8f73',
            contrastText: '#FFF',
        },
        // secondary: {
        //     light: '#ff7961',
        //     main: '#f44336',
        //     dark: '#ba000d',
        //     contrastText: '#000',
        // },
    },
});

const ElcoView = (props) => {
    const { sectorName, socket } = props;
    const vote = (decisionIndex, qIndex) => {
        socket.emit("vote", {
            sector: sectorName,
            decisionIndex: decisionIndex,
            question: qIndex,
        });
    }

    // Beslut som Elbolag kan göra
    const decisionList = ["1) Öka produktionen", "2) Behåll nuvarande produktion", "3) Minska produktionen"];

    // staten som håller all speldata
    const [gameData, setGameData] = useState(null);

    // Kallas på varje prop update. Begär att få datan från serven
    useEffect(() => {
        socket.emit("getGameData");
    }, []);

    // Lyssnar på gameData kanalen och sparar datan.
    useEffect(() => {
        socket.on("gameData", gameData => {
            console.log(gameData)
            setGameData(gameData);
        });

        // Sluta lyssna på dismount
        return () => {
            socket.off("gameData");
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
    let introText = null;
    if (gameData && (gameData.turn === 1 || gameData.turn === 2)) {
        introText = (<p style={{ color: "#484d52" }}>Elbolaget reglerar utbudet av el på marknaden och har därmed
        en stor inverkan på elpriset som bestäms som en funktion av utbud och efterfrågan.
        Elpris och marknadsbalans påverkar även verksamhetens lönsamhet.</p>
        );
    }
    // Det som ska synas på skärmen när spelet är i presentatör läge
    if (gameData && (gameData.state === "presenting" && gameData.turn !== 6)) {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2 className="centerText">Runda avslutad</h2>
            </div>
        );
        // Det som ska synas när man är i vanliga spel läget
    } else if (gameData && gameData.state === "playing") {
        mainBody = (
            <div className="wrapper-currentStatus">
                {introText}
                <h2>Nulägesrapport</h2>
                <SupplyDemandGraph policy={false} propData={gameData.data} domain={[80, 200]} turn={gameData.turn} title="Elmarknaden (TWh)" />
                <EBITChartEl propData={gameData.data} title="Rörelsemarginal (%)" />
                <h2>Beslut</h2>
                <h4>Vad vill du göra med elproduktionen?</h4>
                <DecisionVoteList vote={vote} decisions={decisionList} disabledOptions={[]} />

            </div>
        );
    } else if (gameData && gameData.turn === 6) {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Utvärdering</h2>
                <SupplyDemandGraph policy={false} propData={gameData.data} domain={[80, 200]} turn={gameData.turn} title="Elmarknaden (TWh)" />
                <EBITChartEl propData={gameData.data} title="Rörelsemarginal (%)" />
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                <TimeLine turns={['2022', '2025', '2030', '2035', '2040', '2045']} turn={turn} sectorName={sectorName} />
                {mainBody}
            </div>
        </ThemeProvider>
    );
}

ElcoView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default ElcoView;
