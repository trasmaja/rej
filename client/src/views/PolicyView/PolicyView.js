import './PolicyView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import SingleLineChart from '../../components/singleLineChart/singleLineChart';
import EBITChart from '../../components/EBITChart/EBITChart';
import TotalEmissionChart from '../../components/totalEmissionChart/totalEmissionChart';
import SupplyDemandGraph from '../../components/supplyDemandGraph/supplyDemandGraph';

const PolicyView = (props) => {
    const { sectorName, socket } = props;
    const vote = (decisionIndex, qIndex) => {
        socket.emit("vote", {
            sector: sectorName,
            decisionIndex: decisionIndex,
            question: qIndex,
        });
    }

    // Besluten som Policy kan göra
    const co2dec = ["1) Höj mycket", "2) Höj lite", "3) Behåll nuvarande", "4) Sänk lite", "5) Sänk mycket"];
    const greendec = ["1) Hög nivå", "2) Mellan nivå", "3) Låg nivå"];
    const svkdec = ["1) Bygg ut mycket", "2) Bygg ut lite", "3) Behåll nuvarande"];

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
                <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges CO2-utsläpp" />
                <EBITChart propData={gameData.data} title="Industrins EBIT-margin (%)" />
                <SingleLineChart tick={true} propData={gameData.data} domain={[0, 1]} dataKey="voters_rating" title="Approval rating" />
                <SupplyDemandGraph policy={true} propData={gameData.data} turn={gameData.turn} domain={[80, 200]} title="Elmarknaden" />
                <h2>Rösta på beslut</h2>
                <p>Vad vill ni göra med CO2 priest?</p>
                <DecisionVoteList vote={vote} qIndex={0} decisions={co2dec} />
                <p>Vad vill ni göra med det gröna paketet?</p>
                <DecisionVoteList vote={vote} qIndex={1} decisions={greendec} />
                <p>Vad vill ni göra med stamnätet?</p>
                <DecisionVoteList vote={vote} qIndex={2} decisions={svkdec} />
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

PolicyView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default PolicyView;
