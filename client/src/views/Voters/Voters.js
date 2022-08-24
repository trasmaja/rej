import './Voters.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import LineChartComp from '../../components/lineChart/lineChart';
import PastEvents from '../../components/pastEvents/pastEvents';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import SingleLineChart from '../../components/singleLineChart/singleLineChart';
import EBITChart from '../../components/EBITChart/EBITChart';
import TotalEmissionChart from '../../components/totalEmissionChart/totalEmissionChart';
import CarCosts from '../../components/carCosts/carCosts';
import VoterCosts from '../../components/votersCosts/votersCosts';

const Voters = (props) => {
    const vote = (decisionIndex, qIndex) => {
        props.socket.emit("vote", {
            sector: props.sectorName,
            decisionIndex: decisionIndex,
            question: qIndex,
        });
    }

    const ratingDec = ["Mycket bra", "Bra", "Dåligt", "Mycket dåligt"];
    const carDec = ["Elbil", "Bränslebil"];


    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        props.socket.emit("getGameData");
    }, []);

    useEffect(() => {
        props.socket.on("gameData", gameData => {
            console.log(gameData)
            setGameData(gameData);
        });

        return () => {
            props.socket.off("gameData");
        }
    })

    let turn = 0;
    if (gameData && gameData.turn) {
        turn = gameData.turn - 1;
    }

    let mainBody;
    if (gameData && gameData.state === "presenting") {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2 className="centerText">Runda avslutad</h2>
            </div>);
    } else if (gameData && gameData.state === "playing") {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Nulägesrapport</h2>
                <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges CO2-utsläpp" />
                <EBITChart propData={gameData.data} title="Industrins EBIT-margin (%)" />
                <CarCosts propData={gameData.data} title="Fordonskostnad" />
                <VoterCosts propData={gameData.data} title="Din ekonomi" />
                <h2>Rösta på beslut</h2>
                <p>Rating av politkernas jobb</p>
                <DecisionVoteList vote={vote} qIndex={0} decisions={ratingDec} />
                <p>Vad för bil vill du köpa?</p>
                <DecisionVoteList vote={vote} qIndex={1} decisions={carDec} />
            </div>
        );
    }

    return (
        <div>
            <TimeLine turns={['2022', '2025', '2030', '2035', '2040', '2045']} turn={turn} sectorName={props.sectorName} />
            {mainBody}
        </div>
    );
}

Voters.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default Voters;
