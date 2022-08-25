import './decisionVoteList.css';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const DecisionVoteList = (props) => {
    const { decisions, vote, qIndex } = props;

    // Används för modal pop up:en
    const [open, setOpen] = React.useState(false);
    // Används för att spara temporärt vilket alternativt man tryck när modal pop up:en dyker upp
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    // Används för att spara vad man röstat på
    const [votedOn, setVotedOn] = React.useState(null);

    // Öppnar modal pop up:en
    const handleClickOpen = (index) => {
        // avbryt om man redan röstat
        if (votedOn !== null) {
            return;
        }
        // Spara vilket index man klicka på och öppna modalen
        setSelectedIndex(index);
        setOpen(true);
    };

    // Hanterar när man stänger modalen
    const handleClose = (confirmVote) => {
        // Om man redan röstat avryt direkt (ska egentligen inte komma hit då)
        if (votedOn !== null) {
            setOpen(false);
            setSelectedIndex(null);
            return;
        }
        // Om man tryckte ja på pop up:en
        if (confirmVote === true) {
            vote(selectedIndex, qIndex);
            setVotedOn(selectedIndex);
        }

        setOpen(false);
        setSelectedIndex(null);

    }

    return (
        <div className="wrapper-decisionVoteList">
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                transitionDuration={{ appear: 200, enter: 200, exit: 0 }}
            >
                <DialogTitle id="alert-dialog-title">
                    {'Vill du rösta på "' + (selectedIndex !== null ? decisions[selectedIndex] : '') + '"?'}
                </DialogTitle>
                <DialogActions>
                    <Button variant="contained" onClick={() => handleClose(true)}>Ja</Button>
                    <Button variant="outlined" onClick={() => handleClose(false)}>Nej</Button>
                </DialogActions>
            </Dialog>

            <ButtonGroup className="wrapper-decisionVoteList-buttonGroup" orientation="vertical" variant="contained" aria-label="outlined primary button group">
                {decisions.map((decision, index) => {
                    return (
                        <Button disabled={votedOn !== null && index !== votedOn} onClick={() => handleClickOpen(index)} style={{ justifyContent: "flex-start" }} className="wrapper-decisionVoteList-button" key={decision}>
                            {decision}
                        </Button>
                    );
                })
                }
            </ButtonGroup>
        </div>
    );
}

DecisionVoteList.propTypes = {
    decisions: PropTypes.array.isRequired,
    vote: PropTypes.func.isRequired,
    qIndex: PropTypes.number.isRequired
}

export default DecisionVoteList;
