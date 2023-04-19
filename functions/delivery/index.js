/* eslint-disable prettier/prettier */
module.exports.createTestDelivery = (request, response, DoorDashClient) => {
  const body = JSON.parse(request.body);
  const { data } = body;

  const client = new DoorDashClient.DoorDashClient({
    ///////////REMOVED
  });

  client
    .createDelivery(data)
    .then((res) => {
      response.status(200).send({
        data: res,
      });
      return response.json(res);
    })
    .catch((err) => {
      console.log(err);
      return response.json(err);
    });
};

module.exports.getDeliveryQuote = (request, response, DoorDashClient) => {
  const body = JSON.parse(request.body);
  const { id, userAddress, restAddress } = body;

  const client = new DoorDashClient.DoorDashClient({
    ///////////REMOVED
  });

  //   let randID = `ID-${Math.random() * 999999}`;

  client
    .deliveryQuote({
      //   external_delivery_id: "D-12345",
      external_delivery_id: id,
      //   pickup_address: "1000 4th Ave, Seattle, WA, 98104",
      pickup_address: restAddress,
      pickup_phone_number: "+1(650)5555555",
      //   dropoff_address: "1201 3rd Ave, Seattle, WA, 98101",
      dropoff_address: userAddress,
      dropoff_phone_number: "+1(650)5555555",
    })
    .then((res) => {
      //   console.log("Delivery Data: ", res.data);
      //   return response.json(res.data);
      response.status(200).send({
        data: res,
      });
      return response.json(res);
    })
    .catch((err) => {
      console.log(err);
      return response.json(err);
    });
};

module.exports.getDeliveryStatus = (request, response, DoorDashClient) => {
  const body = JSON.parse(request.body);
  const { deliveryID } = body;

  const client = new DoorDashClient.DoorDashClient({
    ///////////REMOVED
  });

  client
    .getDelivery(deliveryID)
    .then((res) => {
      console.log("Delivery status: ", res.data);
      //   return response.json(res.data);
      response.status(200).send({
        data: res,
      });
      return response.json(res);
    })
    .catch((err) => {
      console.log(err);
      return response.json(err);
    });
};
