/* eslint-disable prettier/prettier */
module.exports.secretRequest = async (request, response, stripeClient) => {
  const body = JSON.parse(request.body);
  const { token, amount } = body;

  const paymentIntent = await stripeClient.paymentIntents
    .create({
      amount,
      currency: "USD",
      payment_method_types: ["card"],
      payment_method_data: {
        type: "card",
        card: {
          token,
        },
      },
      confirm: true,
    })
    .then((result) => {
      // console.log(paymentIntent);
      result.json({ client_secret: paymentIntent.client_secret });
    })
    .catch((e) => {
      // console.log(e);
      response.status(400);
      response.send(e);
    });
};
