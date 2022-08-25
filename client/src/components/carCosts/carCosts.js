import './carCosts.css';
import PropTypes from 'prop-types';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const CarCosts = (props) => {
    const { propData, title } = props;
    const data = [{ turn: '2022', carGas: null, carEl: null, }, { turn: '2025', carGas: null, carEl: null, }, { turn: '2030', carGas: null, carEl: null, }, { turn: '2035', carGas: null, carEl: null, }, { turn: '2040', carGas: null, carEl: null, }, { turn: '2045', carGas: null, carEl: null, }];

    propData.forEach((element, index) => {
        // console.log(index, element)
        if (element != null) {
            if (element.voters_cost_car_el != null) {
                data[index].carEl = element.voters_cost_car_el;
            }
            if (element.voters_cost_car_gas != null) {
                data[index].carGas = element.voters_cost_car_gas;
            }
        }
    });

    return (
        <div className="wrapper-lineChart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis tickMargin={10} dataKey="turn" />
                    <YAxis width={5} tickCount={2} domain={[datamin => (datamin - 500), datamax => (datamax + 500)]} />
                    <Bar name="Kostnad bränslebil" type="linear" fill="#0094A3" dataKey={"carGas"} />
                    <Bar name="Kostnad elbil" type="linear" fill="#EC6161" dataKey={"carEl"} />
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

CarCosts.propTypes = {
    title: PropTypes.string.isRequired,
    propData: PropTypes.array.isRequired,
}

export default CarCosts;