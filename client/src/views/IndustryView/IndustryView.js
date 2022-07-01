import './IndustryView.css';
import PropTypes from 'prop-types';
import TimeLine from '../../components/timeline/timeline';
import LineChart from '../../components/lineChart/lineChart';
import PastEvents from '../../components/pastEvents/pastEvents';
import DecisionBasisWithGraph from '../../components/decisionBasisWithGraph/decisionBasisWithGraph';
import DecisionBasisWithText from '../../components/decisionBasisWithText/decisionBasisWithText';
import DecisionVoteList from '../../components/decisionVoteList/decisionVoteList';

const IndustryView = (props) => {
    console.log(props)
    const decisions = ["1) Investera i biodrivmedel", "2) Investera i el", "3) Investera i R&D"]
    return (
        <main>
            <TimeLine sectorName={props.sectorName} />
            <div className="wrapper-currentStatus">
                <h2>Nulägesrapport</h2>
                <LineChart title="CO2-pris" />
                <LineChart title="EBIT" />
                <PastEvents />
                <h2>Beslutsunderlag</h2>
                <DecisionBasisWithGraph title={decisions[0]} />
                <DecisionBasisWithGraph title={decisions[1]}  />
                <DecisionBasisWithText title={decisions[2]}  text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem." />
                <h2>Rösta på beslut</h2>
                <DecisionVoteList decisions={decisions}/>
            </div>
        </main>
    );
}

IndustryView.propTypes = {
    sectorName: PropTypes.string.isRequired
    // socket: PropTypes.object.isRequired
}

export default IndustryView;
