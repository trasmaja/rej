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
    const greendec = ["1) Ambitiös nivå", "2) Måttlig nivå", "3) Inga gröna subventioner"];
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
    if (gameData && (gameData.turn === 1 || gameData.turn === 2)) {
        introText = (<p style={{ color: "#484d52" }}>Politikern ansvarar för:
            <ul>
                <li>att sätta ramarna för industrins investeringsbeslut genom straffskatter på utsläpp och investeringsstöd genom ”gröna givar”.</li>
                <li>att påverka konsumtionsmönster, samma gröna giv innefattar även stöd till konsumenter för att köpa elbil.</li>
                <li>överföringsförmågan i stamnätet, vilket fungerar som ett tak för hur mycket elproduktion som kan komma ut på marknaden.</li>
            </ul>
            Som återkoppling får politikern ett betyg av väljarna samt en indikation på vilka frågor de prioritierar. Om opinionen blir för låg begränsas politikerns handlingsfrihet.
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
        const disabledOptionsQ1 = [];
        const disabledOptionsQ2 = [];
        const disabledOptionsQ3 = [];

        if (gameData.data[turn]["voters_rating"] <= 0.3) {
            if (gameData.data[turn].voters_priority_for_policy === 0) {
                disabledOptionsQ1.push(0)
                disabledOptionsQ1.push(1)
                disabledOptionsQ1.push(2)
                disabledOptionsQ2.push(2)
            } else if (gameData.data[turn].voters_priority_for_policy === 1) {
                disabledOptionsQ1.push(0)
                disabledOptionsQ1.push(1)
                disabledOptionsQ1.push(2)
                disabledOptionsQ2.push(0)
                disabledOptionsQ3.push(0)
            } else if (gameData.data[turn].voters_priority_for_policy === 2) {
                disabledOptionsQ1.push(2)
                disabledOptionsQ1.push(3)
                disabledOptionsQ1.push(4)
                disabledOptionsQ2.push(2)
                disabledOptionsQ3.push(1)
                disabledOptionsQ3.push(2)

            }
        }
        mainBody = (
            <div className="wrapper-currentStatus">
                {introText}
                <h2>Nulägesrapport</h2>
                <SingleLineChart tick={true} tickCount={2} propData={gameData.data} domain={[0, 100]} dataKey="voters_rating" title="Väljarnas förtroende för dig (%)" />
                <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges utsläpp (miljoner ton C02-ekvivalenter)" />
                <EBITChart propData={gameData.data} title="Industrins rörelsemarginal (%)" lineColor="#F6B2BB" />
                <SupplyDemandGraph policy={true} propData={gameData.data} turn={gameData.turn} domain={[80, 200]} title="Elmarknaden (TWh)" />
                <h2>Beslut</h2>
                <h4>Vad vill du göra med CO2 priset?</h4>
                <DecisionVoteList vote={vote} qIndex={0} decisions={co2dec} disabledOptions={disabledOptionsQ1} />
                <h4>Välj en nivå för gröna subventioner till industrin och konsumenter</h4>
                <DecisionVoteList vote={vote} qIndex={1} decisions={greendec} disabledOptions={disabledOptionsQ2} />
                <h4>Vad vill du göra med stamnätet?</h4>
                <DecisionVoteList vote={vote} qIndex={2} decisions={svkdec} disabledOptions={disabledOptionsQ3} />
            </div>
        );
    } else if (gameData && gameData.turn === 6) {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h2>Utvärdering</h2>
                <SingleLineChart tick={true} tickCount={2} propData={gameData.data} domain={[0, 100]} dataKey="voters_rating" title="Väljarnas förtroende för dig (%)" />
                <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges utsläpp (miljoner ton C02-ekvivalenter)" />
                <EBITChart propData={gameData.data} title="Industrins rörelsemarginal (%)" lineColor="#F6B2BB" />
                <SupplyDemandGraph policy={true} propData={gameData.data} turn={gameData.turn} domain={[80, 200]} title="Elmarknaden (TWh)" />
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
