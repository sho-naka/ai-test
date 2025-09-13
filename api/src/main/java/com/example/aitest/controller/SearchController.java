package com.example.aitest.controller;

import com.example.aitest.dto.ErrorResponse;
import com.example.aitest.dto.SearchRequest;
import com.example.aitest.dto.SearchResponse;
import com.example.aitest.service.SearchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    private final SearchService service;

    public SearchController(SearchService service){ this.service = service; }

    @GetMapping("/health")
    public ResponseEntity<String> health(){ return ResponseEntity.ok("ok"); }

    @PostMapping("/search")
    public ResponseEntity<?> search(@Valid @RequestBody SearchRequest req){
        try{
            SearchResponse resp = service.search(req);
            return ResponseEntity.ok(resp);
        }catch(Exception ex){
            ErrorResponse er = new ErrorResponse();
            ErrorResponse.ErrorBody b = new ErrorResponse.ErrorBody();
            b.code = "PARSE_ERROR";
            b.message = ex.getMessage();
            er.setError(b);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(er);
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex){
        FieldError fe = ex.getBindingResult().getFieldErrors().get(0);
        ErrorResponse er = new ErrorResponse();
        ErrorResponse.ErrorBody b = new ErrorResponse.ErrorBody();
        b.code = "VALIDATION_ERROR";
        b.message = fe.getField() + " " + fe.getDefaultMessage();
        er.setError(b);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
    }
}
