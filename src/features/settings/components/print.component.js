/* eslint-disable prettier/prettier */
// Create printing data using StarXpandCommandBuilder object.

var builder = new StarXpandCommand.StarXpandCommandBuilder();
builder.addDocument(
  new StarXpandCommand.DocumentBuilder().addPrinter(
    new StarXpandCommand.PrinterBuilder()
      .actionPrintImage(
        new StarXpandCommand.Printer.ImageParameter("logo_01.png", 406)
      )
      .styleInternationalCharacter(
        StarXpandCommand.Printer.InternationalCharacterType.Usa
      )
      .styleCharacterSpace(0)
      .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
      .actionPrintText(
        "Star Clothing Boutique\n" +
          "123 Star Road\n" +
          "City, State 12345\n" +
          "\n"
      )
      .styleAlignment(StarXpandCommand.Printer.Alignment.Left)
      .actionPrintText(
        "Date:MM/DD/YYYY    Time:HH:MM PM\n" +
          "--------------------------------\n" +
          "\n"
      )
      .actionPrintText(
        "SKU         Description    Total\n" +
          "300678566   PLAIN T-SHIRT  10.99\n" +
          "300692003   BLACK DENIM    29.99\n" +
          "300651148   BLUE DENIM     29.99\n" +
          "300642980   STRIPED DRESS  49.99\n" +
          "300638471   BLACK BOOTS    35.99\n" +
          "\n" +
          "Subtotal                  156.95\n" +
          "Tax                         0.00\n" +
          "--------------------------------\n"
      )
      .actionPrintText("Total     ")
      .add(
        new StarXpandCommand.PrinterBuilder()
          .styleMagnification(new StarXpandCommand.MagnificationParameter(2, 2))
          .actionPrintText("   $156.95\n")
      )
      .actionPrintText(
        "--------------------------------\n" +
          "\n" +
          "Charge\n" +
          "156.95\n" +
          "Visa XXXX-XXXX-XXXX-0123\n" +
          "\n"
      )
      .add(
        new StarXpandCommand.PrinterBuilder()
          .styleInvert(true)
          .actionPrintText("Refunds and Exchanges\n")
      )
      .actionPrintText("Within ")
      .add(
        new StarXpandCommand.PrinterBuilder()
          .styleUnderLine(true)
          .actionPrintText("30 days")
      )
      .actionPrintText(" with receipt\n")
      .actionPrintText("And tags attached\n" + "\n")
      .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
      .actionPrintBarcode(
        new StarXpandCommand.Printer.BarcodeParameter(
          "0123456",
          StarXpandCommand.Printer.BarcodeSymbology.Jan8
        )
          .setBarDots(3)
          .setBarRatioLevel(
            StarXpandCommand.Printer.BarcodeBarRatioLevel.Level0
          )
          .setHeight(5)
          .setPrintHri(true)
      )
      .actionFeedLine(1)
      .actionPrintQRCode(
        new StarXpandCommand.Printer.QRCodeParameter("Hello World.\n")
          .setModel(StarXpandCommand.Printer.QRCodeModel.Model2)
          .setLevel(StarXpandCommand.Printer.QRCodeLevel.L)
          .setCellSize(8)
      )
      .actionCut(StarXpandCommand.Printer.CutType.Partial)
  )
);

// Get printing data from StarXpandCommandBuilder object.
var commands = await builder.getCommands();
