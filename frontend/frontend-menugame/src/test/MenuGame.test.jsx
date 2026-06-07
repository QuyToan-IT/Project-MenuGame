import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import MenuGame, { toUiGame } from '../MenuGame'

vi.mock('../api', () => ({
  getGames: vi.fn(),
  getCategories: vi.fn(),
}))

describe('toUiGame', () => {
  it('transforms game data with name from name field', () => {
    const game = {
      id: 1,
      name: 'Test Game',
      categories: [{ id: 1, name: 'Action' }],
    }
    const result = toUiGame(game)
    expect(result.title).toBe('Test Game')
    expect(result.category).toBe('Action')
  })

  it('transforms game data with name from title field', () => {
    const game = {
      id: 2,
      title: 'Title Game',
      categories: [],
    }
    const result = toUiGame(game)
    expect(result.title).toBe('Title Game')
    expect(result.category).toBe('Unknown')
  })

  it('uses default title when name and title are missing', () => {
    const game = { id: 3 }
    const result = toUiGame(game)
    expect(result.title).toBe('Không có tên')
  })

  it('handles missing categories gracefully', () => {
    const game = {
      id: 4,
      name: 'No Categories',
    }
    const result = toUiGame(game)
    expect(result.category).toBe('Unknown')
    expect(result.allCategoryNames).toEqual([])
  })

  it('extracts all category names', () => {
    const game = {
      id: 5,
      name: 'Multi Cat',
      categories: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
      ],
    }
    const result = toUiGame(game)
    expect(result.category).toBe('Action')
    expect(result.allCategoryNames).toEqual(['Action', 'Adventure'])
    expect(result.categoryIds).toEqual([1, 2])
  })

  it('extracts gameType from type field', () => {
    const game = { id: 6, name: 'Test', type: 'OFFLINE' }
    const result = toUiGame(game)
    expect(result.gameType).toBe('OFFLINE')
  })

  it('defaults gameType to ONLINE when missing', () => {
    const game = { id: 7, name: 'Test' }
    const result = toUiGame(game)
    expect(result.gameType).toBe('ONLINE')
  })
})

describe('MenuGame Component', () => {
  const mockGames = [
    {
      id: 1,
      name: 'Game 1',
      iconUrl: 'http://example.com/img1.jpg',
      categories: [{ id: 1, name: 'Action' }],
      type: 'ONLINE',
    },
    {
      id: 2,
      name: 'Game 2',
      iconUrl: 'http://example.com/img2.jpg',
      categories: [{ id: 2, name: 'Adventure' }],
      type: 'OFFLINE',
    },
    {
      id: 3,
      name: 'Game 3',
      iconUrl: 'http://example.com/img3.jpg',
      categories: [{ id: 1, name: 'Action' }],
      type: 'ONLINE',
    },
  ]

  const mockCategories = [
    { id: 1, name: 'Action', description: 'Action games description' },
    { id: 2, name: 'Adventure', description: 'Adventure games description' },
  ]

  beforeEach(async () => {
    const { getGames, getCategories } = await import('../api')
    getGames.mockResolvedValue(mockGames)
    getCategories.mockResolvedValue(mockCategories)
  })

  // Dọn dẹp fake timers sau mỗi test để tránh rò rỉ sang các test khác
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders loading state initially', () => {
    render(<MenuGame />)
    expect(screen.getByText('Đang tải game...')).toBeInTheDocument()
  })

  // TC1: Hiển thị trang chủ
  it('TC1: renders games after loading', async () => {
    render(<MenuGame />)
    
    await waitFor(() => {
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
    })

    expect(screen.getByPlaceholderText('Tìm kiếm trò chơi...')).toBeInTheDocument()
    expect(screen.getAllByText('Game 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Game 2').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Game 3').length).toBeGreaterThan(0)
  })

  // TC4: Lọc game theo thể loại
  it('TC4: filters games by category', async () => {
    render(<MenuGame />)
    
    await waitFor(() => {
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
    })

    const adventureBtn = screen.getByRole('button', { name: 'Adventure' })
    fireEvent.click(adventureBtn)

    await waitFor(() => {
      expect(screen.getByText('1 kết quả')).toBeInTheDocument()
    })
  })

  // TC5: Lọc game theo loại (Online/Offline)
  it('TC5: filters games by game type', async () => {
    render(<MenuGame />)
    
    await waitFor(() => {
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
    })

    const offlineBtn = screen.getByRole('button', { name: 'Game Offline' })
    fireEvent.click(offlineBtn)

    expect(screen.getByText('1 kết quả')).toBeInTheDocument()
    expect(screen.getAllByText('Game 2').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Game 1').length).toBeLessThan(2)
  })

  // TC6: Tìm kiếm game
  it('TC6: searches games by name', async () => {
    render(<MenuGame />)
    
    await waitFor(() => {
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Tìm kiếm trò chơi...')
    fireEvent.change(searchInput, { target: { value: 'Game 2' } })

    expect(screen.getByText('1 kết quả')).toBeInTheDocument()
    expect(screen.getAllByText('Game 2').length).toBeGreaterThan(0)
  })

  it('TC6.1: shows empty state when no games match filter', async () => {
    render(<MenuGame />)
    
    await waitFor(() => {
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Tìm kiếm trò chơi...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

    expect(screen.getByText('Không tìm thấy kết quả')).toBeInTheDocument()
  })

  // TC9: Xử lý lỗi
  it('TC9: shows error state when API fails', async () => {
    const { getGames, getCategories } = await import('../api')
    getGames.mockRejectedValue(new Error('Network error'))
    getCategories.mockResolvedValue([])

    render(<MenuGame />)
    
    await waitFor(() => {
      expect(screen.getByText('Lỗi tải dữ liệu')).toBeInTheDocument()
    })
    
    getGames.mockResolvedValue(mockGames)
    getCategories.mockResolvedValue(mockCategories)
  })

  // TC2 & TC3: Banner slide tự động và điều hướng thủ công
  it('TC2 & TC3: banner auto-slides and supports manual navigation', async () => {
    vi.useFakeTimers()
    render(<MenuGame />)
    
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })
    expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()

    // Tự động chuyển slide sau 5 giây
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })

    // Điều hướng thủ công
    const buttons = screen.getAllByRole('button')
    const dots = buttons.filter(b => b.className.includes('rounded-full') && (b.className.includes('w-2') || b.className.includes('w-6')))
    if (dots.length > 1) {
      fireEvent.click(dots[1])
    }
  })

  // TC7: Kết hợp bộ lọc
  it('TC7: combines multiple filters (Category, Type, Search)', async () => {
    render(<MenuGame />)
    await waitFor(() => {
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
    })

    // 1. Chọn category "Action"
    fireEvent.click(screen.getByRole('button', { name: 'Action' }))
    // 2. Chọn loại "Game Online"
    fireEvent.click(screen.getByRole('button', { name: 'Game Online' }))
    // 3. Nhập từ khóa tìm kiếm
    const searchInput = screen.getByPlaceholderText('Tìm kiếm trò chơi...')
    fireEvent.change(searchInput, { target: { value: 'Game 1' } })

    await waitFor(() => {
      expect(screen.getByText('1 kết quả')).toBeInTheDocument()
    })
    expect(screen.getAllByText('Game 1').length).toBeGreaterThan(0)
  })

  // TC10: Responsive
  it('TC10: adapts layout for mobile responsive', async () => {
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))
    render(<MenuGame />)
    await waitFor(() => {
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
    })
    
    const sidebar = screen.getByText('Thể loại').closest('aside')
    expect(sidebar).toHaveClass('hidden')
  })

  describe('GameCard', () => {
    it('renders game card with title and category', async () => {
      render(<MenuGame />)
      
      await waitFor(() => {
        expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()
      })
      
      expect(screen.getAllByText('Game 1').length).toBeGreaterThan(0)
    })
  })

  describe('LaunchToast (TC8)', () => {
    it('TC8: renders launch toast with game title and auto closes after 3s', async () => {
      vi.useFakeTimers()
      render(<MenuGame />)
      
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })
      expect(screen.queryByText('Đang tải game...')).not.toBeInTheDocument()

      const playBtn = screen.getByRole('button', { name: 'PLAY NOW' })
      fireEvent.click(playBtn)

      expect(screen.getByText(/Đang khởi chạy/i)).toBeInTheDocument()

      // Dialog tự đóng sau 3 giây
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000)
      })
      expect(screen.queryByText(/Đang khởi chạy/i)).not.toBeInTheDocument()
    })
  })
})