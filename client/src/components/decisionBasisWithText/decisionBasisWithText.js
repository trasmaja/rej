import './decisionBasisWithText.css';
import PropTypes from 'prop-types';
import React from 'react';

const DecisionBasisWithText = (props) => {
    const { title, text } = props;
    return (
        <div className="wrapper-decisionBasisWithText">
            <h3>{title}</h3>
            <p className="wrapper-decisionBasisWithText-text">
                {text}
            </p>
        </div>
    );
}

DecisionBasisWithText.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}

export default DecisionBasisWithText;
