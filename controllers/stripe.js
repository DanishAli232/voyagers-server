import Itinerary from "../models/Itinerary.js";
import User from "../models/User.js";
import stripe from "../utils/stripe.js";

class StripeController {
  async connect(req, res) {
    try {
      const userAccount = await User.findById(req.user.id).select("+accountId");

      let account_id = userAccount?.account_id;

      if (!account_id) {
        const accountObj = await stripe.accounts.create({
          type: "express",
          capabilities: {
            transfers: {
              requested: true,
            },
          },
        });

        const { id } = accountObj;

        userAccount.account_id = id;
        account_id = id;
        await User.updateOne({ _id: req.user.id }, { $set: { accountId: id, role: "seller" } });
      }

      const accountLink = await stripe.accountLinks.create({
        account: account_id,
        refresh_url: `${process.env.BASE_URL}/dashboard/itinerary?userId=${req.user.id}`,
        return_url: `${process.env.BASE_URL}/billing/return?userId=${req.user.id}`,
        type: "account_onboarding",
      });

      const { url } = accountLink;
      return res.send(url);
    } catch (e) {
      console.log("e", e);
      return res.status(500).json(e);
    }
  }

  async returnAcc(req, res) {
    try {
      let userAccount = await User.findById(req.query.userId).select("+accountId");
      let stripeAccount = await stripe.accounts.retrieve(userAccount.accountId);

      if (stripeAccount.details_submitted) {
        User.updateOne({ _id: userAccount._id }, { $set: { isCompleted: true } });
      }

      return res.redirect(process.env.HOST_URL + "/itinerary/me");
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async getUser(req, res) {
    let userAccount = await User.findById(req.user.id).select("+accountId +isCompleted +role");

    if (!userAccount.accountId) {
      return res.send({ isCompleted: false });
    } else {
      return res.send({ isCompleted: true });
    }
  }

  async getStripeAccount(req, res) {
    try {
      const user = await User.findById(req.user.id).select("+accountId");
      const account = await stripe.accountLinks.create({
        account: user.accountId,
        type: "account_onboarding",
        refresh_url: process.env.HOST_URL,

        return_url: process.env.HOST_URL,
      });

      return res.send(account.url);
    } catch (err) {
      console.log(err);
    }
  }

  async checkout(req, res) {
    let itinerary = await Itinerary.findById(req.body.itineraryId).populate({ path: "userId", select: "+accountId" });
    const user = await User.findById(req.user.id).select("+email");
    if (!user) {
      return res.send({ errors: "errors" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      metadata: { itinerary: itinerary._id.toString() },
      line_items: [
        {
          price_data: {
            currency: "USD",
            unit_amount: Number(itinerary.price) * 100,
            product_data: {
              name: "Itinerary",
              description: "This itinerary needs more info",
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Number(itinerary.price) * 100 * 0.2,
        transfer_data: {
          destination: itinerary.userId.accountId,
        },
      },
      success_url: process.env.HOST_URL + "/itinerary/view/" + itinerary._id + "?status=success",
      cancel_url: process.env.HOST_URL + "/itinerary/view/" + itinerary._id + "?status=cancel",
    });

    return res.send(session.url);
  }
}

export default new StripeController();
