import './PolicyView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import SingleLineChart from '../../components/singleLineChart/singleLineChart';
import EBITChart from '../../components/EBITChart/EBITChart';
import TotalEmissionChart from '../../components/totalEmissionChart/totalEmissionChart';
import SupplyDemandGraph from '../../components/supplyDemandGraph/supplyDemandGraph';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#f7c6cc',
            main: '#F6B2BB',
            dark: '#d99ca4',
            contrastText: '#F4F4F4',
        },
        // secondary: {
        //     light: '#ff7961',
        //     main: '#f44336',
        //     dark: '#ba000d',
        //     contrastText: '#000',
        // },
    },
});

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
    const greendec = ["1) Stor", "2) Mellan", "3) Liten"];
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
    let introText = null;
    if (gameData && gameData.turn === 1) {
        introText = (<p style={{ color: "#484d52" }}>Politikern ansvarar för att sätta ramarna för industrins investeringsbeslut och för det potentiella utbudet på elmarknaden. Därutöver kan politikern ge subventioner till väljaren för att göra det billigare att köpa elbil. Som input får politikern ett betyg av väljarna och om detta blir för lågt begränsas politikerns handlingsfrihet. <br /><br />
            Ramarna för industrin påverkas genom att politikern kan höja eller sänka priset att släppa ut CO2 och genom investeringsstöd genom en Grön Giv. Samma gröna giv innefattar även ett stöd till konsumenter för att köpa elbil. <br /><br />
            Elmarknaden kan Politikern påverka genom att bygga ut stamnätet. Stamnätet fungerar som ett tak för hur mycket elproduktion som kan komma ut på marknaden.
        </p>);
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
                <SingleLineChart tick={true} tickCount={2} propData={gameData.data} domain={[0, 100]} dataKey="voters_rating" title="Förtreoende hos väljare (%)" />
                <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges utsläpp (miljoner ton C02-ekvivalenter)" />
                <EBITChart propData={gameData.data} title="Industrins EBIT-margin (%)" lineColor="#F6B2BB" />
                <SupplyDemandGraph policy={true} propData={gameData.data} turn={gameData.turn} domain={[80, 200]} title="Elmarknaden" />
                <h2>Beslut</h2>
                <h4>Vad vill du göra med CO2 priest?</h4>
                <DecisionVoteList vote={vote} qIndex={0} decisions={co2dec} />
                <h4>Hur stort ska den gröna given vara?</h4>
                <DecisionVoteList vote={vote} qIndex={1} decisions={greendec} />
                <h4>Vad vill du göra med stamnätet?</h4>
                <DecisionVoteList vote={vote} qIndex={2} decisions={svkdec} />
            </div>
        );
    } else if (gameData && gameData.turn === 6) {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Utvärdering</h2>
                <SingleLineChart tick={true} tickCount={2} propData={gameData.data} domain={[0, 100]} dataKey="voters_rating" title="Förtreoende hos väljare (%)" />
                <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges utsläpp (miljoner ton C02-ekvivalenter)" />
                <EBITChart propData={gameData.data} title="Industrins EBIT-margin (%)" lineColor="#F6B2BB" />
                <SupplyDemandGraph policy={true} propData={gameData.data} turn={gameData.turn} domain={[80, 200]} title="Elmarknaden" />
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

PolicyView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default PolicyView;
