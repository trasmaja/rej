import './IndustryView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import LineChartComp from '../../components/lineChart/lineChart';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import EBITChart from '../../components/EBITChart/EBITChart';

const IndustryView = (props) => {
    const { sectorName, socket } = props;

    // funktionen som skickar en vote till servern
    const vote = (decisionIndex) => {
        socket.emit("vote", {
            sector: sectorName,
            decisionIndex: decisionIndex
        });
    }

    // Beslut som Industrin kan göra
    const decisions = ["1) Investera i biodrivmedel", "2) Investera i elektrifiering", "3) Investera i R&D", "4) Investera i energieffektivisering"]

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

    // Det som ska synas på skärmen när spelet är i presentatör läge
    if (gameData && gameData.state === "presenting") {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2 className="centerText">Runda avslutad</h2>
            </div>
        );
        // Det som ska synas när man är i vanliga spel läget
    } else if (gameData && gameData.state === "playing") {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Nulägesrapport</h2>
                <LineChartComp propData={gameData.data} domain={[0, 1]} dataKey="co2" progKey="co2prog" title="Industrins CO2-utsläpp" />
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
        <div>
            <TimeLine turns={['2022', '2025', '2030', '2035', '2040', '2045']} turn={turn} sectorName={sectorName} />
            {mainBody}
        </div>
    );
}

IndustryView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default IndustryView;
