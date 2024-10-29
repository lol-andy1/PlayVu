package com.playvu.backend.request;

public class FieldBody {
    private Integer field_id;
    private String name;
    private String description;
    private String address;
    private String zip_code;
    private String city;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getZip_code() {
        return zip_code;
    }
    public void setZip_code(String zip_code) {
        this.zip_code = zip_code;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public Integer getField_id() {
        return field_id;
    }
    public void setField_id(Integer field_id) {
        this.field_id = field_id;
    }
        
}
