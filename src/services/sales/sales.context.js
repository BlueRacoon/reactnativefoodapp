/* eslint-disable prettier/prettier */
import {
  collection,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useRef,
} from "react";
import { db } from "../../../App";
import { AuthenticationContext } from "../authentication/authentication.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RestaurantBackendContext } from "../restaurant-backend/restaurant-backend.context";
import { OrdersContext } from "../orders/orders.context";

export const SalesContext = createContext();

export const SalesContextProvider = ({ children }) => {
  const { user, accountType } = useContext(AuthenticationContext);
  const { RestName } = useContext(RestaurantBackendContext);
  const { liveOrder } = useContext(OrdersContext);
  const [dailyData, setDailyData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [initial, setIntial] = useState(liveOrder);

  const [account, setAccount] = useState(null);

  const previousInputValue = useRef(initial);

  //   console.log("LO LENGTH", liveOrder[0].value.status);

  // limiting the sales context to update if there is a new order while open by the restaurant. The only metric this should delay is the
  // avg wait time metric. Which means it will always be one order behind if the current orders have not been completed yet. But honestly, not that important.
  // also not worth allowing the sales context to continually update and lag up the app.
  // basically, will only trigger sales context update on a new order coming in.

  useEffect(() => {
    if (
      previousInputValue.current !== liveOrder &&
      liveOrder &&
      liveOrder.length > 0
    ) {
      if (liveOrder.length !== previousInputValue.current.length)
        previousInputValue.current = liveOrder;
    } else {
      return;
    }
  }, [liveOrder]);

  // write a useEffect that triggeres all functions in order with promises to make sure everything happens in order
  // 1) get day, week, and month dates
  // 2) get day data into array, week data into an array, and month data into an array. each has own array in useState
  // 3) manipulate the data from each array by pushing each array into the same function.
  // 4) push this out to the sales screen to be called upon on the click of a button

  const loadAccountType = async (uid) => {
    try {
      const value = await AsyncStorage.getItem(`@accountType-${uid}`);

      if (value !== null) {
        setAccount(JSON.parse(value));
        return;
      }
    } catch (e) {
      // console.log("error loading favorites from local", e);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      loadAccountType(user.uid);
    }
  }, [user]);

  const getMonday = (date) => {
    return new Promise((resolve, reject) => {
      var temp = new Date();
      temp.setMinutes(temp.getMinutes() - temp.getTimezoneOffset());
      temp.setDate(temp.getDate() - (temp.getDay() || 7) + 1);
      //   console.log(temp.toISOString().slice(0, 10));
      resolve(temp.toISOString().slice(0, 10));
    });
  };

  const getTodaysDate = () => {
    return new Promise((resolve, reject) => {
      var todaysDate = new Date();
      todaysDate.setMinutes(
        todaysDate.getMinutes() - todaysDate.getTimezoneOffset()
      );
      let temp = todaysDate.toISOString().slice(0, 10);

      resolve(temp);
    });
  };

  const getNumberOfMonthDays = () => {
    return new Promise((resolve, reject) => {
      var todaysDate = new Date();
      todaysDate.setMinutes(
        todaysDate.getMinutes() - todaysDate.getTimezoneOffset()
      );
      let temp = todaysDate.toISOString().slice(0, 10);
      var tempYear = temp.slice(0, 4);
      var tempMonth = temp.slice(5, 7);
      let tempFirstDay = new Date(tempYear, tempMonth - 1, 1);
      let differenceDays =
        temp.slice(8, 10) - tempFirstDay.toISOString().slice(8, 10) + 1;
      //   console.log(temp);
      //   console.log(tempFirstDay.toISOString());
      //   console.log("difference", differenceDays);
      resolve(differenceDays);
    });
  };

  const getFirstDay = (date) => {
    var tempYear = date.slice(0, 4);
    var tempMonth = date.slice(5, 7);
    //for some reason we need month - 1 here. Not entirely sure why
    let tempFirstDay = new Date(tempYear, tempMonth - 1, 1);

    return tempFirstDay.toISOString().slice(0, 10);
  };

  const getLastDay = (date) => {
    var tempYear = date.slice(0, 4);
    var tempMonth = date.slice(5, 7);
    //for some reason we need month - 1 here. Not entirely sure why
    let tempFirstDay = new Date(tempYear, tempMonth, 0);

    return tempFirstDay.toISOString().slice(0, 10);
  };

  const GetWeekDatesArray = (tempToday, tempMon) => {
    var now = new Date(tempToday);
    var tempArray = [];
    for (
      var useD = new Date(tempMon);
      useD <= now;
      useD.setDate(useD.getDate() + 1)
    ) {
      tempArray.push(new Date(useD).toISOString().slice(0, 10));
      if (useD.toISOString().slice(0, 10) === now.toISOString().slice(0, 10)) {
        return tempArray;
      }
    }
  };

  const GetMonthDatesArray = (tempToday, tempFirst, tempLast) => {
    var now = new Date(tempLast);
    var tempArray = [];
    var fullArray = [];
    for (
      var useD = new Date(tempFirst);
      useD <= now;
      useD.setDate(useD.getDate() + 1)
    ) {
      tempArray.push(new Date(useD).toISOString().slice(0, 10));
      if (
        useD.toISOString().slice(0, 10) === now.toISOString().slice(0, 10) ||
        tempArray.length >= 10
      ) {
        fullArray.push(tempArray);
        tempArray = [];
        if (
          useD.toISOString().slice(0, 10) === now.toISOString().slice(0, 10)
        ) {
          return fullArray;
        }
      }
    }
  };

  const getDatesFunction = async () => {
    return new Promise(async (resolve, reject) => {
      let tempToday = await getTodaysDate();
      let tempMon = await getMonday(tempToday);
      let tempFirstDay = await getFirstDay(tempToday);
      let tempLastDay = await getLastDay(tempToday);
      let tempTodayArray = [tempToday];
      let tempWeekDatesArray = await GetWeekDatesArray(tempToday, tempMon);
      let tempMonthDatesArray = await GetMonthDatesArray(
        tempToday,
        tempFirstDay,
        tempLastDay
      );
      // console.log("tempTodayArray", tempTodayArray);
      // console.log("tempWeekDatesArray", tempWeekDatesArray);
      // console.log("tempMonthDatesArray", tempMonthDatesArray);
      resolve([tempTodayArray, tempWeekDatesArray, tempMonthDatesArray]);
    });
  };

  const getOrdersFunction = async (daily, weekly, monthly) => {
    return new Promise(async (resolve, reject) => {
      // console.log("Daily", daily);
      // console.log("weekly", weekly);
      // console.log("monthly", monthly);

      var tempDailyOrdersArray = await getOrdersFromArray(daily, "day");

      var tempWeeklyOrdersArray = await getOrdersFromArray(weekly, "week");

      var tempMonthlyOrdersArray = await getOrdersFromArray(monthly, "month");

      // have to get monthly days seperatly due to the firebase issue and having to split this array.
      let monthlyDays = await getNumberOfMonthDays();
      resolve([
        tempDailyOrdersArray,
        tempWeeklyOrdersArray,
        tempMonthlyOrdersArray,
        [daily.length, weekly.length, monthlyDays],
      ]);
    });
  };

  const getOrdersFromArray = async (arr, dataType) => {
    // console.log(arr);
    // console.log(dataType);
    return new Promise(async (resolve, reject) => {
      const OrderIds = arr;
      let tempArr = [];
      let loopCounter = 0;

      (await dataType) !== "month"
        ? await getDocs(
            query(collection(db, "orders"), where(documentId(), "in", OrderIds))
            // FB has document of document.docs you can use to cut down on the object keys mapping. Look into refactoring this
          ).then(async (snap) => {
            if (snap.docs.length > 0) {
              //check for FB docs to reduce this
              await snap.docs.map((doc) => {
                const item = doc.data();
                let end = Object.keys(item)[Object.keys(item).length - 1];
                if (end === undefined) {
                  resolve(tempArr);
                }
                if (dataType === "day") {
                  Object.keys(item).map((order) => {
                    if (
                      item[order].restaurant === RestName ||
                      account === "admin"
                    ) {
                      tempArr.push(item[order]);
                      if (order === end) {
                        resolve(tempArr);
                      }
                    } else if (order === end) {
                      resolve(tempArr);
                    }
                  });
                }
                if (dataType === "week") {
                  Object.keys(item).map((order) => {
                    if (
                      item[order].restaurant === RestName ||
                      account === "admin"
                    ) {
                      tempArr.push(item[order]);
                      if (order === end) {
                        resolve(tempArr);
                      }
                    } else if (order === end) {
                      resolve(tempArr);
                    }
                  });
                }
              });
            } else {
              resolve(tempArr);
            }
          })
        : await arr.map(async (set, i, lens) => {
            let endLoop = arr.length;
            let endSet = set.length;
            let setCounter = 0;

            await getDocs(
              query(collection(db, "orders"), where(documentId(), "in", set))
            ).then(async (snap) => {
              // console.log("i", i);
              // console.log("SDL: ", snap.docs.length);
              let end;
              snap.docs.length > 0 ? (end = snap.docs.length) : null;
              let count = 0;

              await snap.docs.map((doc) => {
                count++;
                setCounter++;
                // console.log("setCounter: ", setCounter);
                if (snap.docs.length > 0) {
                  // console.log(snap.docs.length);
                  // if (snap.docs.length !== 0) {
                  const item = doc.data();
                  // console.log("ItemLength: :", Object.keys(item).length);

                  if (i === arr.length - 1 && snap.docs.length === count) {
                    // console.log("ended 1");
                    resolve(tempArr);
                  } else {
                    Object.keys(item).map((order, j) => {
                      // console.log("order i: ", j);
                      // console.log(
                      //   "object length: ",
                      //   Object.keys(item).length - 1
                      // );
                      // console.log("ON: ", item[order].orderDate);
                      if (
                        item[order].restaurant === RestName ||
                        account === "admin"
                      ) {
                        tempArr.push(item[order]);
                        // console.log(tempArr.length);
                        // console.log(
                        //   count,
                        //   snap.docs.length,
                        //   arr.length - 1,
                        //   i,
                        //   j,
                        //   Object.keys(item).length - 1
                        // );
                        if (
                          i === arr.length - 1 &&
                          snap.docs.length === count &&
                          j === Object.keys(item).length - 1
                        ) {
                          // console.log("ended 2");
                          resolve(tempArr);
                        }
                      }
                    });
                  }
                } else {
                  if (i === arr.length - 1 && snap.docs.length === count) {
                    // console.log("ended");
                    // console.log(tempArr.length);
                    // console.log("ended 3");
                    // console.log(tempArr.length);
                    resolve(tempArr);
                  }
                }
              });
              if (snap.docs.length === i) {
                // console.log("ended");
                resolve(tempArr);
              }
            });
          });
    });
  };

  const getAvgOrderStats = async (ordersData, tempObj) => {
    let pickupTotal = 0;
    let deliveryTotal = 0;
    let methodTotal = 0;

    let tempItemCount = 0;
    let tempOrderCount = 0;
    let tempItemPerOrderAvg = 0;

    let tempPriceTotal = 0;
    let tempPricePerItemAvg = 0;

    let tempDiffernceTime = 0;
    let tempDiffernceTimeCount = 0;

    let tempAvgPriceTotal = 0;

    await ordersData.map(async (order) => {
      order.pickupChoice === "Pickup"
        ? (pickupTotal++, methodTotal++)
        : (deliveryTotal++, methodTotal++);

      tempItemCount = tempItemCount + order.cart.length;
      tempOrderCount++;

      tempPriceTotal =
        tempPriceTotal +
        (order.total / 100 - order.tip - order.tax - order.AMFee);

      tempAvgPriceTotal = tempAvgPriceTotal + order.total / 100;

      order.createdAt && order.completedFullTime
        ? (tempDiffernceTime =
            tempDiffernceTime +
            ((order.createdAt.toDate() - order.completedFullTime.toDate()) /
              1000 /
              60) *
              -1)
        : (tempDiffernceTime = tempDiffernceTime);

      order.createdAt && order.completedFullTime
        ? tempDiffernceTimeCount++
        : (tempDiffernceTimeCount = tempDiffernceTimeCount);
    });

    let pickupPercentage = (pickupTotal / methodTotal).toFixed(2);
    let deliveryPercentage = (deliveryTotal / methodTotal).toFixed(2);
    tempItemPerOrderAvg = (tempItemCount / tempOrderCount).toFixed(2);
    tempPricePerItemAvg = (tempPriceTotal / tempItemCount).toFixed(2);
    let tempDifferenceTimeAvg = (
      tempDiffernceTime / tempDiffernceTimeCount
    ).toFixed(2);
    // console.log(tempDifferenceTimeAvg);
    // console.log(tempDiffernceTime);
    // console.log(tempDiffernceTimeCount);
    // console.log("data", ordersData.length);
    let tempAvgTotal = tempAvgPriceTotal / tempOrderCount;
    let tempAvgT = parseFloat(tempAvgTotal).toFixed(2);

    const obj = {
      avgOrderStats: {
        pickupPercentage: pickupPercentage,
        deliveryPercentage: deliveryPercentage,
        itemPerOrderAvg: tempItemPerOrderAvg,
        pricePerItemAvg: tempPricePerItemAvg,
        waitTimeAvg: tempDifferenceTimeAvg,
        averageOrderPrice: tempAvgT,
      },
    };

    tempObj = Object.assign(tempObj, obj);

    return tempObj;
  };

  const getFeesData = async (ordersData, tempObj) => {
    let tempOrderCount = 0;
    let tempAMTotalFees = 0;

    let tempTotalTaxPmts = 0;

    let processingFee = 0;
    let refundPerOrder = 0;
    let refundTotal = 0;

    let initalRaw = 0;
    let newRaw = 0;
    let newAMFee = 0;
    let newTax = 0;

    let getTaxRate = (
      ordersData[0].tax /
      (ordersData[0].total / 100 - ordersData[0].AMFee - ordersData[0].tip)
    ).toFixed(2);

    await ordersData.map((order) => {
      refundPerOrder = 0;
      // console.log("order number", order.number);
      order.hasOwnProperty("refundData")
        ? order.refundData.length !== 0
          ? order.refundData.map((refundData) => {
              refundPerOrder = refundPerOrder + refundData.refundAmount / 100;
              refundTotal = refundTotal + refundData.refundAmount / 100;
            })
          : null
        : null;

      refundPerOrder !== 0
        ? ((initalRaw = order.total / 100 - order.tip - order.tax),
          (newRaw =
            (order.total / 100 - refundPerOrder) /
            (1 +
              order.tip / initalRaw +
              order.tax / initalRaw +
              order.AMFee / initalRaw)),
          (newAMFee = newRaw * (order.AMFee / initalRaw)),
          (newTax = newRaw * (order.tax / initalRaw)),
          (order.AMFee = Math.abs(newAMFee)),
          (order.tax = Math.abs(newTax)))
        : null;

      tempOrderCount++;
      tempAMTotalFees = tempAMTotalFees + order.AMFee;
      tempTotalTaxPmts = tempTotalTaxPmts + order.tax;
      processingFee = processingFee + ((order.stripeTotal / 100) * 0.029 + 0.3);
    });

    let tempAvgAMCost = (tempAMTotalFees / tempOrderCount).toFixed(2);
    let useTotalTaxPmts = tempTotalTaxPmts.toFixed(2);
    let useTotalAMFees = tempAMTotalFees.toFixed(2);
    let tempTotalFees =
      parseFloat(useTotalTaxPmts) +
      parseFloat(useTotalAMFees) +
      parseFloat(processingFee);
    let useTempTotalFees = parseFloat(tempTotalFees).toFixed(2);

    const obj = {
      feeStats: {
        setAMFeePercent: 0.02,
        avgAMCost: tempAvgAMCost,
        totalAMCost: useTotalAMFees,
        taxRate: getTaxRate,
        totalTaxPmts: useTotalTaxPmts,
        totalFees: useTempTotalFees,
        processingFee: processingFee,
      },
    };

    tempObj = Object.assign(tempObj, obj);

    return tempObj;
  };

  const getCustomersServedData = async (ordersData, tempObj, days) => {
    let tempOrderCount = 0;

    await ordersData.map((order) => {
      tempOrderCount++;
    });

    let tempAvgOrdersPerDay = (tempOrderCount / days).toFixed(2);
    let tempExpectedOrders = 3 * days;
    let tempEmailGrowth = 3;

    const obj = {
      customersServedStats: {
        emailGrowth: tempEmailGrowth,
        ordersCount: tempOrderCount,
        avgOrdersPerDay: tempAvgOrdersPerDay,
        expectedOrders: tempExpectedOrders,
      },
    };

    tempObj = Object.assign(tempObj, obj);

    return tempObj;
  };

  const getRefundData = async (ordersData, tempObj, days) => {
    let tempOrderCount = 0;
    let refundTotal = 0;
    let refundCount = 0;

    await ordersData.map(async (order) => {
      order.hasOwnProperty("refundData")
        ? order.refundData.length !== 0
          ? await order.refundData.map((refundData) => {
              refundTotal = refundTotal + refundData.refundAmount / 100;
            })
          : null
        : null;

      order.hasOwnProperty("refundData")
        ? order.refundData.length !== 0
          ? refundCount++
          : null
        : null;

      tempOrderCount++;
    });

    let tempRefundPerOrderAvg = (
      parseFloat(refundCount) / parseFloat(tempOrderCount)
    ).toFixed(2);
    let tempAvgRefund = (
      parseFloat(refundTotal) / parseFloat(refundCount)
    ).toFixed(2);
    let tempTotalRefund = parseFloat(refundTotal).toFixed(2);
    let numberOfRefunds = parseFloat(refundCount);

    const obj = {
      refundStats: {
        totalRefund: tempTotalRefund,
        avgRefundPerOrder: tempAvgRefund,
        percentRefunded: tempRefundPerOrderAvg,
        numberOfRefunds: numberOfRefunds,
      },
    };

    tempObj = Object.assign(tempObj, obj);

    return tempObj;
  };

  const getTipsData = async (ordersData, tempObj, days) => {
    let tempOrderCount = 0;
    let tempTipsTotal = 0;
    let tempOrdersTotal = 0;
    let tempTipCount = 0;

    let dailytip = 0;
    let tempHighestDay = 0;
    let tempLowestDay = 1000;
    let currentDate = 0;

    let refundTotal = 0;
    let refundPerOrder = 0;

    let initalRaw = 0;
    let newRaw = 0;
    let newTip = 0;

    await ordersData.map(async (order) => {
      refundPerOrder = 0;
      // console.log("order number", order.number);
      order.hasOwnProperty("refundData")
        ? order.refundData.length !== 0
          ? order.refundData.map((refundData) => {
              refundPerOrder = refundPerOrder + refundData.refundAmount / 100;
              refundTotal = refundTotal + refundData.refundAmount / 100;
            })
          : null
        : null;

      // refundPerOrder === order.total / 100 ? (order.tip = 0) : null;
      refundPerOrder !== 0
        ? ((initalRaw = order.total / 100 - order.tip - order.tax),
          (newRaw =
            (order.total / 100 - refundPerOrder) /
            (1 +
              order.tip / initalRaw +
              order.tax / initalRaw +
              order.AMFee / initalRaw)),
          (newTip = newRaw * (order.tip / initalRaw)),
          (order.tip = Math.abs(newTip)))
        : null;

      tempOrderCount++;
      tempTipsTotal = tempTipsTotal + order.tip;
      tempOrdersTotal = tempOrdersTotal + order.total / 100 - refundPerOrder;
      order.tip === "none" ? null : tempTipCount++;

      // basically need to write that IF the date changes, do comparisons and update totals to 0 + whatever. Else add to totals.
      order.createdAt
        ? (order.createdAt && currentDate === 0
            ? (currentDate = order.createdAt.toDate().getDate())
            : null,
          order.createdAt.toDate().getDate() === currentDate
            ? (dailytip = order.tip + dailytip)
            : (dailytip > tempHighestDay ? (tempHighestDay = dailytip) : null,
              dailytip < tempLowestDay ? (tempLowestDay = dailytip) : null,
              (dailytip = order.tip),
              (currentDate = order.createdAt.toDate().getDate())),
          ordersData[ordersData.length - 1] === order
            ? (dailytip > tempHighestDay ? (tempHighestDay = dailytip) : null,
              dailytip < tempLowestDay ? (tempLowestDay = dailytip) : null,
              (currentDate = order.createdAt.toDate().getDate()))
            : null)
        : null;
    });

    let tempAvgTipPerOrder = (tempTipsTotal / tempOrderCount).toFixed(2);
    let tempAvgTipPercentPerOrder = (tempTipsTotal / tempOrdersTotal).toFixed(
      2
    );
    let tempPercentTippers = (tempTipCount / tempOrderCount).toFixed(2);
    let tempDailyAvgTips = (tempTipsTotal / days).toFixed(2);
    let useTempTotalTips = parseFloat(tempTipsTotal).toFixed(2);
    let tempHighestDayTips = tempHighestDay;
    let tempLowestDayTips = tempLowestDay;

    const obj = {
      tipStats: {
        avgTipPerOrder: tempAvgTipPerOrder,
        avgTipPercentOrder: tempAvgTipPercentPerOrder,
        percentTipers: tempPercentTippers,
        dailyAvgTips: tempDailyAvgTips,
        highestDayTips: tempHighestDayTips,
        lowestDayTips: tempLowestDayTips,
        totalTips: useTempTotalTips,
      },
    };

    tempObj = Object.assign(tempObj, obj);

    return tempObj;
  };

  const getProfitData = async (ordersData, tempObj) => {
    let tempCountArray = [];
    let tempNumbersArray = [];

    let tempProfit = 0;
    let currentDate = 0;
    let tempTotalProfit = 0;

    let refundTotal = 0;
    let refundPerOrder = 0;

    await ordersData.map((order) => {
      refundPerOrder = 0;
      // console.log("order number", order.number);
      order.hasOwnProperty("refundData")
        ? order.refundData.length !== 0
          ? order.refundData.map((refundData) => {
              refundPerOrder = refundPerOrder + refundData.refundAmount / 100;
              refundTotal = refundTotal + refundData.refundAmount / 100;
            })
          : null
        : null;
      // console.log("Refund Per order", refundPerOrder);
      // console.log("Refund Total", refundTotal);

      tempTotalProfit =
        tempTotalProfit +
        Math.max(
          order.total / 100 -
            order.tip -
            order.AMFee -
            order.tax -
            refundPerOrder,
          0
        ) -
        ((order.stripeTotal / 100) * 0.029 + 0.3);
      order.createdAt
        ? (order.createdAt && currentDate === 0
            ? (currentDate = order.createdAt.toDate().getDate())
            : null,
          order.createdAt.toDate().getDate() === currentDate
            ? (tempProfit =
                tempProfit +
                (order.total / 100 -
                  order.tip -
                  order.AMFee -
                  order.tax -
                  ((order.stripeTotal / 100) * 0.029 + 0.3) -
                  refundPerOrder))
            : (tempCountArray.push(currentDate),
              tempNumbersArray.push(tempProfit),
              (tempProfit =
                order.total / 100 -
                order.tip -
                order.AMFee -
                order.tax -
                ((order.stripeTotal / 100) * 0.029 + 0.3) -
                refundPerOrder),
              (currentDate = order.createdAt.toDate().getDate())),
          //   console.log(tempProfit);

          ordersData[ordersData.length - 1] === order
            ? (tempCountArray.push(currentDate),
              tempNumbersArray.push(tempProfit))
            : null)
        : null;
    });

    let useTempTotalProfit = parseFloat(tempTotalProfit).toFixed(2);

    const obj = {
      profitStats: {
        totalProfit: useTempTotalProfit,
        labels: tempCountArray,
        datasets: [
          { data: tempNumbersArray },
          {
            data: [100],
            color: () => "transparent",
            strokeDashArray: [0, 1000],
            strokeWidth: 0,
            withDots: false,
            // backgroundColor: "transparent",
            // backgroundGradientFrom: "transparent",
            // backgroundGradientTo: "transparent",
          },
        ],
      },
    };

    tempObj = Object.assign(tempObj, obj);

    return tempObj;
  };

  const getTotalSalesData = async (ordersData, tempObj) => {
    let tempCountArray = [];
    let tempNumbersArray = [];

    let tempProfit = 0;
    let currentDate = 0;
    let tempTotalSales = 0;

    await ordersData.map((order) => {
      // console.log("refund total", refundTotal);
      // console.log("refund Per Order total", refundPerOrder);

      //   order.createdAt ? console.log(order.number) : null;
      // console.log(
      //   order.number,
      //   " ",
      //   order.total,
      //   " ",
      //   order.AMFee,
      //   " ",
      //   refundPerOrder
      // );
      tempTotalSales = Math.max(tempTotalSales + order.total / 100, 0);
      order.createdAt
        ? (order.createdAt && currentDate === 0
            ? (currentDate = order.createdAt.toDate().getDate())
            : null,
          order.createdAt.toDate().getDate() === currentDate
            ? (tempProfit = Math.max(tempProfit + order.total / 100, 0))
            : (tempCountArray.push(currentDate),
              tempNumbersArray.push(tempProfit),
              (tempProfit = Math.max(order.total / 100, 0)),
              (currentDate = order.createdAt.toDate().getDate())),
          ordersData[ordersData.length - 1] === order
            ? (tempCountArray.push(currentDate),
              tempNumbersArray.push(tempProfit))
            : // console.log("Temp Profit being pushed", tempProfit)
              null)
        : null;
    });

    let useTempTotalSales = parseFloat(tempTotalSales).toFixed(2);

    // console.log("total sales", useTempTotalSales);
    const obj = {
      totalSalesStats: {
        totalSales: useTempTotalSales,
        labels: tempCountArray,
        datasets: [
          { data: tempNumbersArray },
          {
            data: [150],
            color: () => "transparent",
            strokeDashArray: [0, 1000],
            strokeWidth: 0,
            withDots: false,
            // backgroundColor: "transparent",
            // backgroundGradientFrom: "transparent",
            // backgroundGradientTo: "transparent",
          },
        ],
      },
    };

    tempObj = Object.assign(tempObj, obj);

    return tempObj;
  };

  const manipulateData = async (data, days, set) => {
    //Days is the number of days relative to the period. daily, weekly, monthly etc
    return new Promise(async (resolve, reject) => {
      let tempObj = {};
      //already maping through orders, so do not need to repeat in functions for stats

      if (data.length === 0) {
        resolve(tempObj);
      } else {
        //start manipulation
        tempObj = await getAvgOrderStats(data, tempObj);
        tempObj = await getFeesData(data, tempObj);
        tempObj = await getCustomersServedData(data, tempObj, days);
        tempObj = await getTipsData(data, tempObj, days);
        tempObj = await getProfitData(data, tempObj);
        tempObj = await getTotalSalesData(data, tempObj);
        tempObj = await getRefundData(data, tempObj);

        resolve(tempObj);
      }
    });
  };

  const SendToManipulateFunction = (daily, weekly, monthly, daysArray) => {
    // console.log(daysArray);
    // daily.map((order) => console.log("daily", order.number));
    // weekly.map((order) => console.log("weekly", order.number));
    // monthly.map((order) => console.log("monthly", order.number));

    return new Promise(async (resolve, reject) => {
      var tempManipulatedDaily = await manipulateData(daily, daysArray[0]);

      var tempManipulatedWeekly = await manipulateData(weekly, daysArray[1]);

      let tempManipulatedMonthly = await manipulateData(monthly, daysArray[2]);
      //   console.log("tempManipulatedMonthly", tempManipulatedDaily);
      //   console.log("tempManipulatedMonthly", tempManipulatedWeekly);
      //   console.log("tempManipulatedMonthly", tempManipulatedMonthly);
      resolve([
        tempManipulatedDaily,
        tempManipulatedWeekly,
        tempManipulatedMonthly,
      ]);
    });
  };

  const updateSalesData = () => {
    try {
      getDatesFunction().then((res) => {
        // console.log("monthly", res[2]);
        getOrdersFunction(res[0], res[1], res[2]).then((orders) => {
          // console.log("triggered");
          // console.log("daily orders", orders[0].length);
          // console.log("weekly orders", orders[1].length);
          // console.log("monthly orders", orders[2].length);
          SendToManipulateFunction(
            orders[0], // daily orders
            orders[1], // weekly orders
            orders[2], // monthly orders
            orders[3] // info for function
          ).then((manipulatedData) => {
            // console.log(manipulatedData[0]);
            setDailyData(manipulatedData[0]);
            setWeeklyData(manipulatedData[1]);
            setMonthlyData(manipulatedData[2]);
            // console.log("full manipulated data", manipulatedData);
          });
        });
      });
    } catch (e) {
      // UseSentry.Native.captureException(new Error(e));
    }
  };

  useEffect(() => {
    // console.log(account);
    if ((account === "restaurant" && RestName) || account === "admin") {
      // console.log("entire sales script is getting triggered");
      updateSalesData();
    }
  }, [accountType, account, RestName, previousInputValue.current]);

  return (
    <SalesContext.Provider
      value={{
        dailyData,
        weeklyData,
        monthlyData,
        updateSalesData,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};
