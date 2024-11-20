package com.playvu.backend.controller;

import com.playvu.backend.entity.*;
// import org.springframework.web.multipart.MultipartFile;

import com.playvu.backend.service.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Product;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)
// Allow all origins for simplicity, change for production.
@CrossOrigin(origins = "*")
public class StripeController {
    // @Value("${STRIPE_PUBLIC_KEY}")

    String STRIPE_API_KEY = "";

    @GetMapping("/get-stripe-server-status")
    public String getStripeServerStatus(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException, StripeException {
        return "OK";
    }

    @PostMapping("/checkout")
    public String checkout(HttpServletRequest request, @RequestBody RequestDTO requestDTO) throws URISyntaxException, IOException, InterruptedException, StripeException {
        return "Checkout!!!"
    }


}
