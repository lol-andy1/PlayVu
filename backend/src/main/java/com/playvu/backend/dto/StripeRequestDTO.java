package com.playvu.backend.dto;

// You would have more infomation from request body here

public class StripeRequestDTO {

    String email;
    String name;
    Long price;
    String receiver;

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public Long getPrice() {
        return price;
    }

    public String getreceiver() {
        return receiver;
    }
}
