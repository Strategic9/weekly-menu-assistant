import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import './matchMedia.mock'
import { Header } from '../components/Header'
import mediaQuery from 'css-mediaquery'
import { ThemeWrapper } from '../services/themeWrapper'

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList
  }
}

const mockedSetTodo = jest.fn()

const createMatchMedia = (width: string) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => { },
  removeListener: () => { }
})

describe('Render on desktop mode', () => {
  beforeAll(() => {
    ; (window as Window).matchMedia = createMatchMedia('1400') as unknown as (
      query: string
    ) => MediaQueryList
  })
  it('should create a header element', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const boxes = container.getElementsByTagName('header')
    expect(boxes.length).toEqual(1)
  })

  it('should create avatar element', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const avatar = container.getElementsByClassName('avatar-img')
    expect(avatar.length).toEqual(1)
  })

  it('should render profile name', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const profileName = container.getElementsByClassName('profile-name')
    expect(profileName.length === 1).toBeTruthy()
  })

  it('should render profile mail', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const profileMail = container.getElementsByClassName('profile-mail')
    expect(profileMail.length === 1).toBeTruthy()
  })

  it('should render logo', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const logo = container.querySelector('#header-logo') as HTMLInputElement
    expect(logo).toBeTruthy()
  })
})

describe('Render on mobile mode', () => {
  beforeAll(() => {
    ; (window as Window).matchMedia = createMatchMedia('400') as unknown as (
      query: string
    ) => MediaQueryList
  })

  it('should create a header element', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const boxes = container.getElementsByTagName('header')
    expect(boxes.length).toEqual(1)
  })

  it('should create avatar element', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const avatar = container.getElementsByClassName('avatar-img')
    expect(avatar.length).toEqual(1)
  })

  it('should not render profile name', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const profileName = container.getElementsByClassName('profile-name')
    expect(profileName.length === 0).toBeTruthy()
  })

  it('should not render profile mail', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const profileMail = container.getElementsByClassName('profile-mail')
    expect(profileMail.length === 0).toBeTruthy()
  })

  it('should render logo', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const logo = container.querySelector('#header-logo') as HTMLInputElement
    expect(logo).toBeTruthy()
  })

  it('Should not render the search input', () => {
    const { container } = render(<Header />, { wrapper: ThemeWrapper })
    const searchInput = container.getElementsByClassName('header-search')
    expect(searchInput.length === 0).toBeTruthy()
  })
})
