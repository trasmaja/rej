import './ElcoView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import LineChartComp from '../../components/lineChart/lineChart';
import SupplyDemandGraph from '../../components/supplyDemandGraph/supplyDemandGraph';
import PastEvents from '../../components/pastEvents/pastEvents';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';

const ElcoView = (props) => {
    const vote = (decisionIndex, qIndex) => {
        props.socket.emit("vote", {
            sector: props.sectorName,
            decisionIndex: decisionIndex,
            question: qIndex,
        });
    }

    const decisionList = ["Bygg ut", "Behåll", "Skär ner"];

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
                <h2>Runda avslutad</h2>
            </div>);
    } else if (gameData && gameData.state === "playing") {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Nulägesrapport</h2>
                <SupplyDemandGraph policy={false} propData={gameData.data} domain={[80,200]} turn={gameData.turn}  title="Elmarknaden" />
                <h2>Rösta på beslut</h2>
                <p>Vad vill ni göra med elproduktionen?</p>
                <DecisionVoteList vote={vote}  decisions={decisionList} />

            </div>
        );
    }

    return (
        <main>
            <TimeLine turns={['2022', '2025', '2030', '2035', '2040', '2045']} turn={turn} sectorName={props.sectorName} />
            {mainBody}
        </main>
    );
}

ElcoView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default ElcoView;
