import './SelectSector.css';
import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { useSearchParams } from "react-router-dom";
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const logo = require('./logo.png');

const SelectSector = (props) => {
    const [open, setOpen] = React.useState(false);
    const [selectedSector, setSelectedSector] = React.useState("");

    const { sectors } = props;
    const [_searchParams, setSearchParams] = useSearchParams();

    console.log(sectors)

    const handleClickOpen = (sector) => {
        setSelectedSector(sector);
        setOpen(true);
    };

    const handleClose = (confirmSelect) => {
        setOpen(false);
        console.log(confirmSelect)
        if (confirmSelect === true) {
            setSearchParams({ sector: selectedSector })
        } else {
            // setSelectedSector("")
        }
    }


    const sectorCards = sectors.map((sector, index) => {
        const delay = index * 100 + 'ms';
        const imageTest = require('./tmp' + index +'.png');
        return (
            <Slide direction="up" key={sector} style={{ transitionDelay: delay }} in={true}>
                <Card raised className="wrapper-selectSector-sectorsCard-card">
                    <CardActionArea onClick={() => handleClickOpen(sector)}>
                        <CardContent className="wrapper-selectSector-sectorsCard-card-content">
                            <CardMedia
                                className="wrapper-selectSector-sectorsCard-card-content-media"
                                component="img"
                                sx={{ width: "30%" }}
                                image={imageTest}
                                alt="Player Icon"
                            />
                            <div className="wrapper-selectSector-sectorsCard-card-content-text">
                                <h3>{sector}</h3>
                                <p>Lorem ipsum dolar sit amet. Lorem ipsum dolar sit amet.</p>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Slide>
        );
    });

    return (
        <main className="wrapper-selectSector">
            <img className="logo" src={logo} alt="REJLERS" />
            <Slide direction="down" in={true}>
                <div className="wrapper-selectSector-title">
                    <h2>Välj aktör</h2>
                </div>
            </Slide>
            <div className="wrapper-selectSector-sectorsCard">
                {sectorCards}
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Vill du spela som " + selectedSector + "-sektorn?"}
                </DialogTitle>
                <DialogActions>
                    <Button variant="contained" onClick={() => handleClose(true)} autoFocus>Ja</Button>
                    <Button variant="outlined" onClick={() => handleClose(false)}>Nej</Button>
                </DialogActions>
            </Dialog>
        </main>
    );
}

SelectSector.propTypes = {
    sectors: PropTypes.array.isRequired
}

export default SelectSector;
