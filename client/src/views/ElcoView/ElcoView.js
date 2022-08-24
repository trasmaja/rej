import './ElcoView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import SupplyDemandGraph from '../../components/supplyDemandGraph/supplyDemandGraph';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';

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
    const decisionList = ["1) Bygg ut", "2) Behåll", "3) Skär ner"];

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
                <SupplyDemandGraph policy={false} propData={gameData.data} domain={[80, 200]} turn={gameData.turn} title="Elmarknaden" />
                <h2>Rösta på beslut</h2>
                <p>Vad vill ni göra med elproduktionen?</p>
                <DecisionVoteList vote={vote} decisions={decisionList} />

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

ElcoView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default ElcoView;
