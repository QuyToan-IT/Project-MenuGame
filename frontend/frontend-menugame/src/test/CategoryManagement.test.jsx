import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CategoryManagement from '../pages/CategoryManagement'
import * as api from '../api'

vi.mock('../api', () => ({
  getGames: vi.fn(),
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}))

describe('CategoryManagement Component', () => {
  const mockCategories = [
    { id: 1, name: 'Action', description: 'Action description' },
    { id: 2, name: 'RPG', description: 'RPG description' },
  ]


  const mockGames = [
    { id: 1, name: 'Game 1', categoryIds: [1] },
    { id: 2, name: 'Game 2', categoryIds: [1] },
  ]

  beforeEach(() => {
    api.getCategories.mockResolvedValue(mockCategories)
    api.getGames.mockResolvedValue(mockGames)
    vi.spyOn(window, 'alert').mockImplementation(() => {}) // Chặn alert 
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // TC8: Hiển thị danh sách Thể loại
  it('TC8: renders categories list after loading with correct game count', async () => {
    render(<MemoryRouter><CategoryManagement /></MemoryRouter>)
    
    await waitFor(() => {
      expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('RPG')).toBeInTheDocument()

    // Category Action được mapping với 2 games
    const actionRow = screen.getByText('Action').closest('tr')
    expect(actionRow).toHaveTextContent('2') // Cột số lượng Game
  })

  // TC9: Tìm kiếm Thể loại
  it('TC9: filters categories by search term', async () => {
    render(<MemoryRouter><CategoryManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    const searchInput = screen.getByPlaceholderText('Tìm kiếm thể loại...')
    
    fireEvent.change(searchInput, { target: { value: 'Action' } })
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.queryByText('RPG')).not.toBeInTheDocument()
  })

  // TC10: Thêm Thể loại mới
  it('TC10: adds a new category with validation', async () => {
    render(<MemoryRouter><CategoryManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /Thêm thể loại/i }))
    
    // Validation check: Để trống tên
    const saveBtn = screen.getByRole('button', { name: /Lưu/i })
    fireEvent.click(saveBtn)
    expect(screen.getByText('Vui lòng nhập tên thể loại')).toBeInTheDocument()

    // Thêm thành công
    api.createCategory.mockResolvedValue({ id: 3, name: 'Puzzle', description: 'Puzzle desc' })
    
    fireEvent.change(screen.getByPlaceholderText('Nhập tên thể loại...'), { target: { value: 'Puzzle' } })
    fireEvent.change(screen.getByPlaceholderText('Mô tả ngắn về thể loại này...'), { target: { value: 'Puzzle desc' } })
    
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(api.createCategory).toHaveBeenCalledTimes(1)
    })

    // Bảng cập nhật thể loại mới
    expect(screen.getByText('Puzzle')).toBeInTheDocument()
  })

  // TC11: Chỉnh sửa Thể loại
  it('TC11: edits an existing category', async () => {
    render(<MemoryRouter><CategoryManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    const editButtons = screen.getAllByTitle('Sửa')
    fireEvent.click(editButtons[0]) // Edit 'Action'

    const nameInput = screen.getByDisplayValue('Action')
    fireEvent.change(nameInput, { target: { value: 'Action Edited' } })

    api.updateCategory.mockResolvedValue({ id: 1, name: 'Action Edited', description: 'Action description' })
    
    fireEvent.click(screen.getByRole('button', { name: /Lưu/i }))

    await waitFor(() => {
      expect(api.updateCategory).toHaveBeenCalledTimes(1)
    })

    // Đảm bảo UI đã đổi tên
    expect(screen.getByText('Action Edited')).toBeInTheDocument()
  })

  // TC12: Xóa Thể loại
  it('TC12: deletes a category after confirmation', async () => {
    render(<MemoryRouter><CategoryManagement /></MemoryRouter>)
    await waitFor(() => expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument())

    const deleteButtons = screen.getAllByTitle('Xóa')
    fireEvent.click(deleteButtons[1]) // Delete 'RPG'

    // Kiểm tra tên hiển thị trong modal
    expect(screen.getByText(/"RPG"/i)).toBeInTheDocument()

    api.deleteCategory.mockResolvedValue({})
    fireEvent.click(screen.getByText('Xóa', { selector: 'button' }))

    await waitFor(() => {
      expect(api.deleteCategory).toHaveBeenCalledTimes(1)
    })

    expect(screen.queryByText('RPG')).not.toBeInTheDocument()
  })

  // TC13: Xử lý lỗi API
  it('TC13: shows error state when API fails', async () => {
    api.getCategories.mockRejectedValue(new Error('Lỗi 500 Backend'))
    
    render(<MemoryRouter><CategoryManagement /></MemoryRouter>)
    
    await waitFor(() => {
      expect(screen.getByText('Lỗi tải dữ liệu')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Lỗi 500 Backend')).toBeInTheDocument()
  })
})