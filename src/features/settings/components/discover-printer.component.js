/* eslint-disable prettier/prettier */
manager: StarDeviceDiscoveryManager;
import React from "react";
import {
  StarDeviceDiscoveryManager,
  StarDeviceDiscoveryManagerFactory,
  InterfaceType,
  StarPrinter,
} from "react-native-star-io10";

export const Discovery = async () => {
  let manager = StarDeviceDiscoveryManager;

  try {
    // Specify your printer interface types.
    manager = await StarDeviceDiscoveryManagerFactory.create([
      InterfaceType.Lan,
      InterfaceType.Bluetooth,
      InterfaceType.BluetoothLE,
      InterfaceType.Usb,
    ]);

    // Set discovery time. (option)
    manager.discoveryTime = 10000;

    // Callback for printer found.
    manager.onPrinterFound = (printer = { StarPrinter }) => {
      console.log(printer);
    };

    // Callback for discovery finished. (option)
    manager.onDiscoveryFinished = () => {
      console.log("Discovery finished");
    };

    // Start discovery.
    await manager.startDiscovery();

    // Stop discovery.
    // await manager.stopDiscovery()
  } catch (error) {
    // Error.
    console.log(error);
  }
};
