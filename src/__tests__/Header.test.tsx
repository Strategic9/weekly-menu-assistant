import React from 'react';
import { render } from '@testing-library/react';
import {Header}  from '../components/Header';
import mediaQuery from 'css-mediaquery';

declare global {
  interface Window { matchMedia: (query: string) => MediaQueryList; }
}

const createMatchMedia = (width: string) => (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {}
  });

describe('Render', () => {
  it('should create a header element', () => {
    const {container} = render(<Header />);
    
    const boxes = container.getElementsByTagName('header');
    
    expect(boxes.length).toEqual(1);
  });

  it('should create avatar element', () => {
    const {container} = render(<Header />);
    const avatar = container.getElementsByClassName('avatar-img');
    expect(avatar.length).toEqual(1);
  });

  it('should render profile name', () => {
    const { container } = render(<Header />);
    const profileName = container.getElementsByClassName('profile-name');
    expect(profileName.length === 1).toBeTruthy();
  });

  it('should render profile mail', () => {
    const { container } = render(<Header />);
    const profileMail = container.getElementsByClassName('profile-mail');
    expect(profileMail.length === 1).toBeTruthy();
  });

  it('should render logo', () => {
    const { container } = render(<Header />);
    const logo = container.getElementsByClassName('header-logo');
    expect(logo.length === 1).toBeTruthy();
  });

  it('Should hide search input in mobile version', async () => {
    const { container } = render(<Header />);
    (window as Window).matchMedia = createMatchMedia('200') as unknown as (query: string) => MediaQueryList;

    const searchInput = container.getElementsByClassName('header-search');

    expect(searchInput.length === 0).toBeTruthy();
  });
});