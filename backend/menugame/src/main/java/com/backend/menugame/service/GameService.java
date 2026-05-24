package com.backend.menugame.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.backend.menugame.model.Category;
import com.backend.menugame.model.Game;
import com.backend.menugame.model.GameType;
import com.backend.menugame.repository.CategoryRepository;
import com.backend.menugame.repository.GameRepository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;      

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game saveGame(Game game) {
        if (game.getId() != null && (game.getCategories() == null || game.getCategories().isEmpty())) {
            gameRepository.findById(game.getId()).ifPresent(existing -> {
                game.setCategories(existing.getCategories());
            });
        } else if (game.getCategories() != null) {
            List<Category> managedCategories = new ArrayList<>();
            for (Category cat : game.getCategories()) {
                if (cat.getId() != null) {
                    categoryRepository.findById(cat.getId()).ifPresent(managedCategories::add);
                }
            }
            game.setCategories(managedCategories);
        }
        return gameRepository.save(game);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }

    // Logic tìm kiếm và lọc phức hợp
    public List<Game> searchGames(String name, Long categoryId, GameType type) {
        return gameRepository.findAll((Specification<Game>) (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (categoryId != null) {
                Join<Game, Category> categories = root.join("categories");
                predicates.add(cb.equal(categories.get("id"), categoryId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
}