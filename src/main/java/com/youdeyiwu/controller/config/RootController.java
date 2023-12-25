package com.youdeyiwu.controller.config;

import com.youdeyiwu.model.dto.config.UpdateRootConfigDto;
import com.youdeyiwu.service.config.RootService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * root.
 *
 * @author dafengzhen
 */
@RequiredArgsConstructor
@RequestMapping(value = "/configs/root")
@RestController
public class RootController {

  private final RootService rootService;

  @PutMapping
  public ResponseEntity<Void> update(@Valid @RequestBody UpdateRootConfigDto dto) {
    rootService.update(dto);
    return ResponseEntity.noContent().build();
  }
}