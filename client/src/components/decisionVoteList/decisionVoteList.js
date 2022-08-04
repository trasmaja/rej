import './decisionVoteList.css';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const DecisionVoteList = (props) => {
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [votedOn, setVotedOn] = React.useState(null);

    const handleClickOpen = (index) => {
        if(votedOn !== null) {
            return;
        }
        setSelectedIndex(index);
        setOpen(true);
    };

    const handleClose = (confirmVote) => {
        if(votedOn !== null) {
            return;
        }
        if(confirmVote === true) {
            props.vote(selectedIndex, props.qIndex);
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
            >
                <DialogTitle id="alert-dialog-title">
                    {'Vill du rösta på "' + props.decisions[selectedIndex] + '"?'}
                </DialogTitle>
                <DialogActions>
                    <Button variant="contained" onClick={() => handleClose(true)} autoFocus>Ja</Button>
                    <Button variant="outlined" onClick={() => handleClose(false)}>Nej</Button>
                </DialogActions>
            </Dialog>

            <ButtonGroup className="wrapper-decisionVoteList-buttonGroup" orientation="vertical" variant="contained" aria-label="outlined primary button group">
                {props.decisions.map((decision, index) => {
                    return (
                        <Button disabled={votedOn !== null && index !== votedOn} onClick={() => handleClickOpen(index)} style={{ justifyContent: "flex-start" }} className="wrapper-decisionVoteList-button" key={index}>
                            {decision}
                        </Button>
                    );
                }
                )}
            </ButtonGroup>
        </div>
    );
}

DecisionVoteList.propTypes = {
    decisions: PropTypes.array.isRequired,
    vote: PropTypes.func.isRequired,
    // socket: PropTypes.object.isRequired
}

export default DecisionVoteList;
