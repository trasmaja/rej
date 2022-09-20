import './lineChartElPrice.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const LineChartElPrice = (props) => {
    const { propData, title, dataKey } = props;
    const data = [{ turn: '2022',  el: null,  }, { turn: '2025',  el: null,  }, { turn: '2030',  el: null,  }, { turn: '2035',  el: null,  }, { turn: '2040',  el: null,  }, { turn: '2045',  el: null, totalCo2: null }];
    propData.forEach((element, index) => {
        if (element != null) {
            if (element.price_el != null) {
                data[index].el = Math.floor(element.price_el * 100) / 100;
            }
        }
    });
    return (
        <div className="wrapper-lineChart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid strokeWidth={1} stroke="#ccc" />
                    <XAxis stroke="#999" strokeWidth={1} tickMargin={10} dataKey="turn" />
                    <YAxis stroke="#999" strokeWidth={1} width={5} tickCount={6} domain={[0, datamax => (datamax + 0.2)]} />
                    <Line type="linear" strokeWidth={2} stroke="#2B3B55" dataKey={"el"} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

LineChartElPrice.propTypes = {
    propData: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
}

export default LineChartElPrice;
