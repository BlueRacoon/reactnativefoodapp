/* eslint-disable prettier/prettier */
import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export const SalesChart = (props) => {
  // console.log(props.data.profitStats.labels);
  // console.log(props.data.profitStats.datasets);
  const { width, height } = Dimensions.get("window");
  console.log(height);

  return (
    <View
      style={
        {
          //   marginHorizontal: 20,
          //   marginTop: 40,
        }
      }
    >
      <LineChart
        data={{
          // labels: ["Jan", "Feb", "Mar", "Apr"],
          labels: props.data.labels,
          datasets: props.data.datasets,
          // datasets: [
          //   {
          //     data: [
          //       Math.random() * 100,
          //       Math.random() * 100,
          //       Math.random() * 100,
          //       Math.random() * 100,
          //     ],
          //   },
          // ],
        }}
        width={Dimensions.get("window").width * 0.96}
        height={
          Dimensions.get("window").height > 850
            ? Dimensions.get("window").height * 0.3
            : Dimensions.get("window").height * 0.3
        }
        yAxisSuffix="$"
        yAxisInterval={1}
        segments={5}
        fromZero
        chartConfig={{
          backgroundColor: "#FFF",
          backgroundGradientFrom: "#FFF",
          backgroundGradientTo: "#FFF",
          decimalPlaces: 2,
          color: (opacity = 0) => `rgba(255,0,0, ${opacity})`,
          labelColor: (opacity = 0) => `rgba(0,0,0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "red",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};
