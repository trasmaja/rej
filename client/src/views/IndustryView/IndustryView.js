import './IndustryView.css';
import PropTypes from 'prop-types';
import TimeLine from '../../components/timeline/timeline';
import LineChart from '../../components/lineChart/lineChart';
import PastEvents from '../../components/pastEvents/pastEvents';

const IndustryView = (props) => {
    console.log(props)
    return (
        <main>
            <TimeLine sectorName={props.sectorName} />
            <div className="wrapper-currentStatus">
                <h2>Nulägesrapport</h2>
                <LineChart title="CO2-pris" />
                <LineChart title="EBIT" />
                <PastEvents />
            </div>
        </main>
    );
}

IndustryView.propTypes = {
    sectorName: PropTypes.string.isRequired
    // socket: PropTypes.object.isRequired
}

export default IndustryView;
