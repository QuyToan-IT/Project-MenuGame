package com.backend.menugame.service;

import com.backend.menugame.model.Category;
import com.backend.menugame.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả thể loại
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Tìm một thể loại theo ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Thêm mới hoặc Cập nhật thể loại
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Xóa thể loại
    public void deleteCategory(Long id) {
        // Trước khi xóa, cần kiểm tra xem Category có tồn tại không
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
        }
    }
}