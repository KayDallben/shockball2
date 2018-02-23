import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from "enzyme"
import { MemoryRouter } from 'react-router-dom'

import Navigation from './navigation.component'

beforeEach(function(){
    spyOn(console, 'error');
})

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Navigation /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
  expect(console.error).not.toHaveBeenCalled();
});