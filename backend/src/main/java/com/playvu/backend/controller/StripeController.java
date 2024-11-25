package com.playvu.backend.controller;

import com.playvu.backend.dto.StripeRequestDTO;
// import org.springframework.web.multipart.MultipartFile;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSearchResult;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerSearchParams;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URISyntaxException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.model.Account;
import com.stripe.param.AccountListParams;
import com.stripe.model.AccountCollection;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)
// Allow all origins for simplicity, change for production.
@CrossOrigin(origins = "*")
public class StripeController {

    // @Value("${STRIPE_PUBLIC_KEY}")

    String STRIPE_API_KEY =
        "sk_test_51QMaBkK6acT5v5wc7eHjby7Lj23CamBlmPz6OgyklTKNHNDTpZNaSTTdsscWQctIBjWGVrD4BE7IphnAqIDEuZO300GYav2LKK"; // TODO: Provide as env variable, this value starts with sk_ (secret key)

    String STRIPE_PUBLISHABLE_KEY =
        "pk_test_51QMaBkK6acT5v5wcVhkePxrwXrGRuwJT6HHT4hbsOEg1RuF8rlxHjZCLjkHuzcGnJDcKrWNay2vIKDGjkrLnpFH100SPJwopdj";

    // TODO: Get environment variable

    // String Client_BASE_URL = "http://localhost:3000"; // TODO: This may cause issues, convert to environment variable, and link to production build
    //

    public static Customer findOrCreateCustomer(String email, String name)
        throws StripeException {
        CustomerSearchParams searchParams = CustomerSearchParams.builder()
            .setQuery("email:'" + email + "'")
            .build();

        CustomerSearchResult result = Customer.search(searchParams);

        Customer c;

        // If no existing customer was found, create a new record
        if (result.getData().size() == 0) {
            CustomerCreateParams createParams = CustomerCreateParams.builder()
                .setName(name)
                .setEmail(email)
                .build();

            // createParams = createParams.setName(name);
            // createParams = createParams.setEmail(email);
            // createParams  = createParams.build();

            c = Customer.create(createParams);
        } else {
            c = result.getData().get(0);
        }

        return c;
    }

    @GetMapping("/get-stripe-server-status")
    public String getStripeServerStatus(HttpServletRequest request)
        throws URISyntaxException, IOException, InterruptedException, StripeException {
        return "OK";
    }

    // TODO: Get Email and Name from request
    // NOTE: THis is an integrated checkout (checkout box)
    @PostMapping("/checkout")
    public String checkout(
        HttpServletRequest request,
        @RequestBody StripeRequestDTO requestDTO
    )
        throws URISyntaxException, IOException, InterruptedException, StripeException {
        Stripe.apiKey = STRIPE_API_KEY;

        Customer customer = findOrCreateCustomer(
            requestDTO.getEmail(),
            requestDTO.getName()
        );
        // System.out.println(customer.getEmail());
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(requestDTO.getPrice()) // This amount is in cents
            .setCurrency("usd")
            .setCustomer(customer.getId())
            .build();

        PaymentIntent intent = PaymentIntent.create(params);

        return intent.getClientSecret();
    }

    @GetMapping("/get-stripe-publishable-key")
    // This key is needed to get the checkout box to work, but is not secret, so can be hardcoded too
    public String getStripePublishableKey() {
        return STRIPE_PUBLISHABLE_KEY;
    }

    @PostMapping("/find-account-number")
    public String findOrCreateAccountNumber(HttpServletRequest request, String name) throws StripeException {

        Stripe.apiKey = STRIPE_API_KEY;

        AccountListParams listParams = AccountListParams.builder().build();

        AccountCollection accounts =  Account.list(listParams);

        for (Account account : accounts.getData()) {
            if (name.equals(account.getBusinessProfile().getName()))
            {
                return account.getId();
            }
        }

        // No account so create acct


        return ""; // No account found                    
    }
}
