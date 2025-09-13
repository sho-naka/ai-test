package com.example.aitest.dto;

import java.util.List;

public class SearchResponse {
    private SearchRequest queryEcho;
    private List<SearchResult> results;
    private Meta meta;

    public SearchRequest getQueryEcho(){ return queryEcho; }
    public void setQueryEcho(SearchRequest queryEcho){ this.queryEcho = queryEcho; }
    public List<SearchResult> getResults(){ return results; }
    public void setResults(List<SearchResult> results){ this.results = results; }
    public Meta getMeta(){ return meta; }
    public void setMeta(Meta meta){ this.meta = meta; }
}
