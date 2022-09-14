import './votersCosts.css';
import PropTypes from 'prop-types';
import React from 'react';
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, BarChart, ReferenceLine, Label } from 'recharts';

const VoterCosts = (props) => {
    const { propData, title } = props;
    const data = [{ turn: '2022', votersDisInc: null, votersTaxBurd: null, el: null, other: null, rest: null }, { turn: '2025', votersDisInc: null, votersTaxBurd: null,  el: null, other: null, rest: null}, { turn: '2030', votersDisInc: null, votersTaxBurd: null,  el: null, other: null, rest: null}, { turn: '2035', votersDisInc: null, votersTaxBurd: null,  el: null, other: null, rest: null}, { turn: '2040', votersDisInc: null, votersTaxBurd: null,  el: null, other: null, rest: null}, { turn: '2045', votersDisInc: null, votersTaxBurd: null,  el: null, other: null, rest: null}];

    propData.forEach((element, index) => {
        if (element != null) {
            if (element.voters_tax_burden != null) {
                data[index].votersTaxBurd = Math.ceil(element.voters_tax_burden / 1000);
            }
            if (element.voters_cost_el != null) {
                data[index].el = Math.ceil(element.voters_cost_el / 1000);
            }
            if (element.voters_costs_other != null) {
                data[index].other = Math.ceil(element.voters_costs_other / 1000);
            }
            if (element.voters_dis_income_after_expenses != null) {
                const disInc = Math.ceil(element.voters_dis_income_after_expenses / 1000);
                if(disInc >= 0) {
                    data[index].votersDisInc = disInc;
                } else {
                    data[index].votersDisInc = 0;
                }

            }
        }
    });

    return (
        <div className="wrapper-lineChart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 60, bottom: 10, left: 30 }}>
                    <XAxis stroke="#F6B2BB" strokeWidth={1} tickMargin={10} dataKey="turn" />
                    <YAxis stroke="#F6B2BB" strokeWidth={1} width={5} tickCount={4} domain={[datamin => datamin > 0 ? 0 : datamin, 'datamax']} />
                    <Bar stackId="one" name="Skatt" fill="#EC6161" dataKey={"votersTaxBurd"} />
                    <Bar stackId="one" name="Nödvändiga utgifter" fill="#0094A3" dataKey={"other"} />
                    <Bar stackId="one" name="Elkostnader" fill="#fcba03" dataKey={"el"} />
                    <Bar stackId="one" name="Resterande inkomst" fill="#5dcf3e" dataKey={"votersDisInc"} />
                    <ReferenceLine y={32} strokeWidth={2} stroke="#EC6161" strokeDasharray="5 5">
                        <Label fill='#EC6161' value="Inkomst" position="right" />
                    </ReferenceLine>
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
