import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from "enzyme"
import { MemoryRouter } from 'react-router-dom'

import Dashboard from './dashboard.component'
import Card from '../card/card.component'

beforeEach(function(){
    spyOn(console, 'error');
})

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Dashboard /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
  expect(console.error).not.toHaveBeenCalled();
});