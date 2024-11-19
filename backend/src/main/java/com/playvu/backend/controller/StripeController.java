package com.playvu.backend.controller;

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
// import com.stripe.model.checkout.Session;
// import com.stripe.param.checkout.SessionCreateParams;
// import com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData;

import com.playvu.backend.service.*;

import jakarta.servlet.http.HttpServletRequest;
import com.playvu.backend.entity.*;

@RestController
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)
// Allow all origins for simplicity, change for production.
@CrossOrigin(origins = "*")
public class StripeController {

    private String stripe_publishable_api_key = "pk_test_51QMaBkK6acT5v5wcVhkePxrwXrGRuwJT6HHT4hbsOEg1RuF8rlxHjZCLjkHuzcGnJDcKrWNay2vIKDGjkrLnpFH100SPJwopdj";

    @GetMapping("/check-stripe-backend-status")
    public String checkStripeBackendStatus()
    {
        return "OK";
    }

    // @RequestMapping("/checkout")
    // public String checkout(Model model) {
    //     model.addAttibute("amount", 100); // TODO: Hardcoded value
    //     model.addAttibute("stripePublicKey", stripe_publishable_api_key);
    //     model.addAttibute("currency", ChargeRequest.Currency.USD);
    // }

    
}
