package com.backend.menugame.service;

import com.backend.menugame.model.Game;
import com.backend.menugame.model.GameType;
import com.backend.menugame.model.Category;
import com.backend.menugame.repository.GameRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }

    // Logic tìm kiếm và lọc phức hợp
    public List<Game> searchGames(String name, Long categoryId, GameType type) {
        return gameRepository.findAll((Specification<Game>) (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Tìm theo tên (LIKE %name%)
            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            // 2. Lọc theo Kiểu game (ONLINE, OFFLINE...)
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // 3. Lọc theo Thể loại (Category ID)
            if (categoryId != null) {
                Join<Game, Category> categories = root.join("categories");
                predicates.add(cb.equal(categories.get("id"), categoryId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
}