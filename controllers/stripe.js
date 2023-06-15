import User from "../models/User.js";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51IJgivGnP7Wkn66NGXG1i8U8PtgNUqVlyAwx3TdQBkDkKBjkgiD1YkzZWLQIsSq77RLCXy5L4qBdV2P7lqq8MX2t00S2YWabq5"
);

class StripeController {
  async connect(req, res) {
    try {
      const userAccount = await User.findById(req.user.id).select("+accountId");

      let account_id = userAccount?.account_id;

      if (!account_id) {
        const accountObj = await stripe.accounts.create({
          type: "express",
        });

        const { id } = accountObj;

        userAccount.account_id = id;
        account_id = id;
        await User.updateOne({ _id: req.user.id }, { $set: { accountId: id } });
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

      return res.redirect("https://localhost:3000");
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }
}

export default new StripeController();
