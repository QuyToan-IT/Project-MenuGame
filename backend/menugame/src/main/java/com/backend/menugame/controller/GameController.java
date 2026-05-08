package com.backend.menugame.controller;

import com.backend.menugame.model.Game;
import com.backend.menugame.model.GameType;
import com.backend.menugame.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@CrossOrigin("*") // Cho phép React (port 5173) gọi API mà không bị chặn
public class GameController {

    @Autowired
    private GameService gameService;

    // 1. Lấy tất cả danh sách Game (Mặc định)
    @GetMapping
    public List<Game> getAll() {
        return gameService.getAllGames();
    }

    // 2. TÌM KIẾM & LỌC (Quan trọng nhất)
    // URL ví dụ: /api/games/search?name=Liên Minh&type=ONLINE&categoryId=1
    @GetMapping("/search")
    public List<Game> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) GameType type) {
        return gameService.searchGames(name, categoryId, type);
    }

    // 3. THÊM MỚI GAME
    @PostMapping
    public Game create(@RequestBody Game game) {
        return gameService.saveGame(game);
    }

    // 4. CHỈNH SỬA GAME
    @PutMapping("/{id}")
    public ResponseEntity<Game> update(@PathVariable Long id, @RequestBody Game gameDetails) {
        return ResponseEntity.ok(gameService.saveGame(gameDetails));
    }

    // 5. XÓA GAME
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.ok().build();
    }
}