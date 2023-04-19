/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Text } from "../../../components/typography/text.component";
// import ButtonToggleGroup from "react-native-button-toggle-group";
import { colors } from "../../../infrastructure/theme/colors";
import { SafeArea } from "../../../components/utils/safe-area.component";

import { Spacer } from "../../../components/spacer/spacer.component";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Card, Divider, ToggleButton } from "react-native-paper";
import styled from "styled-components/native";
import { SalesChart } from "../components/sales-chart.component";
import { SalesContext } from "../../../services/sales/sales.context";

const TotalSalesContainer = styled.View`
  justif-content: center;
  align-items: center;
`;

const TotalSalesTouchable = styled(TouchableOpacity)`
  width: 50%;
  justif-content: center;
  align-items: center;
`;

const ChangingContainerText = styled.Text`
  font-size: 16;
  line-height: 35;
  color: #ffffff;
`;

const ComingSoonChangingContainerText = styled.Text`
  font-size: 16;
  line-height: 35;
  color: #bf1f2e;
`;

const BottomIndividualContainers = styled.View`
  width: 100%;
  justif-content: center;
  align-items: center;
`;

const RightOfSalesContainer = styled.View`
  width: 55%;
  padding-right: 8;
  padding-left: 14;
`;

const RightIndividualContainers = styled.View`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: left;
`;

const RightIndividualTouchableContainers = styled(TouchableOpacity)`
  height: 30%;
  justify-content: center;
  align-items: left;
`;

const HorizontalChangingDivider = styled(Divider)`
  width: 90%;
  background-color: #ffffff;
`;

const VerticalChangingDivider = styled(Divider)`
  height: 90%;
  width: 0.5;
  background-color: #ffffff;
`;

const TopSalesView = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const BottomSalesContainer = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const BottomChangingContainer = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  background-color: #bf1f2e;
`;

const BottomChangingGraphContainer = styled.View`
  width: 80%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const LeftChangingContainer = styled.View`
  width: 50%;
  height: 100%;
  justif-content: center;
  align-items: center;
  flex-direction: column;
`;

const LeftChangingContainerView = styled.View`
  height: 50%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const RightChangingContainerView = styled.View`
  height: 50%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const RightChangingContainer = styled.View`
  width: 50%;
  justif-content: center;
  align-items: center;
`;

const ChangingSalesCardContainer = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const TopSalesCard = styled(Card)`
  width: 95%;
  height: 32%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const TouchableCard = styled(TouchableOpacity)`
  width: 33%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const BottomSalesCard = styled(Card)`
  width: 95%;
  height: 13%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const ChangingSalesCard = styled(Card)`
  width: 95%;
  height: 33%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const theme = {
  roundness: 5,
  version: 3,
  // BackgroundColor: "black",
  colors: {
    primary: "white",
    onPrimary: "white",
    secondary: "#f1c40f",
    tertiary: "#a1b2c3",
  },
};

const { width, height } = Dimensions.get("window");

export const SalesScreen = () => {
  const [selectTime, setSelectTime] = useState("Today");
  const [statusBottom, setStatusBottom] = useState("Average Order");
  const { dailyData, weeklyData, monthlyData } = useContext(SalesContext);
  const [dataVariable, setDataVariable] = useState(dailyData);
  const [tempVar, setTempVar] = useState("Not enough data");
  const [dimensions, setDimensions] = useState({ width, height });

  // console.log(weeklyData);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ width, height }) => {
        setDimensions({ width, height });
        setStatusBottom("Average Order");
      }
    );
    return () => subscription?.remove();
  });

  useEffect(() => {
    if (selectTime === "Today") {
      setDataVariable(dailyData);
    }
    if (selectTime === "Week") {
      setDataVariable(weeklyData);
    }
    if (selectTime === "Month") {
      setDataVariable(monthlyData);
    }
  }, [selectTime, dailyData, weeklyData, monthlyData]);

  return (
    <SafeArea style={{ flex: 1 }}>
      {/* {isLoading && <PaymentProcessing />} */}
      <Spacer size="large" />
      <Spacer size="small" />
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ToggleButton.Row
          style={{
            marginRight: 15,
            marginLeft: 15,
            height: 35,
          }}
          onValueChange={(val) => setSelectTime(val)}
          value={selectTime}
        >
          <ToggleButton
            theme={theme}
            value="Today"
            icon={() => (
              <View>
                <Text
                  style={{
                    color: selectTime === "Today" ? "white" : "black",
                  }}
                >
                  Today
                </Text>
              </View>
            )}
            style={{
              width: "28%",
              backgroundColor:
                selectTime === "Today" ? colors.brand.primary : "white",
              color: selectTime === "Today" ? "black" : "white",
              borderColor: "white",
              // BackgroundColor: colors.brand.primary,
              // highlightTextColor: "white",
              // inactiveTextColor: colors.brand.primary,
            }}
          />
          <ToggleButton
            theme={theme}
            icon={() => (
              <View>
                <Text
                  style={{
                    color: selectTime === "Week" ? "white" : "black",
                  }}
                >
                  Week
                </Text>
              </View>
            )}
            style={{
              width: "28%",

              backgroundColor:
                selectTime === "Week" ? colors.brand.primary : "white",
              borderColor: "white",
              // backgroundColor: "black",
              // highlightBackgroundColor: colors.brand.primary,
              // highlightTextColor: "white",
              // inactiveTextColor: colors.brand.primary,
            }}
            value="Week"
          />
          <ToggleButton
            value="Month"
            theme={theme}
            style={{
              width: "28%",
              backgroundColor:
                selectTime === "Month" ? colors.brand.primary : "white",
              borderColor: "white",
              highlightBackgroundColor: colors.brand.primary,
              highlightTextColor: "white",
              inactiveTextColor: colors.brand.primary,
            }}
            icon={() => (
              <View>
                <Text
                  style={{
                    color: selectTime === "Month" ? "white" : "black",
                  }}
                >
                  Month
                </Text>
              </View>
            )}
          />
        </ToggleButton.Row>
      </View>
      {!dataVariable ||
        (Object.keys(dataVariable).length === 0 && (
          <>
            {/* <ButtonToggleGroup
              style={{
                marginRight: 15,
                marginLeft: 15,
                height: 35,
              }}
              highlightBackgroundColor={colors.brand.primary}
              highlightTextColor={"white"}
              inactiveBackgroundColor={"white"}
              inactiveTextColor={colors.brand.primary}
              values={["Today", "Week", "Month"]}
              value={selectTime}
              onSelect={(val) => setSelectTime(val)}
            /> */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Text>No Sales Data!</Text>
            </View>
          </>
        ))}

      {Object.keys(dataVariable).length !== 0 && (
        <>
          <Spacer size="large" />
          <Spacer size="small" />
          {/* <ButtonToggleGroup
            style={{
              marginRight: 15,
              marginLeft: 15,
              height: 35,
            }}
            highlightBackgroundColor={colors.brand.primary}
            highlightTextColor={"white"}
            inactiveBackgroundColor={"white"}
            inactiveTextColor={colors.brand.primary}
            values={["Today", "Week", "Month"]}
            value={selectTime}
            onSelect={(val) => setSelectTime(val)}
          /> */}
          <Spacer size="large" />
          <Spacer size="small" />
          <TopSalesCard elevation={5}>
            <TopSalesView>
              <TotalSalesTouchable
                onPress={() => {
                  setStatusBottom("Total Sales");
                }}
              >
                <TotalSalesContainer>
                  <Text
                    style={{
                      fontSize: 30,
                      color:
                        statusBottom === "Total Sales"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    Total Sales
                  </Text>
                  <Text
                    style={{
                      fontSize: 25,
                      color:
                        statusBottom === "Total Sales"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    {`${parseFloat(
                      dataVariable.totalSalesStats.totalSales
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}`}
                  </Text>
                </TotalSalesContainer>
              </TotalSalesTouchable>
              <Divider style={{ width: 0.5, height: "90%" }} />
              <RightOfSalesContainer>
                <RightIndividualTouchableContainers
                  onPress={() => {
                    setStatusBottom("Customers Served");
                  }}
                >
                  <RightIndividualContainers>
                    <Text
                      style={{
                        fontSize: 18,
                        color:
                          statusBottom === "Customers Served"
                            ? colors.brand.primary
                            : "black",
                      }}
                    >
                      Customers Served:{" "}
                      {dataVariable.customersServedStats.ordersCount}
                    </Text>
                  </RightIndividualContainers>
                </RightIndividualTouchableContainers>
                <Divider style={{ width: "95%" }} />
                <RightIndividualTouchableContainers
                  onPress={() => {
                    setStatusBottom("Average Order");
                  }}
                >
                  <RightIndividualContainers>
                    <Text
                      style={{
                        fontSize: 18,
                        color:
                          statusBottom === "Average Order"
                            ? colors.brand.primary
                            : "black",
                      }}
                    >
                      Average Order:{" "}
                      {`${parseFloat(
                        dataVariable.avgOrderStats.averageOrderPrice
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}`}
                    </Text>
                  </RightIndividualContainers>
                </RightIndividualTouchableContainers>
                <Divider style={{ width: "95%" }} />
                <RightIndividualTouchableContainers
                  onPress={() => {
                    setStatusBottom("Refund Stats");
                  }}
                >
                  <RightIndividualContainers>
                    <Text
                      style={{
                        fontSize: 18,
                        color:
                          statusBottom === "Expected Sales"
                            ? colors.brand.primary
                            : "black",
                      }}
                    >
                      Refund Total:{" "}
                      {dataVariable.refundStats.avgRefundPerOrder !== "NaN"
                        ? `${parseFloat(
                            dataVariable.refundStats.totalRefund
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`
                        : `${parseFloat(0).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}
                    </Text>
                  </RightIndividualContainers>
                </RightIndividualTouchableContainers>
              </RightOfSalesContainer>
            </TopSalesView>
          </TopSalesCard>
          <Spacer size="large" />
          <Spacer size="small" />
          <BottomSalesCard elevation={5}>
            <BottomSalesContainer>
              <TouchableCard
                onPress={() => {
                  setStatusBottom("Tips");
                }}
              >
                <BottomIndividualContainers>
                  <Text
                    style={{
                      fontSize: 18,
                      color:
                        statusBottom === "Tips"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    Tips
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color:
                        statusBottom === "Tips"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    {`${parseFloat(
                      dataVariable.tipStats.totalTips
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}`}
                  </Text>
                </BottomIndividualContainers>
              </TouchableCard>
              <Divider style={{ width: 0.5, height: "85%" }} />
              <TouchableCard
                onPress={() => {
                  setStatusBottom("Fees");
                }}
              >
                <BottomIndividualContainers>
                  <Text
                    style={{
                      fontSize: 18,
                      color:
                        statusBottom === "Fees"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    Fees
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color:
                        statusBottom === "Fees"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    {`${parseFloat(
                      dataVariable.feeStats.totalFees
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}`}
                  </Text>
                </BottomIndividualContainers>
              </TouchableCard>
              <Divider style={{ width: 0.5, height: "85%" }} />
              <TouchableCard
                onPress={() => {
                  setStatusBottom("Profit");
                }}
              >
                <BottomIndividualContainers>
                  <Text
                    style={{
                      fontSize: 18,
                      color:
                        statusBottom === "Profit"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    Profit
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color:
                        statusBottom === "Profit"
                          ? colors.brand.primary
                          : "black",
                    }}
                  >
                    {`${parseFloat(
                      dataVariable.profitStats.totalProfit
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}`}
                  </Text>
                </BottomIndividualContainers>
              </TouchableCard>
            </BottomSalesContainer>
          </BottomSalesCard>
          <Spacer size="large" />
          <Spacer size="small" />
          <ChangingSalesCard elevation={7}>
            <ChangingSalesCardContainer>
              {statusBottom === "Tips" && (
                <>
                  <BottomChangingContainer>
                    <LeftChangingContainer>
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Avg Tip Per Order
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.tipStats.avgTipPerOrder
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}{" "}
                          or{" "}
                          {`${parseFloat(
                            dataVariable.tipStats.avgTipPercentOrder
                          ).toLocaleString("en-GB", { style: "percent" })}`}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                      <HorizontalChangingDivider />
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Highest Day/Lowest Day
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.tipStats.highestDayTips
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}{" "}
                          /{" "}
                          {`${parseFloat(
                            dataVariable.tipStats.lowestDayTips
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                    </LeftChangingContainer>
                    <VerticalChangingDivider />
                    <RightChangingContainer>
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Percent Of Tippers
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.tipStats.percentTipers
                          ).toLocaleString("en-GB", { style: "percent" })}`}
                        </ChangingContainerText>
                      </RightChangingContainerView>
                      <HorizontalChangingDivider />
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Daily Avg Tips
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.tipStats.dailyAvgTips
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}
                        </ChangingContainerText>
                      </RightChangingContainerView>
                    </RightChangingContainer>
                  </BottomChangingContainer>
                </>
              )}
              {statusBottom === "Refund Stats" && (
                <>
                  <>
                    <BottomChangingContainer>
                      <LeftChangingContainer>
                        <LeftChangingContainerView>
                          <ChangingContainerText>
                            % Of Orders w/ Refunds
                          </ChangingContainerText>
                          <ChangingContainerText>
                            {`${parseFloat(
                              dataVariable.refundStats.percentRefunded
                            ).toLocaleString("en-GB", {
                              style: "percent",
                            })}`}
                          </ChangingContainerText>
                        </LeftChangingContainerView>
                        <HorizontalChangingDivider />
                        <LeftChangingContainerView>
                          <ChangingContainerText>
                            Avg Refund Per Order
                          </ChangingContainerText>
                          <ChangingContainerText>
                            {dataVariable.refundStats.avgRefundPerOrder !==
                            "NaN"
                              ? `${parseFloat(
                                  dataVariable.refundStats.avgRefundPerOrder
                                ).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}`
                              : `${parseFloat(0).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}`}
                          </ChangingContainerText>
                        </LeftChangingContainerView>
                      </LeftChangingContainer>
                      <VerticalChangingDivider />
                      <RightChangingContainer>
                        <RightChangingContainerView>
                          <ChangingContainerText>
                            Number Of Refunds
                          </ChangingContainerText>
                          <ChangingContainerText>
                            {dataVariable.refundStats.numberOfRefunds} refunds
                          </ChangingContainerText>
                        </RightChangingContainerView>
                        <HorizontalChangingDivider />
                        <RightChangingContainerView>
                          <ChangingContainerText>
                            Refunds Total
                          </ChangingContainerText>
                          <ChangingContainerText>
                            {dataVariable.refundStats.avgRefundPerOrder !==
                            "NaN"
                              ? `${parseFloat(
                                  dataVariable.refundStats.totalRefund
                                ).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}`
                              : `${parseFloat(0).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}`}
                          </ChangingContainerText>
                        </RightChangingContainerView>
                      </RightChangingContainer>
                    </BottomChangingContainer>
                  </>
                </>
              )}
              {statusBottom === "Total Sales" && (
                <>
                  <SalesChart data={dataVariable.totalSalesStats} />
                </>
              )}
              {statusBottom === "Average Order" && (
                <>
                  <BottomChangingContainer>
                    <LeftChangingContainer>
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Percent Pickup/Delivery
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.avgOrderStats.pickupPercentage
                          ).toLocaleString("en-GB", {
                            style: "percent",
                          })}`}{" "}
                          |{" "}
                          {`${parseFloat(
                            dataVariable.avgOrderStats.deliveryPercentage
                          ).toLocaleString("en-GB", { style: "percent" })}`}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                      <HorizontalChangingDivider />
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Avg Wait Time
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {dataVariable.avgOrderStats.waitTimeAvg !== "NaN" &&
                          dataVariable.avgOrderStats.waitTimeAvg !== null
                            ? dataVariable.avgOrderStats.waitTimeAvg + " mins"
                            : "No Data"}{" "}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                    </LeftChangingContainer>
                    <VerticalChangingDivider />
                    <RightChangingContainer>
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Avg Items Per Order
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {dataVariable.avgOrderStats.itemPerOrderAvg} items
                        </ChangingContainerText>
                      </RightChangingContainerView>
                      <HorizontalChangingDivider />
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Avg Price Per Item
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.avgOrderStats.pricePerItemAvg
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}
                        </ChangingContainerText>
                      </RightChangingContainerView>
                    </RightChangingContainer>
                  </BottomChangingContainer>
                </>
              )}
              {statusBottom === "Customers Served" && (
                <>
                  <BottomChangingContainer>
                    <LeftChangingContainer>
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Email List Growth
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {dataVariable.customersServedStats.emailGrowth !==
                          null
                            ? dataVariable.customersServedStats.emailGrowth
                            : "Not enough data."}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                      <HorizontalChangingDivider />
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Avg Orders Per Day
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {dataVariable.customersServedStats.avgOrdersPerDay}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                    </LeftChangingContainer>
                    <VerticalChangingDivider />
                    <RightChangingContainer>
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Current # Of Orders
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {dataVariable.customersServedStats.ordersCount}
                        </ChangingContainerText>
                      </RightChangingContainerView>
                      <HorizontalChangingDivider />
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Expected Orders
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {dataVariable.customersServedStats.expectedOrders}
                        </ChangingContainerText>
                      </RightChangingContainerView>
                    </RightChangingContainer>
                  </BottomChangingContainer>
                </>
              )}
              {statusBottom === "Fees" && (
                <>
                  <BottomChangingContainer>
                    <LeftChangingContainer>
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Avg AM Cost Per Order
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.feeStats.avgAMCost
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}{" "}
                          or{" "}
                          {`${parseFloat(
                            dataVariable.feeStats.setAMFeePercent
                          ).toLocaleString("en-GB", { style: "percent" })}`}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                      <HorizontalChangingDivider />
                      <LeftChangingContainerView>
                        <ChangingContainerText>
                          Total AM Fee
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.feeStats.totalAMCost
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}
                        </ChangingContainerText>
                      </LeftChangingContainerView>
                    </LeftChangingContainer>
                    <VerticalChangingDivider />
                    <RightChangingContainer>
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Processing Fee
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.feeStats.processingFee
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}{" "}
                        </ChangingContainerText>
                      </RightChangingContainerView>
                      <HorizontalChangingDivider />
                      <RightChangingContainerView>
                        <ChangingContainerText>
                          Total Tax Payment
                        </ChangingContainerText>
                        <ChangingContainerText>
                          {`${parseFloat(
                            dataVariable.feeStats.totalTaxPmts
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}{" "}
                          or{" "}
                          {`${parseFloat(
                            dataVariable.feeStats.taxRate
                          ).toLocaleString("en-GB", { style: "percent" })}`}
                        </ChangingContainerText>
                      </RightChangingContainerView>
                    </RightChangingContainer>
                  </BottomChangingContainer>
                </>
              )}
              {statusBottom === "Profit" && (
                <>
                  <BottomChangingGraphContainer>
                    <SalesChart data={dataVariable.profitStats} />
                  </BottomChangingGraphContainer>
                </>
              )}
            </ChangingSalesCardContainer>
          </ChangingSalesCard>
        </>
      )}
    </SafeArea>
  );
};
