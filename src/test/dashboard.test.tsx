/**
 * Dashboard component tests (Vitest + React Testing Library)
 * 
 * These tests verify that:
 * - The Dashboard correctly fetches and displays data returned from the mocked API
 * - It renders title and HTML version in the document
 */

import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Dashboard from '../pages/Dashboard'

// Import the actual module to allow type inference
import * as urlService from '../services/urlService'

// Mock the module
vi.mock('../services/urlService', () => ({
  getAllUrls: vi.fn()
}))

// Cast it so we can easily set mock return values
const mockedGetAllUrls = urlService.getAllUrls as unknown as ReturnType<typeof vi.fn>

describe('Dashboard component', () => {

  beforeEach(() => {
    // Clear mock history before each test to avoid leaks
    vi.clearAllMocks()

    // Mock the resolved value to simulate the API response
    mockedGetAllUrls.mockResolvedValue({
      urls: [
        {
          id: 1,
          url: 'https://example.com',
          htmlVersion: 'HTML5',
          title: 'Example',
          h1Count: 1,
          h2Count: 2,
          internalLinks: 5,
          externalLinks: 10,
          brokenLinksCount: 0,
          hasLoginForm: false,
          status: 'done',
          brokenLinksList: []
        }
      ],
      total: 1
    })
  })

  it('renders the dashboard and shows data from API', async () => {
    render(<Dashboard />, { wrapper: BrowserRouter })

    // Check if expected texts appear in the document
    expect(await screen.findByText('Example')).toBeInTheDocument()
    expect(await screen.findByText('HTML5')).toBeInTheDocument()
  })
})
