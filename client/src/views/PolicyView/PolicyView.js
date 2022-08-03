import './PolicyView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import LineChartComp from '../../components/lineChart/lineChart';
import PastEvents from '../../components/pastEvents/pastEvents';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';

const PolicyView = (props) => {
    const vote = (decisionIndex, qIndex) => {
        props.socket.emit("vote", {
            sector: props.sectorName,
            decisionIndex: decisionIndex,
            question: qIndex,
        });
    }

    const co2dec = ["Höj mycket", "Höj lite", "Behåll nuvarande", "Sänk lite", "Sänk mycket"];
    const subdec = ["Hög nivå", "Mellan nivå", "Låg nivå"];
    const evdec = ["Hög nivå", "Mellan nivå", "Låg nivå"];

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
                <LineChartComp propData={gameData.data} domain={[0,1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges CO2-utsläpp" />
                <h2>Rösta på beslut</h2>
                <p>Vad vill ni göra med CO2 priest?</p>
                <DecisionVoteList vote={vote} qIndex={0} decisions={co2dec} />
                <p>Vad vill ni göra med subventioner?</p>
                <DecisionVoteList vote={vote} qIndex={1} decisions={subdec} />
                <p>Vad vill ni göra med EV-premier?</p>
                <DecisionVoteList vote={vote} qIndex={2} decisions={evdec} />
            </div>
        );
    }

    return (
        <main>
            <TimeLine turns={['2025', '2030', '2035', '2040', '2045']} turn={turn} sectorName={props.sectorName} />
            {mainBody}
        </main>
    );
}

PolicyView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default PolicyView;
