import React from 'react';
import ReactDOM from 'react-dom';

import Topbar, { TopbarError } from './topbar.component';
const navigationMock = {
    navLinks: [
      {
        'title': 'My Dash'
      },
      {
        'title': 'News'
      },
      {
        'title': 'Settings'
      }
    ],
    links: [
      {
          'title': 'some Title'
      }
    ]
  }

const malformedNavLinkMock = {
    navLinks: 'string',
    links: [
      {
          'title': 'some Title'
      }
    ]
}

const malformedLinksMock = {
  navLinks: [
    {
      'title': 'My Dash'
    }
  ],
  links: 'string'
}


beforeEach(function(){
    spyOn(console, 'error');
})

test('render without app name should crash', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Topbar appUserName={'Brian Kennedy'} {...navigationMock}/>, div);
  ReactDOM.unmountComponentAtNode(div);
  expect(console.error).toHaveBeenCalled();
});

test('render with app name should not crash', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Topbar appName={'testName'} appUserName={'Brian Kennedy'} {...navigationMock}/>, div);
    ReactDOM.unmountComponentAtNode(div);
    expect(console.error).not.toHaveBeenCalled();
});

test('render with app name of incorrect param type should crash', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Topbar appName={2} appUserName={'Brian Kennedy'} {...navigationMock}/>, div);
    ReactDOM.unmountComponentAtNode(div);
    expect(console.error).toHaveBeenCalled();
});

test('if navLinks prop are incorrect type, it will throw a with Map items', () => {
    expect(() => {
        const div = document.createElement('div');
        ReactDOM.render(<Topbar appName={'testName'} appUserName={'Brian Kennedy'} {...malformedNavLinkMock}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    }).toThrow(TopbarError)
});

test('if links prop are incorrect type, it will throw a with Map items', () => {
    expect(() => {
        const div = document.createElement('div');
        ReactDOM.render(<Topbar appName={'testName'} appUserName={'Brian Kennedy'} {...malformedLinksMock}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    }).toThrow(TopbarError)
});

test('should return empty array of items when no items passed in', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Topbar appName={2} appUserName={'Brian Kennedy'} />, div);
  ReactDOM.unmountComponentAtNode(div);
  expect(console.error).not.toHaveBeenCalled();
})