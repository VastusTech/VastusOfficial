import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';

export function store(initialState) {
    if (initialState) {
        return configureStore()(initialState);
    }
    else {
        return configureStore()({});
    }
}

export default () => {
    configure({
        adapter: new Adapter()
    });
}