import User from "../models/User.js";
import stripe from "../utils/stripe.js";

export const handleWebhooks = async (request, response) => {
  try {
    let event = request.body;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    // const endpointSecret =
    //   "whsec_53ff7ba4ca953a9868389cdca5509f9232a8bedcf66f36d6562ed36be9503abd";
    // const endpointSecret = "whsec_y8UwZiVUwOTbz0QZF8BY6rerkLHfMykf";
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
        console.log(event.type);
      } catch (err) {
        console.log(err);
        console.log(`⚠️  Webhook signature verification failed.`, err.message, request.body, signature, endpointSecret);
        return response.sendStatus(400);
      }
    }
    // console.log(event.data.object, event.type);

    // Handle the event
    switch (event.type) {
      //   case "customer.subscription.trial_will_end":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}.`);
      //     // Then define and call a method to handle the subscription trial ending.
      //     // handleSubscriptionTrialEnding(subscription);
      //     break;
      //   case "customer.subscription.deleted":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}. deleting`);
      //     // Then define and call a method to handle the subscription deleted.
      //     handleSubscriptionDeleted(subscription);
      //     break;
      //   case "customer.subscription.created":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}.`);

      //     // Then define and call a method to handle the subscription created.
      //     handleSubscriptionCreated(subscription, status);
      //     break;

      //   case "customer.subscription.updated":
      //     subscription = event.data.object;
      //     status = subscription.status;

      //     console.log(`Subscription status is ${status}.`);
      //     // Then define and call a method to handle the subscription update.
      //     // handleSubscriptionUpdated(subscription);
      //     break;

      //   case "invoice.paid":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}. Invoice`);

      //     await handleSubscriptionCreated(subscription, status);
      //     break;

      case "checkout.session.completed":
        let customer = event.data.object.customer_details;
        let userId = event.data.object.metadata.itinerary;

        if (event.data.object.status === "complete") {
          const user = await User.findOne({ email: customer.email });
          user.boughtItineraries?.push(userId);
          user.save();
        }

        // addDoc(collection(firestore, "users"), { email: customer.email });
        break;

      // case "payment_intent.succeeded":
      //   console.log(event.data.object);
      //   break;

      // case "checkout.session.completed":
      //   console.log(event.data.object);
      //   break;

      // case "payment_intent.succeeded":
      //   subscription = event.data.object;
      //   status = subscription.status;
      //   console.log(`Life time payment is ${status}.`);

      //   await (subscription, status);
      //   break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  } catch (error) {
    console.log(error);
  }
};
