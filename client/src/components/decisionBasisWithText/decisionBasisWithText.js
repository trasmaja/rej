import './decisionBasisWithText.css';
import PropTypes from 'prop-types';
import React from 'react';

const DecisionBasisWithText = (props) => {

    return (
        <div className="wrapper-decisionBasisWithText">
            <h3>{props.title}</h3>
            <p className="wrapper-decisionBasisWithText-text">
                {props.text}
            </p>
        </div>
    );
}

DecisionBasisWithText.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
    // socket: PropTypes.object.isRequired
}

export default DecisionBasisWithText;
