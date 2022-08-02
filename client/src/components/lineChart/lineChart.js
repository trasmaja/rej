import './lineChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const LineChartComp = (props) => {
    const { propData, dataKey, progKey } = props;
    const data = [{ turn: '2025', co2: null, co2prog: 1, ebit: null, ebitprog: 0.10 }, { turn: '2030', co2: null, co2prog: 0.75, ebit: null, ebitprog: 0.10 }, { turn: '2035', co2: null, co2prog: 0.50, ebit: null, ebitprog: 0.10 }, { turn: '2040', co2: null, co2prog: 0.25, ebit: null, ebitprog: 0.10 }, { turn: '2045', co2: null, co2prog: 0, ebit: null, ebitprog: 0.10 }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if(element) {
            if(element.industry_carbon_emissions) {
                data[index].co2 = element.industry_carbon_emissions;
            }
            if(element.industry_EBIT_marginal) {
                data[index].ebit = element.industry_EBIT_marginal;
            }
        }
    });
    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{top: 10, right: 20, bottom: 10, left: 20}}>
                    <Line type="linear" strokeWidth={3} stroke="#2AA784" dataKey={dataKey} />
                    <Line type="linear" dataKey={progKey} stroke="#ccc" strokeWidth={3} strokeDasharray="3 3"  />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="turn" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

LineChartComp.propTypes = {
    title: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    progKey: PropTypes.string.isRequired,
    // socket: PropTypes.object.isRequired
}

export default LineChartComp;
