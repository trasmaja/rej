import './decisionBasisWithGraph.css';
import PropTypes from 'prop-types';
import React from 'react';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const DecisionBasisWithGraph = (props) => {
    const data = [
        {
            name: 'low',
            irr: 0,
        },
        {
            name: 'mid',
            irr: 0,
        },
        {
            name: 'high',
            irr: 0,
        },
    ];
    const lineDdata = [
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
        {
            wacc: 10,
        },
    ];
    props.propData.forEach((element, index) => {
        data[index].irr = Math.floor(element*100);
    });

    return (
        <div className="wrapper-decisionBasisWithGraph">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 15,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis xAxisId={1} dataKey="name" />
                    <XAxis xAxisId={2} hide={true} />

                    <YAxis domain={[0, 30]} width={10} />
                    <Bar xAxisId={1} dataKey="irr" fill="#2AA784" />
                    <Line data={lineDdata} xAxisId={2} type="linear" dot={false} dataKey="wacc" stroke="#ccc" strokeWidth={3} strokeDasharray="3 3" />
                    <Legend />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

DecisionBasisWithGraph.propTypes = {
    title: PropTypes.string.isRequired
    // socket: PropTypes.object.isRequired
}

export default DecisionBasisWithGraph;
