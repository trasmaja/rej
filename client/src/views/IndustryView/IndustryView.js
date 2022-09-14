import './IndustryView.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import TimeLine from '../../components/timeline/timeline';
import LineChartComp from '../../components/lineChart/lineChart';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';
import EBITChart from '../../components/EBITChart/EBITChart';
import LineChartElPrice from '../../components/lineChartElPrice/lineChartElPrice';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#455f8a',
            main: '#2B3B55',
            dark: '#1a2333',
            contrastText: '#DFDBD9',
        },
        // secondary: {
        //     light: '#ff7961',
        //     main: '#f44336',
        //     dark: '#ba000d',
        //     contrastText: '#000',
        // },
    },
});


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
                <h3>Rollbeskrivning</h3>
                <p style={{color: "#484d52"}}>Industrimagnaten styr sin verksamhet efter rörelsemarginalen (rörelseresultat/omsättning) och fattar sina investeringsbeslut utifrån en internräntekalkyl. <br /><br />
                    Rörelsemarginalen kan variera beroende på kostnaden för el, kostnaden för utsläpp, kostnaden för investerat kapital och kostnaden för biodrivmedel. Internräntekalkylen bestäms utifrån marknadspriser på el och biodrivmedel, priset för att släppa ut CO2 och den initiala investeringskostnaden. I de tre scenarierna är alla variabler låsta med undantag för priset på att släppa ut som sätts till tre nivåer – att det sänks, att det ligger kvar eller att det höjs.
                </p>
                <h2>Nulägesrapport</h2>
                <LineChartComp propData={gameData.data} domain={[0, 1]} dataKey="co2" progKey="co2prog" title="Industrins utsläpp (miljoner ton C02-ekvivalenter)" />
                <EBITChart propData={gameData.data} title="Rörelsemarginal (%)" lineColor="#2B3B55" />
                <LineChartElPrice propData={gameData.data} title="Elpriset (kr/kWh)" />
                {/* <PastEvents turn={turn}/> */}
                <h2>Beslutsunderlag</h2>
                <DecisionBasisWithGraph propData={gameData.data[turn].ind_IRR_bio} title={decisions[0]} />
                <DecisionBasisWithGraph propData={gameData.data[turn].ind_IRR_el} title={decisions[1]} />
                <DecisionBasisWithText title={decisions[2]} text="Satsa på att framtidens teknik är bättre än dagens. Detta kan leda till att framtidens investeringar kommer vara mer lönsamma." />
                <DecisionBasisWithText title={decisions[3]} text="Satsa på att minska din totala energiföbrukning. Detta kan leda till att dina framtida kostnader och eventuella utsläpp minskar något." />
                <h2>Beslut</h2>
                <h4>Vad vill du göra för investering?</h4>
                <DecisionVoteList vote={vote} decisions={decisions} />
            </div>
        );
    } else if (gameData && gameData.turn === 6) {
        mainBody = (
            <div className="wrapper-currentStatus">
                <h3>Rollbeskrivning</h3>
                <p style={{color: "#484d52"}}>Industrimagnaten styr sin verksamhet efter rörelsemarginalen (rörelseresultat/omsättning) och fattar sina investeringsbeslut utifrån en internräntekalkyl. <br /><br />
                    Rörelsemarginalen kan variera beroende på kostnaden för el, kostnaden för utsläpp, kostnaden för investerat kapital och kostnaden för biodrivmedel. Internräntekalkylen bestäms utifrån marknadspriser på el och biodrivmedel, priset för att släppa ut CO2 och den initiala investeringskostnaden. I de tre scenarierna är alla variabler låsta med undantag för priset på att släppa ut som sätts till tre nivåer – att det sänks, att det ligger kvar eller att det höjs.
                </p>
                <h2>Utvärdering</h2>
                <LineChartComp propData={gameData.data} domain={[0, 1]} dataKey="co2" progKey="co2prog" title="Industrins utsläpp (miljoner ton C02-ekvivalenter)" />
                <EBITChart propData={gameData.data} title="Rörelsemarginal (%)" lineColor="#2B3B55" />
                <LineChartElPrice propData={gameData.data} title="Elpriset (kr/kWh)" />
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

IndustryView.propTypes = {
    sectorName: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired
}

export default IndustryView;
