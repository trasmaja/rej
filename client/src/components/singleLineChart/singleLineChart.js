import './singleLineChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const SingleLineChart = (props) => {
    const { propData, dataKey, progKey, domain } = props;
    const data = [{ turn: '2025', value: null}, { turn: '2030', value: null }, { turn: '2035', value: null}, { turn: '2040', value: null }, { turn: '2045', value: null }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if(element) {
            if(element[dataKey]) {
                data[index].value = element[dataKey];
            }
        }
    });
    console.log(data)
    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{top: 10, right: 20, bottom: 10, left: 20}}>
                    <Line type="linear" strokeWidth={3} stroke="#2AA784" dataKey={"value"} />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="turn" />
                    <YAxis domain={domain} hide />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

SingleLineChart.propTypes = {
    title: PropTypes.string.isRequired,
    domain: PropTypes.array.isRequired,
    // socket: PropTypes.object.isRequired
}

export default SingleLineChart;
