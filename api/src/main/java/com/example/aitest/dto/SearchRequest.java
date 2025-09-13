package com.example.aitest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SearchRequest {
    @NotBlank
    private String prefecture;

    @NotBlank
    private String city;

    @NotBlank
    private String industry;

    @NotBlank
    @Size(max = 2000)
    private String businessDescription;

    private String purchaseItems;
    private String note;
    private Integer budget;

    public String getPrefecture() { return prefecture; }
    public void setPrefecture(String prefecture) { this.prefecture = prefecture; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getBusinessDescription() { return businessDescription; }
    public void setBusinessDescription(String businessDescription) { this.businessDescription = businessDescription; }

    public String getPurchaseItems() { return purchaseItems; }
    public void setPurchaseItems(String purchaseItems) { this.purchaseItems = purchaseItems; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Integer getBudget() { return budget; }
    public void setBudget(Integer budget) { this.budget = budget; }
}
