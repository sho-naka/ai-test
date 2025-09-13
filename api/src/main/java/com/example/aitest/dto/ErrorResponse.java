package com.example.aitest.dto;

public class ErrorResponse {
    public static class ErrorBody{ public String code; public String message; }
    private ErrorBody error;
    public ErrorBody getError(){ return error; }
    public void setError(ErrorBody e){ this.error = e; }
}
