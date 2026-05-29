package com.backend.menugame.controller;

import com.backend.menugame.model.Category;
import com.backend.menugame.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*") // Cho phép React truy cập
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 1. Lấy danh sách thể loại
    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

    // 2. Thêm mới thể loại
    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    // 3. Chỉnh sửa thể loại
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category categoryDetails) {
        return categoryService.getCategoryById(id)
                .map(category -> {
                    category.setName(categoryDetails.getName());
                    Category updatedCategory = categoryService.saveCategory(category);
                    return ResponseEntity.ok(updatedCategory);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Xóa thể loại
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}