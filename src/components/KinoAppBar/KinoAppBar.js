import React from 'react';
import AppBar from '@material-ui/core/AppBar';

import './KinoAppBar.css';

export class KinoAppBar extends React.Component {
    render() {
        return (
            <AppBar position="static">
                <h5 className="ml-2">Kino</h5>
            </AppBar>

        );
    }
}