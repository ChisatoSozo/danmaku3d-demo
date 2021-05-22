import browser from 'browser-detect';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ControlsContainer } from './components/ControlsContainer';
import { GlobalsContainer } from './components/GlobalsContainer';
import { LSContainer } from './components/LSContainer';
import { Game } from './pages/Game';
import { Menu } from './pages/Menu';

const checkedRef = {
    current: false
}

function App() {

    if (!checkedRef.current) {
        const result = browser();

        if (result.mobile || result.name !== 'chrome') {
            alert('Unsuported browser configuration.\n\nThe Danmaku3D engine is only confirmed to function well on Desktop Chrome. \n\nDownload here: https://www.google.com/intl/en_ca/chrome/')
        }
        checkedRef.current = true;
    }


    return (
        <GlobalsContainer>
            <ControlsContainer outsideOfRenderer>
                <LSContainer>
                    <Router>
                        <Switch>
                            <Route path="/game/">
                                <Game />
                            </Route>
                            <Route path="/">
                                <Menu />
                            </Route>
                        </Switch>
                    </Router>
                </LSContainer>
            </ControlsContainer>
        </GlobalsContainer>
    );
}

export default App;
