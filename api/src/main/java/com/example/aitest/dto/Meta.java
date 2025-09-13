package com.example.aitest.dto;

public class Meta {
    private int count;
    private long elapsedMs;
    private String generatedAt;

    public int getCount(){ return count; }
    public void setCount(int count){ this.count = count; }
    public long getElapsedMs(){ return elapsedMs; }
    public void setElapsedMs(long elapsedMs){ this.elapsedMs = elapsedMs; }
    public String getGeneratedAt(){ return generatedAt; }
    public void setGeneratedAt(String generatedAt){ this.generatedAt = generatedAt; }
}
