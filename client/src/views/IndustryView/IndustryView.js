import './IndustryView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import LineChartComp from '../../components/lineChart/lineChart';
import PastEvents from '../../components/pastEvents/pastEvents';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import EBITChart from '../../components/EBITChart/EBITChart';

const IndustryView = (props) => {
    const vote = (decisionIndex) => {
        props.socket.emit("vote", {
            sector: props.sectorName,
            decisionIndex: decisionIndex
        });
    }
    const decisions = ["1) Investera i biodrivmedel", "2) Investera i elektrifiering", "3) Investera i R&D", "4) Investera i energieffektivisering"]

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
    if(gameData && gameData.turn) {
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
                <LineChartComp propData={gameData.data} domain={[0,1]} dataKey="co2" progKey="co2prog" title="Industrins CO2-utsläpp" />
                <EBITChart propData={gameData.data} title="EBIT-margin (%)" />
                {/* <PastEvents turn={turn}/> */}
                <h2>Beslutsunderlag</h2>
                <DecisionBasisWithGraph propData={gameData.data[turn].ind_IRR_bio} title={decisions[0]} />
                <DecisionBasisWithGraph propData={gameData.data[turn].ind_IRR_el} title={decisions[1]} />
                <DecisionBasisWithText title={decisions[2]} text="Satsa på att framtidens teknik är bättre än dagens. Detta kan leda till att framtidens investeringar kommer vara mer lönsamma." />
                <DecisionBasisWithText title={decisions[3]} text="Satsa på att minska din totala energiföbrukning. Detta kan leda till att dina framtida kostnader och eventuella utsläpp minskar något." />
                <h2>Rösta på beslut</h2>
                <DecisionVoteList vote={vote} decisions={decisions} />
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

IndustryView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default IndustryView;
