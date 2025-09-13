package com.example.aitest.service;

import org.springframework.stereotype.Service;
import com.example.aitest.dto.SearchRequest;
import com.example.aitest.dto.SearchResult;
import com.example.aitest.dto.Meta;
import com.example.aitest.dto.SearchResponse;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {
    public String demo(){
        return "demo result";
    }

    public SearchResponse search(SearchRequest req){
        List<SearchResult> results = new ArrayList<>();
        SearchResult r1 = new SearchResult();
        r1.setTitle("（デモ）省エネ設備導入補助");
        r1.setArea(req.getPrefecture() + req.getCity());
        r1.setIndustry(req.getIndustry());
        r1.setSubsidyAmount("上限50万円（2/3補助）");
        r1.setUrl("https://example.local/subsidy/1");
        r1.setSummary("ECサイト構築・機器購入を支援する補助金の例です。");
        r1.setConfidence(0.82);
        r1.setSource("デモソース");
        r1.setPublishedAt(OffsetDateTime.now().toLocalDate().toString());
        results.add(r1);

        SearchResult r2 = new SearchResult();
        r2.setTitle("（デモ）テレワーク環境整備補助");
        r2.setArea("全国");
        r2.setIndustry(req.getIndustry());
        r2.setSubsidyAmount("上限100万円（1/2補助）");
        r2.setUrl("https://example.local/subsidy/2");
        r2.setSummary("リモートワーク用の機器・ソフト導入支援の例です。");
        r2.setConfidence(0.72);
        r2.setSource("デモソース");
        r2.setPublishedAt(OffsetDateTime.now().toLocalDate().toString());
        results.add(r2);

        Meta meta = new Meta();
        meta.setCount(results.size());
        meta.setElapsedMs(12);
        meta.setGeneratedAt(OffsetDateTime.now().toString());

        SearchResponse resp = new SearchResponse();
        resp.setQueryEcho(req);
        resp.setResults(results);
        resp.setMeta(meta);
        return resp;
    }
}
