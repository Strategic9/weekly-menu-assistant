import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import './matchMedia.mock'
import { Sidebar } from '../components/Sidebar'
import PageWrapper from '../pages/page-wrapper'
import mediaQuery from 'css-mediaquery'
import { ThemeWrapper } from '../services/themeWrapper'
import '@testing-library/jest-dom'

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList
  }
}

const createMatchMedia = (width: string) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => { },
  removeListener: () => { }
})

//mocking router implementation
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
  asPath: '',
  startsWith: '',
  push: jest.fn()
}))

describe('Render sidebar on desktop', () => {
  beforeAll(() => {
    //set matchMedia
    ; (window as Window).matchMedia = createMatchMedia('1200') as unknown as (
      query: string
    ) => MediaQueryList
  })
  it('should render sidebar text elements', () => {
    const { container } = render(<Sidebar />, { wrapper: ThemeWrapper })

    const mockElementsArray = [
      'Menyer',
      'Ingredienser',
      'Maträtter',
      'Kategorier',
      'Inköpslistor'
    ]

    const sidebarElements = Array.from(container.getElementsByClassName('sidebar-text'))
    const sidebarElementsArray = sidebarElements.map((element) => element.innerHTML)

    expect(sidebarElementsArray).toEqual(mockElementsArray)
  })
})

describe('render sidebar on mobile', () => {
  beforeAll(() => {
    //set matchMedia
    ; (window as Window).matchMedia = createMatchMedia('350') as unknown as (
      query: string
    ) => MediaQueryList

    //mocking localstorage
    const localStorageMock = { getItem: jest.fn().mockReturnValue('token') }

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })
  })

  it('should render sidebar Navigation text when clicking on menu icon', async () => {
    render(<PageWrapper children={<></>} />, { wrapper: ThemeWrapper })

    const button = screen.getByLabelText('Open navigation')
    fireEvent.click(button)

    const sideBarTitle = screen.getByText('Navigeringsmeny')
    expect(sideBarTitle).toBeInTheDocument()

    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)

    expect(sideBarTitle).not.toBeVisible()
  })
})
