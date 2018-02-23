import React from 'react';
import ReactDOM from 'react-dom';

import Card, { CardError } from './card.component';


beforeEach(function(){
    spyOn(console, 'error');
})

describe('Card Component', () => {
    test('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Card name={'testName'} id={4} {...{properties: [{'test': 'what'}]}}/>, div);
        ReactDOM.unmountComponentAtNode(div);
        expect(console.error).not.toHaveBeenCalled();
    });
    
    test('if name is not passed, it will throw invalid type error', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Card id={4} {...{properties: [{'test': 'what'}]}}/>, div);
        ReactDOM.unmountComponentAtNode(div);
        expect(console.error).toHaveBeenCalled();
    });
    
    test('if id is not passed, it will throw invalid type error', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Card name={'testName'} {...{properties: [{'test': 'what'}]}}/>, div);
        ReactDOM.unmountComponentAtNode(div);
        expect(console.error).toHaveBeenCalled();
    });
    
    test('if properties are not passed, it will throw invalid type error', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Card name={'testName'} id={4} />, div);
        ReactDOM.unmountComponentAtNode(div);
        expect(console.error).toHaveBeenCalled();
    });
    
    test('if properties are incorrect type, it will throw a CardError with Map Properties', () => {
        expect(() => {
            const div = document.createElement('div');
            ReactDOM.render(<Card name={'testName'} id={4} {...{properties: 'test'}}/>, div);
            ReactDOM.unmountComponentAtNode(div);
        }).toThrow(CardError)
    });
})
