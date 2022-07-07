import './IndustryView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import LineChartComp from '../../components/lineChart/lineChart';
import PastEvents from '../../components/pastEvents/pastEvents';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';

const IndustryView = (props) => {
    const vote = (decisionIndex) => {
        props.socket.emit("vote", {
            sector: props.sectorName,
            decisionIndex: decisionIndex
        });
    }
    const decisions = ["1) Investera i biodrivmedel", "2) Investera i el", "3) Investera i R&D"]

    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        props.socket.emit("getGameData");
    }, []);

    useEffect(() => {
        props.socket.on("gameData", gameData => {
            setGameData(gameData);
        });

        return () => {
            props.socket.off("gameData");
        }
    })

    let turn = 0;
    if(gameData && gameData.turn) {
        turn = gameData.turn;
    }
    
    let mainBody;
    if (gameData && gameData.state === "EndOfTurnCalc") {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Runda avslutad</h2>
            </div>);
    } else if (gameData && gameData.state === "votingInProgress") {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Nulägesrapport</h2>
                <LineChartComp propData={gameData.params} dataKey="co2" progKey="co2prog" title="CO2-utsläpp" />
                <LineChartComp propData={gameData.params} dataKey="ebit" progKey="ebitprog"title="EBIT" />
                <PastEvents turn={turn}/>
                <h2>Beslutsunderlag</h2>
                <DecisionBasisWithGraph propData={gameData.irr} title={decisions[0]} />
                <DecisionBasisWithGraph propData={gameData.irr} title={decisions[1]} />
                <DecisionBasisWithText title={decisions[2]} text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem." />
                <h2>Rösta på beslut</h2>
                <DecisionVoteList vote={vote} decisions={decisions} />
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

IndustryView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default IndustryView;
