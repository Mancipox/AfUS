import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import qr_page_component from './components/qr_module/qr_professor'


class Core extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={qr_page_component} exact />
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Core />, document.getElementById('render_component'))