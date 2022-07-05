import './decisionVoteList.css';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import React from 'react';

const DecisionVoteList = (props) => {
    return (
        <div className="wrapper-decisionVoteList">
            <ButtonGroup className="wrapper-decisionVoteList-buttonGroup" orientation="vertical" variant="contained" aria-label="outlined primary button group">
                {props.decisions.map((decision, index) => {
                    return (
                        <Button onClick={() => props.vote(index)} style={{ justifyContent: "flex-start"}} className="wrapper-decisionVoteList-button" key={index}>
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
