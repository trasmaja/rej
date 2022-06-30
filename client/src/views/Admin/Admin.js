import './Admin.css';
import PropTypes from 'prop-types';

export default function Admin(props) {
    return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Admin</h2>
        </main>
    );
}

Admin.propTypes = {
    socket: PropTypes.object.isRequired
}

