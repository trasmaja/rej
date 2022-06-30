import './lineChart.css';
import PropTypes from 'prop-types';
const imageTest = require('./graph.png');

const LineChart = (props) => {


    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <img className="wrapper-lineChart-graph" src={imageTest} alt="Line Chart" />
        </div>
    );
}

LineChart.propTypes = {
    title: PropTypes.string.isRequired
    // socket: PropTypes.object.isRequired
}

export default LineChart;
