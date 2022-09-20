import './singleLineChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const SingleLineChart = (props) => {
    const { propData, dataKey, domain, tick, title } = props;
    const data = [{ turn: '2022', value: null }, { turn: '2025', value: null }, { turn: '2030', value: null }, { turn: '2035', value: null }, { turn: '2040', value: null }, { turn: '2045', value: null }];

    propData.forEach((element, index) => {
        if (element != null) {
            if (element[dataKey] != null) {
                data[index].value = Math.floor(element[dataKey] * 100 );
            }
        }
    });

    return (
        <div className="wrapper-lineChart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis strokeWidth={1} tickMargin={10} stroke="#666" dataKey="turn" />
                    <YAxis strokeWidth={1} stroke="#666" width={5} domain={domain} tick={tick} tickCount={2} />
                    <Line type="linear" strokeWidth={2} stroke="#F6B2BB" dataKey={"value"} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

SingleLineChart.propTypes = {
    propData: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    domain: PropTypes.array.isRequired,
    tick: PropTypes.bool.isRequired,
    dataKey: PropTypes.string.isRequired,
}

export default SingleLineChart;
