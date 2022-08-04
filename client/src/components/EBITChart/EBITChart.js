import './EBITChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Legend, Label } from 'recharts';

const EBITChart = (props) => {
    const { propData } = props;
    const data = [{ turn: '2022', ebit: null }, { turn: '2025', ebit: null }, { turn: '2030', ebit: null }, { turn: '2035', ebit: null }, { turn: '2040', ebit: null }, { turn: '2045', ebit: null }];

    propData.forEach((element, index) => {
        // console.log(index, element)
        if (element != null) {
            if (element.ind_EBIT_marginal != null) {
                data[index].ebit = Math.floor(element.ind_EBIT_marginal * 100);
            }
        }
    });

    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis tickMargin={10} stroke="#484D52" dataKey="turn" />
                    <YAxis width={5} stroke="#484D52" tick={false} domain={[datamin => (datamin - 5 > -5 ? -5 : datamin - 5), datamax => (datamax + 5)]} />
                    {/* <Line type="linear" dataKey={progKey} stroke="#ccc" strokeWidth={3} strokeDasharray="3 3"  /> */}
                    <ReferenceLine y={0} stroke="#EC6161" strokeDasharray="3 3">
                        <Label fill='#EC6161' value="0" position="left" />
                    </ReferenceLine>
                    <ReferenceLine y={10} stroke="#484D52" strokeDasharray="3 3" >
                        <Label fill='#484D52' value="10" position="left" />
                    </ReferenceLine>
                    <Line type="lienar" strokeWidth={3} stroke="#2AA784" dataKey={"ebit"} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

EBITChart.propTypes = {
    title: PropTypes.string.isRequired,
    propData: PropTypes.array.isRequired,
    // socket: PropTypes.object.isRequired
}

export default EBITChart;
