import './Admin.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import AdminTimeline from '../../components/adminTimeline/adminTimeline';
import Button from '@mui/material/Button';
import TotalEmissionChart from '../../components/totalEmissionChart/totalEmissionChart';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import rejlersLogo from './rejlers_logo.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#BFE5DA',
            main: '#57B998',
            dark: '#3d8f73',
            contrastText: '#FFF',
        },
        // secondary: {
        //     light: '#ff7961',
        //     main: '#f44336',
        //     dark: '#ba000d',
        //     contrastText: '#000',
        // },
    },
});

export default function Admin(props) {
    console.log(props)

    const [gameData, setGameData] = useState(null);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (confirmVote) => {
        if (confirmVote) {
            props.socket.emit("resetGame");
        }
        setOpen(false);
    }

    useEffect(() => {
        props.socket.emit("getAdminGameData");
    }, []);

    useEffect(() => {
        props.socket.on("adminGameData", gameData => {
            console.log(gameData)
            setGameData(gameData);
        });
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });

        return () => {
            props.socket.off("adminGameData");
        }
    })

    const handleClick = (buttonPressed) => {
        if (buttonPressed === 1) {
            props.socket.emit("endTurn")
        } else if (buttonPressed === 2) {
            props.socket.emit("startTurn")
        }
    }

    let turn = 0;
    if (gameData && gameData.turn) {
        turn = gameData.turn - 1;
    }

    let content = null;
    if (gameData && gameData.history) {
        content = gameData.history.map((data, index) => {
            const indexToYear = ['2022', '2025', '2030', '2035', '2040', '2045'];
            const key = "history" + index;
            let classNameList = "";
            if (index === 0) {
                classNameList = "admin-main admin-main-first";
            } else {
                classNameList = "admin-main";
            }
            return (
                <div className={classNameList} key={key}>
                    <div className="admin-main-title">
                        <h2>{indexToYear[index]} - {indexToYear[index + 1]}</h2>
                    </div>
                    <div className="admin-main-flex">
                        <div className="admin-main-left">
                            <h3>Beslut</h3>
                            <p><span className="boldify">Industrins</span> {data.Industri}</p>
                            <p><span className="boldify">Politikerna</span> {data.Policy}</p>
                            <p><span className="boldify">Elbolagen</span> {data.Elco}</p>
                            <p><span className="boldify">Väljarnas</span> {data.Voter}</p>
                        </div>
                        <div className="admin-main-rigth">
                            <TotalEmissionChart propData={gameData.data} domain={[0, 1]} dataKey="totalCo2" progKey="totalCo2prog" title="Sveriges CO2-utsläpp" />
                        </div>
                    </div>
                </div>
            )
        })
    }
    let playerCounter = null;
    if (gameData && gameData.playerCount) {
        playerCounter = (<div className="admin-player-counter">
            <div className="player-count-text-wrapper">
                <p className="player-count-text">Industrin</p>
                <p className="player-count-text boldify bounceAni number">{gameData.playerCount[0]}</p>
            </div>
            <div className="player-count-text-wrapper">
                <p className="player-count-text">Politikerna</p>
                <p className="player-count-text boldify bounceAni number">{gameData.playerCount[1]}</p>
            </div>
            <div className="player-count-text-wrapper">
                <p className="player-count-text">Elbolagen </p>
                <p className="player-count-text boldify bounceAni number">{gameData.playerCount[2]}</p>
            </div>
            <div className="player-count-text-wrapper">
                <p className="player-count-text">Väljarna </p>
                <p className="player-count-text boldify bounceAni number"> {gameData.playerCount[3]}</p>
            </div>
        </div >
        )
    }
    return (
        <ThemeProvider theme={theme}>
            <main className="admin">
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {'Vill du starta om spelet?'}
                    </DialogTitle>
                    <DialogActions>
                        <Button variant="contained" onClick={() => handleClose(true)} autoFocus>Ja</Button>
                        <Button variant="outlined" onClick={() => handleClose(false)}>Nej</Button>
                    </DialogActions>
                </Dialog>
                <div className="admin-top">
                    <div className="admin-top-left" onClick={() => handleClickOpen()}>
                        <img className="admin-top-leftIcon" src={rejlersLogo} alt="Rejlers" />
                    </div>
                    <div className="admin-top-mid">
                        <AdminTimeline turns={['2022', '2025', '2030', '2035', '2040', '2045']} turn={turn} sectorName={"Tidslinje"} />
                    </div>
                    <div className="admin-top-right">
                        <Button className="top-button" variant="contained" onClick={() => handleClick(1)}>Avsluta spelrunda</Button>
                        <Button className="top-button" variant="contained" onClick={() => handleClick(2)}>Påbörja spelrunda</Button>
                    </div>
                </div>
                {playerCounter}
                {content}
            </main>
        </ThemeProvider>
    );
}

Admin.propTypes = {
    socket: PropTypes.object.isRequired
}

