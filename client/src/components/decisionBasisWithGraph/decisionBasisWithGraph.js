import './decisionBasisWithGraph.css';
import PropTypes from 'prop-types';
const imageTest = require('./IRR.png');

const DecisionBasisWithGraph = (props) => {


    return (
        <div className="wrapper-decisionBasisWithGraph">
            <h3>{props.title}</h3>
            <img className="wrapper-decisionBasisWithGraph-graph" src={imageTest} alt="Line Chart" />
        </div>
    );
}

DecisionBasisWithGraph.propTypes = {
    title: PropTypes.string.isRequired
    // socket: PropTypes.object.isRequired
}

export default DecisionBasisWithGraph;
