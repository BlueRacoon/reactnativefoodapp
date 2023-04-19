/* eslint-disable prettier/prettier */
module.exports.refundRequest = (request, response, stripeClient) => {
  const body = JSON.parse(request.body);
  const { paymentIntent, amount } = body;
  stripeClient.refunds
    .create({
      payment_intent: paymentIntent,
      amount: amount,
    })
    .then((refund) => {
      response.status(200).send({
        id: refund.id,
        refund: refund,
      });
      return response.json(refund);
    })
    .catch((e) => {
      // console.log(e);
      response.status(400);
      response.send(e);
    });
};
