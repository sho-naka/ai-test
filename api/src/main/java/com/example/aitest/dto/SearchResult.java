package com.example.aitest.dto;

public class SearchResult {
    private String title;
    private String area;
    private String industry;
    private String subsidyAmount;
    private String url;
    private String summary;
    private Double confidence;
    private String source;
    private String publishedAt;

    // getters/setters
    public String getTitle(){ return title; }
    public void setTitle(String title){ this.title = title; }
    public String getArea(){ return area; }
    public void setArea(String area){ this.area = area; }
    public String getIndustry(){ return industry; }
    public void setIndustry(String industry){ this.industry = industry; }
    public String getSubsidyAmount(){ return subsidyAmount; }
    public void setSubsidyAmount(String subsidyAmount){ this.subsidyAmount = subsidyAmount; }
    public String getUrl(){ return url; }
    public void setUrl(String url){ this.url = url; }
    public String getSummary(){ return summary; }
    public void setSummary(String summary){ this.summary = summary; }
    public Double getConfidence(){ return confidence; }
    public void setConfidence(Double confidence){ this.confidence = confidence; }
    public String getSource(){ return source; }
    public void setSource(String source){ this.source = source; }
    public String getPublishedAt(){ return publishedAt; }
    public void setPublishedAt(String publishedAt){ this.publishedAt = publishedAt; }
}
