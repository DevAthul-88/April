import React, { Fragment } from "react"
import { Text, View, StyleSheet } from "@react-pdf/renderer"
import { Country } from "country-state-city"
import getSymbolFromCurrency from "currency-symbol-map"

const borderColor = "#3778C2"
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#3778C2",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  description: {
    width: "60%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  rate: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  amount: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
})

const InvoiceTableRow = ({ items, country }) => {
  const rows = items.map((item, index) => (
    <View style={styles.row} key={index}>
      <Text style={styles.description}>{item.details}</Text>
      <Text style={styles.qty}>{item.quantity}</Text>
      <Text style={styles.rate}>
        {getSymbolFromCurrency(Country.getCountryByCode(country).currency)} {item.price}
      </Text>
      <Text style={styles.amount}>
        {getSymbolFromCurrency(Country.getCountryByCode(country).currency)}{" "}
        {(item.quantity * item.price).toFixed(2)}
      </Text>
    </View>
  ))
  return <Fragment>{rows}</Fragment>
}

export default InvoiceTableRow
