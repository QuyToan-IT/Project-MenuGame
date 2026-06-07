import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GameManagement from '../pages/GameManagement'
import * as api from '../api'

vi.mock('../api', () => ({
  getGames: vi.fn(),
  getCategories: vi.fn(),
  createGame: vi.fn(),
  updateGame: vi.fn(),
  deleteGame: vi.fn(),
}))


const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('GameManagement Component', () => {
  const mockGames = [
    { id: 1, name: 'Game Action 1', iconUrl: 'http://example.com/1.jpg', categories: [{ id: 1, name: 'Action' }], type: 'ONLINE' },
    { id: 2, name: 'Game RPG 2', iconUrl: 'http://example.com/2.jpg', categories: [{ id: 2, name: 'RPG' }], type: 'OFFLINE' },
  ]

  const mockCategories = [
    { id: 1, name: 'Action', description: 'Action desc' },
    { id: 2, name: 'RPG', description: 'RPG desc' },
  ]

  beforeEach(() => {
    api.getGames.mockResolvedValue(mockGames)
    api.getCategories.mockResolvedValue(mockCategories)
    vi.spyOn(window, 'alert').mockImplementation(() => {}) // Chặn alert mặc định để test
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // TC2: Hiển thị danh sách Game
  it('TC2: renders games list after loading', async () => {
    render(<MemoryRouter><GameManagement /></MemoryRouter>)
    
    await waitFor(() => {
      expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument()
    })

    // Kiểm tra card thống kê
    expect(screen.getByText('Tổng game')).toBeInTheDocument()
    
    // Kiểm tra render dữ liệu trên bảng
    expect(screen.getByText('Game Action 1')).toBeInTheDocument()
    expect(screen.getByText('Game RPG 2')).toBeInTheDocument()
  })

  // TC3: Tìm kiếm Game
  it('TC3: filters games by search term', async () => {
    render(<MemoryRouter><GameManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    const searchInput = screen.getByPlaceholderText('Tìm kiếm game...')
    
    // Tìm từ khóa tồn tại
    fireEvent.change(searchInput, { target: { value: 'RPG' } })
    expect(screen.getByText('Game RPG 2')).toBeInTheDocument()
    expect(screen.queryByText('Game Action 1')).not.toBeInTheDocument()

    // Tìm từ khóa không tồn tại
    fireEvent.change(searchInput, { target: { value: 'Không tồn tại' } })
    expect(screen.getByText('Không có game nào')).toBeInTheDocument()
  })

  // TC4: Thêm Game mới - Validation
  it('TC4: shows validation errors when adding an invalid game', async () => {
    render(<MemoryRouter><GameManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /Thêm game/i }))
    
    // Modal hiện lên, ấn Lưu luôn
    const saveBtn = screen.getByRole('button', { name: /Lưu/i })
    fireEvent.click(saveBtn)

    // Kiểm tra bắt lỗi bỏ trống
    expect(screen.getByText('Vui lòng nhập tên game')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng nhập URL ảnh')).toBeInTheDocument()

    // Kiểm tra bắt lỗi URL không hợp lệ
    const imgInput = screen.getByPlaceholderText('https://...')
    fireEvent.change(imgInput, { target: { value: 'not-a-url' } })
    fireEvent.click(saveBtn)
    expect(screen.getByText('Vui lòng nhập URL ảnh hợp lệ (bắt đầu bằng http:// hoặc https://)')).toBeInTheDocument()
  })

  // TC5: Thêm Game mới - Thành công
  it('TC5: adds a new game successfully', async () => {
    render(<MemoryRouter><GameManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    api.createGame.mockResolvedValue({})
    api.getGames.mockResolvedValue([...mockGames, { id: 3, name: 'New Game', iconUrl: 'http://a.com/a.jpg', type: 'ONLINE', categories: [] }])

    fireEvent.click(screen.getByRole('button', { name: /Thêm game/i }))
    
    fireEvent.change(screen.getByPlaceholderText('Nhập tên game...'), { target: { value: 'New Game' } })
    fireEvent.change(screen.getByPlaceholderText('https://...'), { target: { value: 'https://example.com/new.jpg' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Lưu/i }))
    
    await waitFor(() => {
      expect(api.createGame).toHaveBeenCalledTimes(1)
    })
    
    // Đảm bảo danh sách được làm mới và có game mới
    await waitFor(() => expect(screen.getByText('New Game')).toBeInTheDocument())
  })

  // TC6: Chỉnh sửa Game
  it('TC6: edits an existing game', async () => {
    render(<MemoryRouter><GameManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    const editButtons = screen.getAllByTitle('Sửa')
    fireEvent.click(editButtons[0]) // Click sửa Game 1

    // Modal Edit lên, có sẵn value
    const titleInput = screen.getByDisplayValue('Game Action 1')
    fireEvent.change(titleInput, { target: { value: 'Game Action 1 Edited' } })

    api.updateGame.mockResolvedValue({})
    fireEvent.click(screen.getByRole('button', { name: /Lưu/i }))

    await waitFor(() => {
      expect(api.updateGame).toHaveBeenCalledTimes(1)
    })
  })

  // TC7: Xóa Game
  it('TC7: deletes a game after confirmation', async () => {
    render(<MemoryRouter><GameManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    const deleteButtons = screen.getAllByTitle('Xóa')
    fireEvent.click(deleteButtons[0])

    // Bảng xác nhận hiện ra, bấm Hủy
    expect(screen.getByText(/Bạn có chắc muốn xóa/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }))
    expect(screen.queryByText(/Bạn có chắc muốn xóa/i)).not.toBeInTheDocument()

    // Bấm lại và chọn Xóa
    fireEvent.click(deleteButtons[0])
    api.deleteGame.mockResolvedValue({})
    fireEvent.click(screen.getByText('Xóa', { selector: 'button' }))

    await waitFor(() => {
      expect(api.deleteGame).toHaveBeenCalledTimes(1)
    })
    
    // Element sẽ biến mất khỏi DOM
    expect(screen.queryByText('Game Action 1')).not.toBeInTheDocument()
  })

  // TC13: Xử lý lỗi API (Error State)
  it('TC13: shows error state when API fails', async () => {
    api.getGames.mockRejectedValue(new Error('Network disconnected'))
    
    render(<MemoryRouter><GameManagement /></MemoryRouter>)
    
    await waitFor(() => {
      expect(screen.getByText('Lỗi tải dữ liệu')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Network disconnected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
  })
})