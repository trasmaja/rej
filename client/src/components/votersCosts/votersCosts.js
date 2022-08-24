import './votersCosts.css';
import PropTypes from 'prop-types';
import React from 'react';
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, BarChart } from 'recharts';

const VoterCosts = (props) => {
    const { propData, title } = props;
    const data = [{ turn: '2022', votersDisInc: null, votersTaxBurd: null, }, { turn: '2025', votersDisInc: null, votersTaxBurd: null, }, { turn: '2030', votersDisInc: null, votersTaxBurd: null, }, { turn: '2035', votersDisInc: null, votersTaxBurd: null, }, { turn: '2040', votersDisInc: null, votersTaxBurd: null, }, { turn: '2045', votersDisInc: null, votersTaxBurd: null, }];

    propData.forEach((element, index) => {
        if (element != null) {
            if (element.voters_tax_burden != null) {
                data[index].votersTaxBurd = element.voters_tax_burden;
            }
            if (element.voters_dis_income != null) {
                data[index].votersDisInc = element.voters_dis_income;
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
                    <YAxis width={5} tick={false} domain={[0, datamax => (datamax + 1000)]} />
                    <Bar stackId="one" name="Disponibel inkomst" fill="#0094A3" dataKey={"votersDisInc"} />
                    <Bar stackId="one" name="Skatt" fill="#EC6161" dataKey={"votersTaxBurd"} />
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

VoterCosts.propTypes = {
    title: PropTypes.string.isRequired,
    propData: PropTypes.array.isRequired,
}

export default VoterCosts;
